import React, { useState, useEffect } from "react";
import { 
  Box, Button, Typography, Avatar, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Divider, Grid
} from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, CheckCircle, Cancel, Logout} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { setSessionIds } from "../components/redux/actions";
import { setSessionIds } from "./redux/store";
import axios from "axios";

const DashboardUrdu: React.FC = () => {
  const dispatch = useDispatch();
  const selectedChildId = useSelector((state: any) => state.selectedChildId);
  const sessionData = useSelector((state: any) => state.sessionData); 
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    const storedStatus = localStorage.getItem("questionnaireCompleted");
    setQuestionnaireCompleted(storedStatus === "true"); // Convert string to boolean
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchSessionData(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchSessionData = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-session/${childId}`);

      if (response.data) {
        const { SessionID, QuestionnaireID, GameSessionID, ReportID } = response.data;

        dispatch(
          setSessionIds({
            SessionID,
            QuestionnaireID,
            GameSessionID,
            ReportID,
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
      setSessionStarted(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/start-session", {
        ChildID: selectedChildId,
      });

      const { SessionID, QuestionnaireID, GameSessionID, ReportID } = response.data;

      dispatch(
        setSessionIds({
          SessionID,
          QuestionnaireID,
          GameSessionID,
          ReportID,
        })
      );
      setSessionStarted(true);

    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start session.");
    }
  };

  const getCompletionStatus = (completed: boolean) => {
    return completed ? <CheckCircle sx={{ color: "green" }} /> : <Cancel sx={{ color: "red" }} />;
  };

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
              <ListItemButton component={Link} to="/dashboard-urdu">
                <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="ڈیش بورڈ" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile-selection-urdu">
                <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="پروفائل"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire-urdu">
                <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="سوالنامہ" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="گیمیفائیڈ اسیسمنٹس"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/audio-analysis">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports-urdu">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="رپورٹس" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
            <List>
              <ListItem disablePadding>
              <ListItemButton component={Link} to="/sign-in-urdu">
                <ListItemIcon>
                  <Logout sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="لاگ آؤٹ"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} p={4}>
        
        {/* Welcome Section */}
        <Typography variant="h5" align="center" sx={{ color: "#003366", fontWeight: "bold", mb: 3 }}>
        🎉 شاویز میں خوش آمدید! 🎉
        </Typography>

        <Grid container spacing={3}>

          {/* Child Profile Card */}
          <Grid item xs={12} md={6}>
            <Box bgcolor="#ffffff" p={3} borderRadius="12px" boxShadow={2} display="flex" alignItems="center">
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#003366", color: "#fff" }}>C</Avatar>
              <Box ml={3}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                  {selectedChildId ? `Kid ${selectedChildId}` : "No Child Selected"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                یہاں اپنے بچے کے جائزے کے سفر کو ٹریک اور مینیج کریں۔ ماڈیولز، رہنما کتابوں، اور رپورٹس تک رسائی کے لیے بائیں جانب نیویگیشن کا استعمال کریں۔
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
              رپورٹ کا خلاصہ
              </Typography>
              <Typography variant="body2" sx={{ color: "#FFFFFF", mt: 1 }}>  {/* White text */}
              فی الحال کوئی رپورٹ نہیں۔
              </Typography>
            </Box>
          </Grid>

         {/* Progress Section */}
        <Grid item xs={12} md={6}>
          <Box bgcolor="#ffffff" p={3} borderRadius="12px" boxShadow={2}>
            <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
            پیش رفت
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="سوالنامہ" sx={{ color: "#003366" }} />
                {getCompletionStatus(questionnaireCompleted)}
              </ListItem>
              <ListItem>
                <ListItemText primary="Follow the Butterfly" sx={{ color: "#003366" }} />
                {getCompletionStatus(false)} {/* Always red for now */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Pop the Balloon" sx={{ color: "#003366" }} />
                {getCompletionStatus(false)} {/* Always red for now */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Flash Cards" sx={{ color: "#003366" }} />
                {getCompletionStatus(false)} {/* Always red for now */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Emotion Puzzle" sx={{ color: "#003366" }} />
                {getCompletionStatus(false)} {/* Always red for now */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Human vs Object" sx={{ color: "#003366" }} />
                {getCompletionStatus(false)} {/* Always red for now */}
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
                سیشن شروع کریں۔
              </Button>
            ) : (
              <Box display="flex" gap={2}>
                <Button variant="contained" sx={{ bgcolor: "#003366", color: "#fff" }} component={Link} to="/questionnaire" fullWidth>
                ASD سوالنامہ
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#003366", color: "#003366" }} component={Link} to="/game-selection" fullWidth>
                گیمیفائیڈ اسیسمنٹس
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#003366", color: "#003366" }} component={Link} to="/audio-analysis" fullWidth>
                  Speech Analysis
                </Button>
                <Button variant="outlined" sx={{ borderColor: "#003366", color: "#003366" }} component={Link} to="/reports" fullWidth>
                رپورٹس
                </Button>
              </Box>
            )}
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardUrdu;


