"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../theme/Questions.module.css";
// import logo from "../assets/logo.png"; // Adjust the path based on your project structure
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { response } from "express";

const GamifiedAssesments: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;

  console.log("SessionID:", sessionID);
  const [eyeTrackingStatus, setEyeTrackingStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  
  const stopEyeTracking = async () => {
    if (!sessionID) {
        console.error("Cannot stop eye tracking: SessionID is missing");
        return;
    }

    console.log("Stopping eye tracking for SessionID:", sessionID);

    try {
        const response = await axios.post("http://localhost:8000/stop-eyetracking/", { sessionID });
        console.log("Eye tracking stop response:", response.data);
        
        const markBalloonStatusAndNavigate = async () => {
          try {
            await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-fish-status-true/${sessionID}`, {
              method: "POST",
            });
            // stopEyeTracking();
            console.log("Fish status marked as true");
          } catch (error) {
            console.error("Error marking balloon status:", error);
          }
  
          navigate("/game-selection");
        };

        if (response.data.message) {
            console.log("Eye tracking stopped successfully");
            setEyeTrackingStatus("idle");

            // Delay navigation slightly to ensure camera stops
            setTimeout(() => {
                // navigate("/game-selection");
                markBalloonStatusAndNavigate();
            }, 1000);
      

        } else {
            console.error("Eye tracking failed to stop:", response.data.error);
        }
    } catch (error) {
        console.error("Error stopping eye tracking:", error);
    }
  };

  // Add event listener for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle message from Unity WebGL
      if (event.data === "gameEnded") {
        console.log("Game ended message received");
        stopEyeTracking();
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

    // Start eye tracking when component mounts
    useEffect(() => {
      if (sessionID && eyeTrackingStatus === 'idle') {
        startEyeTracking();
      }
      
      return () => {
        // Cleanup when component unmounts
        if (eyeTrackingStatus === 'running') {
          console.log("Component unmounting, eye tracking will stop automatically");
        }
      };
    }, [sessionID]);
  
    const startEyeTracking = async () => {
      if (!sessionID) {
        console.error("Cannot start eye tracking: SessionID is missing");
        setEyeTrackingStatus('error');
        return;
      }
  
      setEyeTrackingStatus('starting');
      console.log("Starting eye tracking with SessionID:", sessionID);
  
      try {
        // First check if camera permissions are granted
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Stop the stream right away, we just needed to check permissions
        stream.getTracks().forEach(track => track.stop());
        
        // Now call the backend to start eye tracking
        const response = await axios.post("http://localhost:8000/start-eyetracking/", { 
          sessionID: sessionID 
        });
        
        console.log("Eye tracking response:", response.data);
        
        if (response.data.message) {
          console.log("Eye tracking started successfully");
          setEyeTrackingStatus('running');
        } else {
          console.error("Eye tracking failed to start:", response.data.error);
          setEyeTrackingStatus('error');
        }
      } catch (error) {
        console.error("Error starting eye tracking:", error);
        setEyeTrackingStatus('error');
      }
    };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      {/* Sidebar */}
          <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
            <Box className={styles.main}>
              <div className={styles.path}>Gamified Assessments</div>
              {eyeTrackingStatus === 'starting' && " (Starting eye tracking...)"}
              {eyeTrackingStatus === 'running' && " (Eye tracking active)"}
              {eyeTrackingStatus === 'error' && " (Eye tracking error)"}
              <div>
                <iframe
                  ref={iframeRef}
                  title="Fish Game"
                  // src="FISH_BUILD/index.html"
                  // src={`/FISH_BUILD/index.html?SessionID=${sessionID}`}
                  src={`https://fish-game-5szp.onrender.com?SessionID=${sessionID}`}
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
              </div>
            </Box>
          </Box>

    </Box>

  );
};

export default GamifiedAssesments;