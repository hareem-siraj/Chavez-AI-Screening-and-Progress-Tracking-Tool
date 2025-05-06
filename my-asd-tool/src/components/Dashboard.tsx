import React, { useState, useEffect } from "react";
import { 
  Box, Button, Typography, Avatar, List, ListItem, ListItemText, Grid, AppBar, Toolbar, IconButton
} from "@mui/material";
import { Home, Person, CheckCircle, Cancel, Logout, Lock} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSessionIds, } from "./redux/store";
import axios from "axios";
import avatar1 from "../assets/avatars/1.png";
import avatar2 from "../assets/avatars/2.png";
import avatar3 from "../assets/avatars/3.png";
import avatar4 from "../assets/avatars/4.png";
import avatar5 from "../assets/avatars/5.png";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png"; 
import { keyframes } from '@mui/system';
import { persistor } from './redux/store'; 

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
  const [loading, setLoading] = useState(true);


  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChildId) {
      fetchChildProfile(selectedChildId);
      fetchSessionData(selectedChildId);
      fetchAndStoreSessionStatus(sessionData.SessionID);
      fetchCompletedSessionsCount(selectedChildId);
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


  // const fetchChildProfile = async (childId: string) => {
  //   try {
  //     const response = await axios.get(`http://localhost:5001/api/get-child-profile`, {
  //       params: { ChildID: childId }
  //     });
  //     if (response.data) {
  //       setChildProfile(response.data);
  //       localStorage.setItem("selectedChildId", childId); // Store child ID persistently
  //     }
  //   } catch (error) {
  //     console.error("Error fetching child profile:", error);
  //   }
  // };

  const fetchChildProfile = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-child-profile`, {
        params: { ChildID: childId }
      });
      if (response.data) {
        setChildProfile(response.data);
        localStorage.setItem("selectedChildId", childId);
        setProfileLoaded(true); // ✅ Mark profile as loaded
      }
    } catch (error) {
      console.error("Error fetching child profile:", error);
      setProfileLoaded(true); // ✅ Avoid hanging loading on failure
    }
  };
  
  const fetchCompletedSessionsCount = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/completedSessionsCount/${childId}`);
      setCompletedSessionsCount(response.data.count);
      console.log(response.data.count);
    } catch (error) {
      console.error("Error fetching completed session count:", error);
    }
  };

  const fetchSessionData = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-session/${childId}`);
  
      if (response.data) {
        const { SessionID } = response.data;
  
        const sessionPayload = {
          SessionID,
          QuestionnaireID: null,
          GameSessionID: null,
          ReportID: null,
        };
        dispatch(setSessionIds(sessionPayload));
        localStorage.setItem("sessionData", JSON.stringify(sessionPayload));
        fetchAndStoreSessionStatus(SessionID); // ✅ Pass SessionID from payload
        setSessionStarted(true);
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setSessionLoaded(true); // ✅ Mark session as loaded (success or fail)
    }
  };

  // const handleLogout = () => {
  //   dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
  //   localStorage.removeItem("sessionData"); // Clear stored session
  //   localStorage.removeItem("selectedChildId"); // Clear child profile data
  //   localStorage.clear(); // Remove all stored data
  //   sessionStorage.clear();
  //   window.location.href = "/sign-in"; // Redirect to login page
  // };
  
  const handleLogout = async () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
  
    localStorage.removeItem("sessionData");
    localStorage.removeItem("selectedChildId");
    localStorage.clear();
    sessionStorage.clear();
  
    await persistor.purge(); // ✅ Clear persisted Redux state
  
    window.location.href = "/sign-in";
  };

  // const fetchSessionData = async (childId: string) => {
  //   try {
  //     const response = await axios.get(`http://localhost:5001/api/get-session/${childId}`);
  
  //     if (response.data) {
  //       const { SessionID } = response.data;
  
  //       const sessionPayload = {
  //         SessionID,
  //         QuestionnaireID: null,
  //         GameSessionID: null,
  //         ReportID: null,
  //       };
  //       dispatch(setSessionIds(sessionPayload));
  //       localStorage.setItem("sessionData", JSON.stringify(sessionPayload)); // <-- ADD THIS LINE
  //       fetchAndStoreSessionStatus(sessionData.SessionID);
  //       setSessionStarted(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching session data:", error);
  //   }
  // };


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
      localStorage.setItem("sessionData", JSON.stringify(sessionPayload)); // <-- ADD THIS LINE
      setSessionStarted(true);
  
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
    fetchAndStoreSessionStatus(sessionData.SessionID);
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
 
  const fetchChildIdFromSession = async (sessionId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-child-id-by-session/${sessionId}`);
      const { ChildID } = response.data;
      if (ChildID) {
        dispatch({ type: "SELECT_CHILD", payload: Number(ChildID) });
        await fetchChildProfile(ChildID); // Fetch child profile after retrieving child ID
      }
    } catch (error) {
      console.error("Failed to fetch child ID from session:", error);
    }
  };


  
  // Existing useEffect to load session from localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem("sessionData");
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      dispatch(setSessionIds(parsedSession));
      setSessionStarted(true);
      if (parsedSession.SessionID) {
        fetchChildIdFromSession(parsedSession.SessionID);
      }
    }
  }, []);

  useEffect(() => {
    const loadSessionStatus = async () => {
      if (sessionData?.SessionID) {
        await fetchAndStoreSessionStatus(sessionData.SessionID); // Wait until status is saved
        getStoredSessionStatus(); // Then load stored status
        // fetchCompletedSessionsCount(selectedChildId); 
        setLoading(false);
        
      } 

    };
  
    loadSessionStatus();
  }, [sessionData?.SessionID, sessionLoaded, profileLoaded]);
  
  
  const storedStatus = getStoredSessionStatus();

    // Check if all game statuses are completed
  const allGamesCompleted = 
    storedStatus.FishStatus && 
    storedStatus.HumanObjStatus && 
    storedStatus.EmotionStatus && 
    storedStatus.BalloonStatus;
  
  // Determine which sections are available based on completion status
  const isQuestionnaireAvailable = true; // Always available after session start
  const isQuestionnaireCompleted = storedStatus.QuesStatus;
  const isGameSelectionAvailable = storedStatus.QuesStatus;
  const isGameSelectionCompleted = allGamesCompleted;
  const isSpeechAnalysisAvailable = allGamesCompleted;
  const isSpeechAnalysisCompleted = storedStatus.SpeechStatus;
  const isReportsAvailable = storedStatus.SpeechStatus;
  
  const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
`;

const shineAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

  const createActionButton = (
    text: string,
    path: string,
    isActive: boolean,
    isCompleted: boolean,
    isPrimary: boolean = false
  ) => {
    // Base styling
    let buttonProps: any = {
      variant: isPrimary ? "contained" : "outlined",
      fullWidth: true,
      component: (isActive && !isCompleted) ? Link : "button", // Only use Link when active AND not completed
      to: (isActive && !isCompleted) ? path : undefined, // Only set route when active AND not completed
      disabled: !isActive || isCompleted, // Disable if not active OR if completed
      sx: {
        position: "relative",
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&::before": isActive && !isCompleted ? {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.3,
          background: isPrimary
            ? 'linear-gradient(45deg, #003366, #0066cc, #003366)'
            : 'linear-gradient(45deg, #e6f4ff, #ffffff, #e6f4ff)',
          backgroundSize: '200% 200%',
          animation: `${shineAnimation} 3s ease infinite`,
        } : undefined,
        "&:hover": isActive && !isCompleted ? {
          transform: "translateY(-3px)",
          boxShadow: 3,
          "&::before": {
            opacity: 0.5,
          }
        } : undefined,
        ...(isPrimary
          ? { bgcolor: "#003366", color: "#fff" }
          : { borderColor: "#003366", color: "#003366" }
        ),
        ...(isCompleted && { bgcolor: "#e0e0e0", borderColor: "#e0e0e0", color: "#666" }),
        ...((!isActive || isCompleted) && { // Apply disabled styles both when not active OR completed
          bgcolor: "rgba(0, 0, 0, 0.05)",
          borderColor: "rgba(0, 0, 0, 0.1)",
          color: "rgba(0, 0, 0, 0.3)"
        })
      }
    };
  
    // Adjusted button with fun effects
    return (
      <Box sx={{
        position: 'relative',
        width: '100%',
      }}>
        <Button {...buttonProps}>
          <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
          {isCompleted && (
            <Lock
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                fontSize: 16,
                opacity: 0.7,
                zIndex: 1
              }}
            />
          )}
        </Button>
      </Box>
    );
  };

  return (

    loading ? (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        bgcolor="white"
      >
        <Typography variant="h6" color="primary">
          Loading...
        </Typography>
      </Box>
    ) : (

    // <Box display="flex" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
      
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: "#003366" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* <Typography variant="h6" sx={{ color: "#ffffff" }}>
            Chavez
          </Typography> */}
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


      {/* Main Content */}
      <Box flexGrow={1} p={4}>
        

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

                {completedSessionsCount > 1 && (
                  <Button 
                    variant="outlined"
                    sx={{ mt: 1, borderColor: "#003366", color: "#003366", fontSize: "0.75rem", textTransform: "none" }}
                    component={Link}
                    to="/progress-reports"
                  >
                    View Progress Reports
                  </Button>
                )} 

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

          {/* <Grid item xs={12}> */}
          <Grid item xs={12} sx={{ position: 'relative', '&::after': { display: 'none' } }}>
            {!sessionStarted ? (
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(77, 148, 255, 0.2) 0%, rgba(0, 51, 102, 0.05) 70%)',
                    animation: `${pulseAnimation} 3s ease-in-out infinite`,
                    zIndex: 0,
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ 
                    textTransform: "none", 
                    bgcolor: "#003366", 
                    color: "#ffffff",
                    position: 'relative',
                    zIndex: 1,
                    py: 1.5,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#004080',
                      transform: 'translateY(-3px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={startSession}
                >
                  Start Session
                </Button>
              </Box>
            ) : (
              <Box 
                display="flex" 
                gap={2} 
                sx={{ 
                  position: 'relative',
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(5px)',
                  boxShadow: 'none', // Remove any shadow
                }}
              >
                {createActionButton("ASD Questionnaire", "/questionnaire", isQuestionnaireAvailable, isQuestionnaireCompleted, true)}
                {createActionButton("Gamified Assessments", "/game-selection", isGameSelectionAvailable, isGameSelectionCompleted, true)}
                {createActionButton("Speech Analysis", "/audio-analysis", isSpeechAnalysisAvailable, isSpeechAnalysisCompleted, true)}
                {createActionButton("Reports", "/reports", isReportsAvailable, false, true)}
              </Box>
            )}
          </Grid>

        </Grid>
      </Box>

    </Box>
    )
  );
};

export default Dashboard;