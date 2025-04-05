import React, { useState, useEffect } from "react";
import { 
  Box, Button, Typography, Avatar, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Divider, Grid
} from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, CheckCircle, Cancel, Logout} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSessionIds } from "./redux/store";
import axios from "axios";
import avatar1 from "../assets/avatars/1.png";
import avatar2 from "../assets/avatars/2.png";
import avatar3 from "../assets/avatars/3.png";
import avatar4 from "../assets/avatars/4.png";
import avatar5 from "../assets/avatars/5.png";
import { useNavigate } from "react-router-dom";

const avatars = [
  { id: 1, src: avatar1 },
  { id: 2, src: avatar2 },
  { id: 3, src: avatar3 },
  { id: 4, src: avatar4 },
  { id: 5, src: avatar5 }
];


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const selectedChildId = useSelector((state: any) => state.selectedChildId);
  const sessionData = useSelector((state: any) => state.sessionData); 
  const [sessionStarted, setSessionStarted] = useState(false);
  const [childProfile, setChildProfile] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChildId) {
      fetchChildProfile(selectedChildId);
      fetchSessionData(selectedChildId);
    }
  }, [selectedChildId]);



  useEffect(() => {
    // Check if there's a stored session in localStorage
    const storedSession = localStorage.getItem("sessionData");
    if (storedSession) {
      dispatch(setSessionIds(JSON.parse(storedSession))); // Restore session
      setSessionStarted(true); // Ensure session UI updates
    }
  }, []);

  useEffect(() => {
    const storedChildId = localStorage.getItem("selectedChildId");
  
    if (storedChildId) {
      dispatch({ type: "SELECT_CHILD", payload: Number(storedChildId) }); // Restore from localStorage
    }
  }, []);


  const fetchChildProfile = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-child-profile`, {
        params: { ChildID: childId }
      });
      if (response.data) {
        setChildProfile(response.data);
        localStorage.setItem("selectedChildId", childId); // Store child ID persistently
      }
    } catch (error) {
      console.error("Error fetching child profile:", error);
    }
  };
  

  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.removeItem("sessionData"); // Clear stored session
    localStorage.removeItem("selectedChildId"); // Clear child profile data
    localStorage.clear(); // Remove all stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };
  
  

  const fetchSessionData = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-session/${childId}`);
  
      if (response.data) {
        const { SessionID } = response.data;
  
        dispatch(
          setSessionIds({
            SessionID,
            QuestionnaireID: null,
            GameSessionID: null,
            ReportID: null,
          })
        );
        setSessionStarted(true);
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const startSession = async () => {
    if (!selectedChildId) {
      alert("Please select a child profile first.");
      return;
    }
  
    if (sessionData?.SessionID) {
      alert("You already have an active session.");
      setSessionStarted(true);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/api/start-session", {
        ChildID: selectedChildId,
      });
  
      const { SessionID } = response.data;
  
      const sessionPayload = {
        SessionID,
        QuestionnaireID: null,
        GameSessionID: null,
        ReportID: null,
      };


      dispatch(setSessionIds(sessionPayload));
  
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start session.");
    }
  };

  const getCompletionStatus = (completed: boolean) => {
    return completed ? <CheckCircle sx={{ color: "green" }} /> : <Cancel sx={{ color: "red" }} />;
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
      const response = await axios.get(`http://localhost:5001/api/get-session-status-by-id/${sessionId}`);
  
      const statusData = response.data;
  
      // Store each status value as a string
      for (const key of [
        "FishStatus",
        "HumanObjStatus",
        "EmotionStatus",
        "SpeechStatus",
        "BalloonStatus",
        "QuesStatus"
      ]) {
        localStorage.setItem(key, statusData[key]);
      }
  
    } catch (error) {
      console.error("Error fetching session status:", error);
    }
  };

  const getStoredSessionStatus = () => {
    const FishStatus = localStorage.getItem("FishStatus");
    const HumanObjStatus = localStorage.getItem("HumanObjStatus");
    const EmotionStatus = localStorage.getItem("EmotionStatus");
    const SpeechStatus = localStorage.getItem("SpeechStatus");
    const BalloonStatus = localStorage.getItem("BalloonStatus");
    const QuesStatus = localStorage.getItem("QuesStatus");
    
    console.log('Stored Status:', {
      FishStatus,
      HumanObjStatus,
      EmotionStatus,
      SpeechStatus,
      BalloonStatus,
      QuesStatus,
    });

    return {
      FishStatus: localStorage.getItem("FishStatus") === "true",
      HumanObjStatus: localStorage.getItem("HumanObjStatus") === "true",
      EmotionStatus: localStorage.getItem("EmotionStatus") === "true",
      SpeechStatus: localStorage.getItem("SpeechStatus") === "true",
      BalloonStatus: localStorage.getItem("BalloonStatus") === "true",
      QuesStatus: localStorage.getItem("QuesStatus") === "true",
    };
  };
  
  useEffect(() => {
    if (sessionData?.SessionID) {
      fetchAndStoreSessionStatus(sessionData.SessionID);
    }
  }, [sessionData?.SessionID]); 

  const storedStatus = getStoredSessionStatus();
  
  return (
    <Box display="flex" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
      
      {/* Sidebar */}
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
                <ListItemButton onClick={handleProfileSelection}>
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
              <ListItemButton component={Link} to="/audio-analysis">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }}/>
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
                <ListItemButton onClick={handleLogout}> {/* Call handleLogout on click */}
                  <ListItemIcon>
                    <Logout sx={{ color: "#003366" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} p={4}>
        
        {/* Welcome Section */}
        <Typography variant="h5" align="center" sx={{ color: "#003366", fontWeight: "bold", mb: 3 }}>
        🎉 Welcome to Chavez! 🎉
        </Typography>

        <Grid container spacing={3}>

          {/* Child Profile Card */}
          <Grid item xs={12} md={6}>
            <Box bgcolor="#ffffff" p={3} borderRadius="12px" boxShadow={2} display="flex" alignItems="center">
            <Avatar 
                src={childProfile && childProfile.Avatar ? avatars.find(a => a.id === childProfile.Avatar)?.src : ""}
                sx={{ width: 80, height: 80, bgcolor: "#003366", color: "#fff" }} 
              />
              <Box ml={3}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                  {childProfile ? childProfile.Name : "No Child Selected"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Track and manage your child’s assessment journey here.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Report Summary */}
          <Grid item xs={12} md={6}>
            <Box 
              bgcolor="#003366"  // Blue background
              p={3} 
              borderRadius="12px" 
              boxShadow={2}  
              sx={{ minHeight: "100px" }} 
            >
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>  {/* White text */}
                Report Summary
              </Typography>
              <Typography variant="body2" sx={{ color: "#FFFFFF", mt: 1 }}>  {/* White text */}
                No report for now
              </Typography>
            </Box>
          </Grid>

         {/* Progress Section */}
         <Grid item xs={12} md={6}>
          <Box bgcolor="#ffffff" p={3} borderRadius="12px" boxShadow={2}>
            <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
              Progress
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
                {/* {getCompletionStatus(sessionData?.QuesStatus)} */}
                {getCompletionStatus(storedStatus.QuesStatus)}
              </ListItem>
              <ListItem>
                <ListItemText primary="Pop the Balloon" sx={{ color: "#003366" }} />
                {getCompletionStatus(storedStatus.BalloonStatus)}
              </ListItem>
              <ListItem>
                <ListItemText primary="Follow the Fish" sx={{ color: "#003366" }} />
                {getCompletionStatus(storedStatus.FishStatus)}
              </ListItem>
              <ListItem>
                <ListItemText primary="Human vs Object" sx={{ color: "#003366" }} />
                {getCompletionStatus(storedStatus.HumanObjStatus)}
              </ListItem>
              <ListItem>
                <ListItemText primary="Emotion Puzzle" sx={{ color: "#003366" }} />
                {getCompletionStatus(storedStatus.EmotionStatus)}
              </ListItem>
              <ListItem>
                <ListItemText primary="Speech Analysis" sx={{ color: "#003366" }} />
                {getCompletionStatus(storedStatus.SpeechStatus)}
              </ListItem>
            </List>
          </Box>
        </Grid>


          {/* CTA Buttons */}
          <Grid item xs={12}>
            {!sessionStarted ? (
              <Button
                variant="contained"
                fullWidth
                sx={{ textTransform: "none", bgcolor: "#003366", color: "#ffffff" }}
                onClick={startSession}
              >
                Start Session
              </Button>
            ) : (
              <Box display="flex" gap={2}>
                <Button variant="contained" sx={{ bgcolor: "#003366", color: "#fff" }} component={Link} to="/questionnaire" fullWidth>
                  ASD Questionnaire
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#003366", color: "#003366" }} component={Link} to="/game-selection" fullWidth>
                  Gamified Assessments
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#003366", color: "#003366" }} component={Link} to="/audio-analysis" fullWidth>
                  Speech Analysis
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#003366", color: "#003366" }} component={Link} to="/reports" fullWidth>
                  Reports
                </Button>
              </Box>
            )}
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;