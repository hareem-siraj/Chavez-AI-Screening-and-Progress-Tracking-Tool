"use client";

import React, { useEffect, useRef } from "react";
import styles from "../theme/Questions.module.css";
// import logo from "../assets/logo.png"; // Adjust the path based on your project structure
import { Box } from "@mui/material";
// import { Home, Assessment } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
// import { Person, QuestionAnswer, Settings, Logout, HelpOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PuzzleUrdu: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;
  console.log("SessionID:", sessionID);

  // // Add event listener for messages from the iframe
  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     // Handle message from Unity WebGL
  //     if (event.data === "gameEnded") {
  //       console.log("Game ended message received");

  //       const markBalloonStatusAndNavigate = async () => {
  //         try {
  //           await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-emotion-status-true/${sessionID}`, {
  //             method: "POST",
  //           });
  //           console.log("Emotion status marked as true");
  //         } catch (error) {
  //           console.error("Error marking balloon status:", error);
  //         }
  
  //         navigate("/game-selection");
  //       };
  
  //       markBalloonStatusAndNavigate();

  //       // Navigate using React Router instead of window.location
  //       // navigate("/game-selection");
  //     }
  //   };

  //   // Add event listener
  //   window.addEventListener("message", handleMessage);

  //   // Clean up event listener when component unmounts
  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, [navigate]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "gameEnded") {
        console.log("Game ended message received");
  
        const markBalloonStatusAndNavigate = async () => {
          try {
            await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-emotion-status-true/${sessionID}`, {
              method: "POST",
            });
            console.log("✅ Emotion status marked as true");
  
            // const response = await fetch("https://pythonserver-models-i4h5.onrender.com/process-balloon-emotion/", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ sessionID }),
            // });
  
            // const result = await response.json();
            // console.log("✅ FastAPI prediction result:", result);

          // Fire-and-forget: don't await the long-running processing
          fetch("https://pythonserver-models-i4h5.onrender.com/process-balloon-emotion/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionID }),
          })
            .then(res => res.json())
            .then(result => console.log("✅ FastAPI prediction result:", result))
            .catch(err => console.error("❌ Background processing error:", err));
            
          } catch (error) {
            console.error("❌ Error calling APIs:", error);
          }
  
          setTimeout(() => {
            navigate("/game-selection-urdu");
          }, 5000);
        };
  
        markBalloonStatusAndNavigate();
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate, sessionID]);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      {/* Sidebar */}
          <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
            <Box className={styles.main}>
              <div className={styles.path}>Gamified Assessments</div>
              <div>
                <iframe
                  ref={iframeRef}
                  title="Puzzle Game"
                  // src={`/PUZZLE_BUILD/index.html?SessionID=${sessionID}`}
                  src={`https://puzzle-game-zscm.onrender.com?SessionID=${sessionID}`}
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

export default PuzzleUrdu;


