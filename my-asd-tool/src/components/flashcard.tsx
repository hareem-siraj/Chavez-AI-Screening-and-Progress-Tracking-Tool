"use client";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../theme/Questions.module.css";
import { Box, Typography } from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout, HelpOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
import { response } from "express";

const FlashCard: React.FC = () => {
  const location = useLocation();
  // const SessionID = useSelector((state: any) => state.sessionData?.SessionID);
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;
  console.log("SessionID:", sessionID);

  const [videoLoaded, setVideoLoaded] = React.useState(false);

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

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
     <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
        <Box>
          <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
            Chavez
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile-selection">
                <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Profile" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire">
                <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Reports" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/sign-in">
                  <ListItemIcon>
                    <Logout sx={{ color: "#003366" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>

      {/* Video Display */}
      <Box flex="1" display="flex" justifyContent="center" alignItems="center">
        <video
          id="video"
          width="80%"
          height="auto"
          controls
          autoPlay
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/audiogame1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    </Box>
  );
};

export default FlashCard;




