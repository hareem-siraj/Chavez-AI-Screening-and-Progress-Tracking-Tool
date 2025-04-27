"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Person, QuestionAnswer, Logout} from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
// import { response } from "express";
import { setSessionIds } from "./redux/store";
import { useDispatch } from "react-redux";
import { 
  Button, AppBar, Toolbar, IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png"; 

const Audio: React.FC = () => {
  // const location = useLocation();
  // const SessionID = useSelector((state: any) => state.sessionData?.SessionID);
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;
  console.log("SessionID:", sessionID);

  const [storedStatus, setStoredStatus] = useState({
    FishStatus: true,
    HumanObjStatus: true,
    EmotionStatus: true,
    SpeechStatus: false,
    BalloonStatus: true,
    QuesStatus: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear(); // Clear stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

  const handleProfileSelection = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.removeItem("sessionData"); // Clear stored session
    localStorage.removeItem("selectedChildId"); // Clear child profile data
    localStorage.clear(); // Clear all stored data
    sessionStorage.clear();
    navigate("/profile-selection"); // Fallback in case userId is missing
  };
  const [videoLoaded, setVideoLoaded] = React.useState(false);

  const fetchAndStoreSessionStatus = async (sessionId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-session-status-by-id/${sessionId}`);
      const statusData = response.data;

      const updatedStatus = {
        FishStatus: statusData.FishStatus === "true",
        HumanObjStatus: statusData.HumanObjStatus === "true",
        EmotionStatus: statusData.EmotionStatus === "true",
        SpeechStatus: statusData.SpeechStatus === "true",
        BalloonStatus: statusData.BalloonStatus === "true",
        QuesStatus: statusData.QuesStatus === "true",
      };

      setStoredStatus(updatedStatus);
    } catch (error) {
      console.error("Error fetching session status:", error);
    }
  };

  useEffect(() => {
    if (sessionID) {
      fetchAndStoreSessionStatus(sessionID);
    }
  }, [sessionID]);

  useEffect(() => {
    if (videoLoaded) {
      console.log("Video loaded");

      //call FastAPI to start video processing
      axios.post("http://localhost:8000/process-video/", { sessionID })
        .then(response => {
          console.log("Audio processing started:", response.data);}
        )
        .catch(error => {console.error("Error starting audio processing:", error)});
    }
  }, [videoLoaded]);

  const markNavigate = async () => {
    console.log("Video has ended. Waiting 5 seconds before navigating...");
    try {
      await fetch(`http://localhost:5001/api/mark-speech-status-true/${sessionID}`, {
        method: "POST",
      });
      // stopEyeTracking();
      console.log("speech status marked as true");
    } catch (error) {
      console.error("Error marking speech status:", error);
    }
    setTimeout(() => {
      navigate("/dashboard"); // Replace with your actual route
    }, 5000);
  };

  return (

    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">

            {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: "#003366" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box component="img" 
            src={logoImage} 
            alt="Chavez Logo"
            sx={{ 
              height: 60, // Adjust height as needed
              maxHeight: "100%",
              py: 1 // Adds some padding on top and bottom
            }}
          />

          <Box display="flex" alignItems="center">
            {/* Nav Links */}

            <IconButton color="inherit" component={Link} to="/dashboard">
              <Home />
            </IconButton>            
            {/* Profile and Logout */}
            <IconButton color="inherit" onClick={handleProfileSelection}>
              <Person />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box flex="1" display="flex" justifyContent="center" alignItems="center">
        <video
          id="video"
          width="80%"
          height="auto"
          controls
          autoPlay
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={() => {
            console.log("Video has ended.");

            // navigate("/dashboard");
            markNavigate();

          }}
        >
          <source src="/audiovideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    </Box>
  );
};

export default Audio;