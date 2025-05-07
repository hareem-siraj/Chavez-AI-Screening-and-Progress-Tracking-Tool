
"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { Home } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Person, Logout} from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
import { setSessionIds } from "./redux/store";
import { useDispatch } from "react-redux";
import { AppBar, Toolbar, IconButton} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png"; 
import { persistor } from './redux/store'; 

const Audio: React.FC = () => {
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;
  console.log("SessionID:", sessionID);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  
  const [storedStatus, setStoredStatus] = useState({
    FishStatus: true,
    HumanObjStatus: true,
    EmotionStatus: true,
    SpeechStatus: false,
    BalloonStatus: true,
    QuesStatus: true,
  });



  const handleLogout = async () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear();
    sessionStorage.clear();
    await persistor.purge(); // ✅ Clear persisted Redux state
    window.location.href = "/sign-in";
  };

  const handleProfileSelection = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.removeItem("sessionData"); // Clear stored session
    localStorage.removeItem("selectedChildId"); // Clear child profile data
    localStorage.clear(); // Clear all stored data
    sessionStorage.clear();
    navigate("/profile-selection"); // Fallback in case userId is missing
  };


  const fetchAndStoreSessionStatus = async (sessionId: string) => {
    try {
      const response = await axios.get(`https://chavez-ai-screening-and-progress.onrender.com/api/get-session-status-by-id/${sessionId}`);
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
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = async () => {
          setRecordedChunks(chunks);
          const formData = new FormData();
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          formData.append("file", audioBlob, "recording.webm");
          formData.append("session_id", sessionID.toString());

          try {
            const response = await fetch("https://pythonserver-models-i4h5.onrender.com/start-audio", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            console.log("📤 Audio uploaded:", result);

            try {
              await delay(6000);
              const response = await axios.post("https://pythonserver-models-i4h5.onrender.com/process-audio/", { sessionID });
              console.log("✅ Audio processed:", response.data);
            } catch (error) {
              console.error("❌ Error processing audio:", error);
            }

            // // Wait 5 seconds after upload, then redirect
            // setTimeout(() => {
            //   navigate("/dashboard");
            // }, 5000);
          } catch (error) {
            console.error("❌ Failed to upload audio:", error);
          }
        };

        setMediaRecorder(recorder);
        recorder.start();
        console.log("🎙️ MediaRecorder started");
      } catch (err) {
        console.error("Microphone access error:", err);
      }
    };

    const handleEnded = () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("🛑 MediaRecorder stopped");
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, [mediaRecorder, sessionID]);

  useEffect(() => {
    const video = document.getElementById("video");

    if (video) {
      video.addEventListener("ended", async () => {
        console.log("🎞️ Video ended, processing audio...");
        try {
          await fetch(`https://chavez-ai-screening-and-progress.onrender.com/api/mark-speech-status-true/${sessionID}`, {
            method: "POST",
          });
          console.log("✅ Speech status marked as true");
        } catch (error) {
          console.error("❌ Error marking speech status:", error);
        }

        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      });
    }
  }, []);

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
          ref={videoRef} 
          width="80%"
          height="auto"
          controls
          autoPlay
          onLoadedData={() => setVideoLoaded(true)}
          >
          <source src="/audiovideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    </Box>
  );
};

export default Audio;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
