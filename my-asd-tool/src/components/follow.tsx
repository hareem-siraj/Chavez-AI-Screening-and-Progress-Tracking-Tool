// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import styles from "../theme/Questions.module.css";
// // import logo from "../assets/logo.png"; // Adjust the path based on your project structure
// import { Box } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// // import { response } from "express";

// const GamifiedAssesments: React.FC = () => {
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const navigate = useNavigate();
//   const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;

//   console.log("SessionID:", sessionID);
//   const [eyeTrackingStatus, setEyeTrackingStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  
//   const stopEyeTracking = async () => {
//     if (!sessionID) {
//         console.error("Cannot stop eye tracking: SessionID is missing");
//         return;
//     }

//     console.log("Stopping eye tracking for SessionID:", sessionID);

//     try {
//         const response = await axios.post("https://pythonserver-models-i4h5.onrender.com/stop-eyetracking/", { sessionID });
//         console.log("Eye tracking stop response:", response.data);
        
//         const markBalloonStatusAndNavigate = async () => {
//           try {
//             await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-fish-status-true/${sessionID}`, {
//               method: "POST",
//             });
//             // stopEyeTracking();
//             console.log("Fish status marked as true");
//           } catch (error) {
//             console.error("Error marking balloon status:", error);
//           }
  
//           navigate("/game-selection");
//         };

//         if (response.data.message) {
//             console.log("Eye tracking stopped successfully");
//             setEyeTrackingStatus("idle");

//             // Delay navigation slightly to ensure camera stops
//             setTimeout(() => {
//                 // navigate("/game-selection");
//                 markBalloonStatusAndNavigate();
//             }, 1000);
      

//         } else {
//             console.error("Eye tracking failed to stop:", response.data.error);
//         }
//     } catch (error) {
//         console.error("Error stopping eye tracking:", error);
//     }
//   };

//   // Add event listener for messages from the iframe
//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       // Handle message from Unity WebGL
//       if (event.data === "gameEnded") {
//         console.log("Game ended message received");
//         stopEyeTracking();
//       }
//     };

//     // Add event listener
//     window.addEventListener("message", handleMessage);

//     // Clean up event listener when component unmounts
//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, [navigate]);

//     // Start eye tracking when component mounts
//     useEffect(() => {
//       if (sessionID && eyeTrackingStatus === 'idle') {
//         startEyeTracking();
//       }
      
//       return () => {
//         // Cleanup when component unmounts
//         if (eyeTrackingStatus === 'running') {
//           console.log("Component unmounting, eye tracking will stop automatically");
//         }
//       };
//     }, [sessionID]);
  
//     const startEyeTracking = async () => {
//       if (!sessionID) {
//         console.error("Cannot start eye tracking: SessionID is missing");
//         setEyeTrackingStatus('error');
//         return;
//       }
  
//       setEyeTrackingStatus('starting');
//       console.log("Starting eye tracking with SessionID:", sessionID);
  
//       try {
//         // First check if camera permissions are granted
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
//         // Stop the stream right away, we just needed to check permissions
//         stream.getTracks().forEach(track => track.stop());
        
//         // Now call the backend to start eye tracking
//         // http://localhost:8000/start-eyetracking/
//         const response = await axios.post("https://pythonserver-models-i4h5.onrender.com/start-eyetracking/", { 
//           sessionID: sessionID 
//         });
        
//         console.log("Eye tracking response:", response.data);
        
//         if (response.data.message) {
//           console.log("Eye tracking started successfully");
//           setEyeTrackingStatus('running');
//         } else {
//           console.error("Eye tracking failed to start:", response.data.error);
//           setEyeTrackingStatus('error');
//         }
//       } catch (error) {
//         console.error("Error starting eye tracking:", error);
//         setEyeTrackingStatus('error');
//       }
//     };

//   return (
//     <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
//       {/* Sidebar */}
//           <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
//             <Box className={styles.main}>
//               <div className={styles.path}>Gamified Assessments</div>
//               {eyeTrackingStatus === 'starting' && " (Starting eye tracking...)"}
//               {eyeTrackingStatus === 'running' && " (Eye tracking active)"}
//               {eyeTrackingStatus === 'error' && " (Eye tracking error)"}
//               <div>
//                 <iframe
//                   ref={iframeRef}
//                   title="Fish Game"
//                   // src="FISH_BUILD/index.html"
//                   // src={`/FISH_BUILD/index.html?SessionID=${sessionID}`}
//                   src={`https://fish-game-5szp.onrender.com?SessionID=${sessionID}`}
//                   width="100%"
//                   height="100%"
//                   style={{
//                     border: "none",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100vw",
//                     height: "100vh",
//                   }}
//                   allowFullScreen
//                   sandbox="allow-scripts allow-same-origin allow-top-navigation"
//                 ></iframe>
//               </div>
//             </Box>
//           </Box>

//     </Box>

//   );
// };

// export default GamifiedAssesments;



"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../theme/Questions.module.css";
// import logo from "../assets/logo.png"; // Adjust the path based on your project structure
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { response } from "express";

// @ts-ignore
import * as faceMesh from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const GamifiedAssesments: React.FC = () => {
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
      await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-fish-status-true/${sessionID}`, {
        method: "POST",
      });
  
      const path = scanpathRef.current;
      if (path.length > 0) {
        await fetch("https://chavez-ai-screening-and-progress.onrender.com/api/save-follow-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            SessionID: sessionID,
            ScanPath: path,
            Timestamp: new Date().toISOString(),
          }),
        });

        await fetch("https://pythonserver-models-i4h5.onrender.com/process-follow-data/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            SessionID: sessionID,
            ScanPath: path,
            Timestamp: new Date().toISOString(),
          }),
        });
      }
  
      navigate("/game-selection");
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
      {/* Sidebar */}
          <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
            <Box className={styles.main}>
              <div className={styles.path}>Gamified Assessments</div>
              {eyeTrackingStatus === 'starting' && " (Starting eye tracking...)"}
              {eyeTrackingStatus === 'running' && " (Eye tracking active)"}
              {eyeTrackingStatus === 'error' && " (Eye tracking error)"}
              <video ref={videoRef} style={{ display: 'none' }}></video>
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
            </Box>
          </Box>

    </Box>

  );
};

export default GamifiedAssesments;