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

const BalloonUrdu: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;
  console.log("SessionID:", sessionID);

  // Add event listener for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle message from Unity WebGL
      if (event.data === "gameEnded") {
        console.log("Game ended message received");


        const markBalloonStatusAndNavigate = async () => {
          try {
            await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-balloon-status-true/${sessionID}`, {
              method: "POST",
            });
            console.log("Balloon status marked as true");
          } catch (error) {
            console.error("Error marking balloon status:", error);
          }
  
          navigate("/game-selection-urdu");
        };
  
        markBalloonStatusAndNavigate();


        // Navigate using React Router instead of window.location
        // navigate("/game-selection");
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Clean up event listener when component unmounts
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
                  title="Balloon Game"
                  src={`/POP_Build/index.html?SessionID=${sessionID}`}
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

export default BalloonUrdu;


