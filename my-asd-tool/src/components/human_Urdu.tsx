"use client";

import React, { useEffect, useRef, useState  } from "react";
import styles from "../theme/Questions.module.css";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { response } from "express";

// @ts-ignore
import * as faceMesh from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const HumanUrdu: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;

  console.log("SessionID:", sessionID);
  const [eyeTrackingStatus, setEyeTrackingStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  const [scanpath, setScanpath] = useState<{x: number, y: number, timestamp: number}[]>([]);

  const scanpathRef = useRef<{x: number, y: number, timestamp: number}[]>([]);
  const cameraRef = useRef<Camera | null>(null);

const stopEyeTracking = async () => {
  if (!sessionID) return;
  console.log("Stopping eye tracking...");
  setEyeTrackingStatus("idle");

  // ✅ Stop MediaPipe camera
  if (cameraRef.current) {
    cameraRef.current.stop();
    cameraRef.current = null;
  }
  
  const stream = videoRef.current?.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoRef.current!.srcObject = null;
  }

  try {
    await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-humanobj-status-true/${sessionID}`, {
      method: "POST",
    });

    const path = scanpathRef.current;
    if (path.length > 0) {
      await fetch("https://chavez-ai-screening-and-progress.onrender.com/api/save-human-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SessionID: sessionID,
          ScanPath: path,
          Timestamp: new Date().toISOString(),
        }),
      });

      await fetch("https://pythonserver-models-i4h5.onrender.com/process-human-data/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SessionID: sessionID,
          ScanPath: path,
          Timestamp: new Date().toISOString(),
        }),
      });
    }

    navigate("/game-selection-urdu");
  } catch (error) {
    console.error("Error stopping or saving:", error);
  }
};

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "gameEnded") stopEyeTracking();
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [scanpath]);

  useEffect(() => {
    if (sessionID && eyeTrackingStatus === 'idle') startEyeTracking();
    return () => { if (eyeTrackingStatus === 'running') console.log("Component unmounted"); };
  }, [sessionID]);
  
  const startEyeTracking = async () => {
    if (!sessionID) return setEyeTrackingStatus('error');
    setEyeTrackingStatus('starting');

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const faceMeshInstance = new faceMesh.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshInstance.onResults((results) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
      const landmarks = results.multiFaceLandmarks[0];

      const getCenter = (indices: number[]) => {
        const points = indices.map(i => landmarks[i]);
        const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x, y };
      };

      const leftEye = getCenter([33, 160, 158, 133, 153, 144]);
      const rightEye = getCenter([362, 385, 387, 263, 373, 380]);
      const gazeX = (leftEye.x + rightEye.x) / 2;
      const gazeY = (leftEye.y + rightEye.y) / 2;
      const timestamp = Date.now();

      // setScanpath(prev => [...prev, { x: gazeX, y: gazeY, timestamp }]);
      scanpathRef.current.push({ x: gazeX, y: gazeY, timestamp });
    });

    cameraRef.current = new Camera(videoEl, {
      onFrame: async () => {
        await faceMeshInstance.send({ image: videoEl });
      },
      width: 640,
      height: 480,
    });
    
    await cameraRef.current.start();
    
    
    // cameraRef.current = camera; // Save camera for later stop

    // await camera.start();
    setEyeTrackingStatus('running');
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
        <Box className={styles.main}>
          <div className={styles.path}>Gamified Assessments</div>
          {eyeTrackingStatus === 'starting' && " (Starting eye tracking...)"}
          {eyeTrackingStatus === 'running' && " (Eye tracking active)"}
          {eyeTrackingStatus === 'error' && " (Eye tracking error)"}
          <video ref={videoRef} style={{ display: 'none' }}></video>
            <iframe
              ref={iframeRef}
              title="HumanVsObj Game"
              // src="HUMAN_BUILD/index.html?SessionID=${sessionID}"
              src={`https://hvo-game.onrender.com?SessionID=${sessionID}`}
              width="100%"
              height="100%"
              style={{
                border: "none",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
              }}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-top-navigation"
            ></iframe>
        </Box>
      </Box>
    </Box>

  );
};

export default HumanUrdu;
