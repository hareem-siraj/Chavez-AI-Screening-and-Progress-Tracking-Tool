// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import styles from "../theme/Questions.module.css";
// import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, MenuItem, Select, FormControl, InputLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
// import { Person, QuestionAnswer, Settings, Logout, Home, Assessment } from "@mui/icons-material";
// import { Box, Typography } from "@mui/material";
// import axios from "axios";
// import { setSessionIds } from "./redux/store";
// import { useDispatch } from "react-redux";

// const Report: React.FC = () => {
//   const UserID = useSelector((state: any) => state.UserID);
//   const selectedChildId = useSelector((state: any) => state.selectedChildId);
//   const [childProfile, setChildProfile] = useState<any>(null);
//   const sessionData = useSelector((state: any) => state.sessionData);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
//     localStorage.clear(); // Clear stored data
//     sessionStorage.clear();
//     window.location.href = "/sign-in"; // Redirect to login page
//   };

//   useEffect(() => {
//     if (selectedChildId) {
//       fetchChildProfile(selectedChildId);
//     }
//   }, [selectedChildId]);

//   const fetchChildProfile = async (childId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:5001/api/get-child-profile`, {
//         params: { ChildID: childId }
//       });
//       if (response.data) {
//         setChildProfile(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching child profile:", error);
//     }
//   };

//   const [questionnaire, setQuestionnaire] = useState([]);
//   const [speechAnalysis, setSpeechAnalysis] = useState([]);
//   const [balloonGame, setBalloonGame] = useState([]);
//   const [emotionPuzzle, setEmotionPuzzle] = useState([]);

//   useEffect(() => {
//     if (sessionData?.SessionID) {
//       fetchData(sessionData.SessionID);
//     }
//   }, [sessionData]);

//   const fetchData = async (sessionId: number) => {
//     try {
//       const [qResponse, sResponse, bResponse, eResponse] = await Promise.all([
//         axios.get("http://localhost:5001/api/questionnaire", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/balloon-game", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/emotion-puzzle", { params: { sessionId } }),
//       ]);
  
//       console.log("Questionnaire Data:", qResponse.data);
//       console.log("Speech Analysis Data:", sResponse.data);
//       console.log("Balloon Game Data:", bResponse.data);
//       console.log("Emotion Puzzle Data:", eResponse.data);
  
//       setQuestionnaire(qResponse.data);
//       setSpeechAnalysis(sResponse.data);
//       setBalloonGame(bResponse.data);
//       setEmotionPuzzle(eResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };  
  
//   return (
//     <Box display="flex" minHeight="100vh" bgcolor="#F5F9FF">
//       <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
//         <Box>
//           <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
//             Chavez
//           </Typography>
//           <Divider />
//           <List>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/dashboard">
//                 <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/profile-selection">
//                 <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Profile" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/questionnaire">
//                 <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/game-selection">
//                 <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/audio-analysis">
//                 <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Speech Analysis" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/reports">
//                 <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Reports" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//           </List>
//           <Divider />
//             <List>
//               <ListItem disablePadding>
//                 <ListItemButton onClick={handleLogout}> {/* Call handleLogout on click */}
//                   <ListItemIcon>
//                     <Logout sx={{ color: "#003366" }} />
//                   </ListItemIcon>
//                   <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
//                 </ListItemButton>
//               </ListItem>
//             </List>
//         </Box>
//       </Box>
        
//       <Box p={4} className={styles.main}>
//         <Typography variant="h5" className={styles.heading2}>
//           Reports for Session ID {sessionData?.SessionID || "No Session Data"}
//         </Typography>

//         {/* Questionnaire Section */}
//         <Typography variant="h6" className={styles.heading2}>Questionnaire</Typography>
//         <TableContainer component={Paper} className={styles.table}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className={styles.table2}>Session ID</TableCell>
//                 <TableCell className={styles.table2}>Final Score</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {questionnaire.length > 0 ? (
//                 questionnaire.map((row: any) => (
//                   <TableRow key={row.Session_ID}>
//                     <TableCell className={styles.table2}>{row.Session_ID}</TableCell>
//                     <TableCell className={styles.table2}>{row.Final_Score}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={2} align="center" className={styles.table4}>
//                     No data available
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Speech Analysis Section */}
//         <Typography variant="h6" className={styles.heading2}>Speech Analysis</Typography>
//         <TableContainer component={Paper} className={styles.table}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className={styles.table2}>Feature</TableCell>
//                 <TableCell className={styles.table2}>Value</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {speechAnalysis.length > 0 ? (
//                 speechAnalysis.map((row: any, index: number) => (
//                   <TableRow key={index}>
//                     <TableCell className={styles.table2}>Prediction Label</TableCell>
//                     <TableCell className={styles.table2}>{row.PredictionLabel}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={2} align="center" className={styles.table4}>
//                     No data available
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

        
//         {/* Gamified Assessments Section */}
//         <Typography variant="h6" className={styles.heading2}>Gamified Assessments</Typography>

//         {/* Balloon Game */}
//         <Typography variant="subtitle1" className={styles.table3}>Pop the Balloon</Typography>
//         <TableContainer component={Paper} className={styles.table}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className={styles.table2}>Correct Taps</TableCell>
//                 <TableCell className={styles.table2}>Missed Balloons</TableCell>
//                 <TableCell className={styles.table2}>Incorrect Clicks</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {balloonGame.length > 0 ? (
//                 balloonGame.map((row: any) => (
//                   <TableRow key={row.index || row.sessionId}>
//                     <TableCell className={styles.table2}>{row.correcttaps}</TableCell>
//                     <TableCell className={styles.table2}>{row.missedballoons}</TableCell>
//                     <TableCell className={styles.table2}>{row.incorrectclicks}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" className={styles.table4}>
//                     No data available
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>



//         {/* Emotion Puzzle */}
//         <Typography variant="subtitle1" className={styles.table3}>Emotion Puzzle</Typography>
//         <TableContainer component={Paper} className={styles.table}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className={styles.table2}>Correct Emotion</TableCell>
//                 <TableCell className={styles.table2}>Selected Emotion</TableCell>
//                 <TableCell className={styles.table2}>Reaction Time</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {emotionPuzzle.length > 0 ? (
//                 emotionPuzzle.map((row: any, index: number) => (
//                   <TableRow key={index}>
//                     <TableCell className={styles.table2}>{row.correct_emotion}</TableCell>
//                     <TableCell className={styles.table2}>{row.selected_emotion}</TableCell>
//                     <TableCell className={styles.table2}>{row.reaction_time}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" className={styles.table4}>
//                     No data available
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>


//         {/* Follow  */}
//         <Typography variant="subtitle1" className={styles.table3}>Follow the Fish</Typography>
//         <TableContainer component={Paper} className={styles.table}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className={styles.table2}>Gaze Fixation Duration</TableCell>
//                 <TableCell className={styles.table2}>Tracking Accuracy</TableCell>
//                 <TableCell className={styles.table2}>Saccade Amplitude</TableCell>
//                 <TableCell className={styles.table2}>Scanpath Analysis</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" className={styles.table4}>
//                     No data available
//                   </TableCell>
//                 </TableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Human vs Obj */}
//         <Typography variant="subtitle1" className={styles.table3}>Human vs Obj</Typography>
//         <TableContainer component={Paper} className={styles.table}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell className={styles.table2}>Heatmaps</TableCell>
//                 <TableCell className={styles.table2}>Fixatation Duration</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//                 <TableRow>
//                   <TableCell colSpan={3} align="center" className={styles.table4}>
//                     No data available
//                   </TableCell>
//                 </TableRow>

//             </TableBody>
//           </Table>
//         </TableContainer>


//       </Box>
//     </Box>
//   );
// };

// export default Report;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Home, Person, QuestionAnswer, Assessment, Logout } from "@mui/icons-material";


// Define types
interface SessionData {
  SessionID: string;
}

interface QuestionnaireData {
  Session_ID: string;
  Final_Score: number;
}

interface BalloonGameData {
  correcttaps: number;
  missedballoons: number;
  incorrectclicks: number;
  level: number;
}

interface FollowFishData {
  correcttrials: number;
  incorrecttrials: number;
}

interface HumanVsObjectData {
  correctresponses: number;
  incorrectresponses: number;
}

interface EmotionPuzzleData {
  correct_emotion: string;
  selected_emotion: string;
  reaction_time: number;
}

interface SpeechAnalysisData {
  PredictionLabel: string;
}

const Report: React.FC = () => {
  const selectedChildId = useSelector((state: any) => state.selectedChildId);
  const [sessionList, setSessionList] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData[]>([]);
  const [balloonGame, setBalloonGame] = useState<BalloonGameData[]>([]);
  const [followFish, setFollowFish] = useState<FollowFishData[]>([]);
  const [humanVsObject, setHumanVsObject] = useState<HumanVsObjectData[]>([]);
  const [emotionPuzzle, setEmotionPuzzle] = useState<EmotionPuzzleData[]>([]);
  const [speechAnalysis, setSpeechAnalysis] = useState<SpeechAnalysisData[]>([]);

  useEffect(() => {
    const storedSessions = localStorage.getItem("SessionList");
    const storedSelectedSession = localStorage.getItem("SelectedSession");
  
    if (storedSessions) {
      // Load stored session IDs from LocalStorage
      setSessionList(JSON.parse(storedSessions));
      setSelectedSession(storedSelectedSession || JSON.parse(storedSessions)[0]?.SessionID);
    } else if (selectedChildId) {
      // Fetch from API if LocalStorage is empty
      fetchSessions(selectedChildId);
    }
  }, [selectedChildId]);
  
  useEffect(() => {
    if (selectedSession) {
      fetchData(selectedSession);
    }
  }, [selectedSession]);
  


  useEffect(() => {
    console.log("Updated Balloon Game Data:", balloonGame);
    console.log("Updated Follow Fish Data:", followFish);
    console.log("Updated Human vs Object Data:", humanVsObject);
    console.log("Updated Emotion Puzzle Data:", emotionPuzzle);
  }, [balloonGame, followFish, humanVsObject, emotionPuzzle]);

  const fetchSessions = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/allSessions/${childId}`);
  
      if (response.data.sessions.length > 0) {
        const firstSessionID = response.data.sessions[0].SessionID;
  
        setSessionList(response.data.sessions);
  
        // ✅ First clear selected session (force re-render)
        setSelectedSession(null);
  
        // ✅ Ensure the new session is set after clearing it
        setTimeout(() => {
          setSelectedSession(firstSessionID);
          localStorage.setItem("SelectedSession", firstSessionID);
        }, 50); // Small delay ensures proper re-rendering
  
        // ✅ fetchData() will now be triggered in the next useEffect()
      }
    } catch (error) {
      console.error("Error fetching session list:", error);
    }
  };
  

  const fetchData = async (sessionId: string) => {
    try {
      const responses = await Promise.allSettled([
        axios.get("http://localhost:5001/api/questionnaire", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/balloon-game", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/follow-data", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/human-vs-object", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/emotion-puzzle", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
      ]);
      console.log("Fetched Data for Session:", sessionId);

      responses.forEach((res, index) => {
        if (res.status === "fulfilled") {
          console.log(`API ${index} Success:`, res.value.data);
        } else {
          console.error(`API ${index} Failed:`, res.reason);
        }
      });

        setQuestionnaire(responses[0].status === "fulfilled" ? responses[0].value.data || [] : []);
        setBalloonGame(responses[1].status === "fulfilled" ? responses[1].value.data || [] : []);
        setFollowFish(responses[2].status === "fulfilled" ? responses[2].value.data || [] : []);
        setHumanVsObject(responses[3].status === "fulfilled" ? responses[3].value.data || [] : []);
        setEmotionPuzzle(responses[4].status === "fulfilled" ? responses[4].value.data || [] : []);
        setSpeechAnalysis(responses[5].status === "fulfilled" ? responses[5].value.data || [] : []);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
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
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                  <Home sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile">
                <ListItemIcon>
                  <Person sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Profile" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire">
                <ListItemIcon>
                  <QuestionAnswer sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon>
                  <Assessment sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/audio-analysis">
                <ListItemIcon>
                  <Assessment sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports">
                <ListItemIcon>
                  <Assessment sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Reports" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/logout">
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
      <Box p={4} flex={1}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#002244", fontWeight: "bold" }}
        >
          Reports
        </Typography>

        {/* Session Dropdown */}
        <FormControl
          fullWidth
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: 2,
          }}
        >
          <InputLabel sx={{ color: "#000000" }}>Select Session</InputLabel>
          <Select
              value={selectedSession || ""}
              onChange={(e) => {
                const newSessionId = e.target.value as string;
                setSelectedSession(newSessionId);
            
                // Save selected session to LocalStorage
                localStorage.setItem("SelectedSession", newSessionId);
            
                setTimeout(() => fetchData(newSessionId), 0);
              }}
            sx={{
              color: "#000000",
              "& .MuiSelect-select": { color: "#000000" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
            }}
          >
            {sessionList.map((session) => (
              <MenuItem
                key={session.SessionID}
                value={session.SessionID}
                sx={{
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {session.SessionID}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reports Sections */}
        {[
          {
            title: "Questionnaire",
            content: (
              <Box sx={{ padding: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Session ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Final Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questionnaire.length > 0 ? (
                        questionnaire.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: "#333" }}>{item.Session_ID}</TableCell>
                            <TableCell sx={{ color: "#333", fontWeight: "bold" }}>{item.Final_Score}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} sx={{ textAlign: "center", color: "#666" }}>
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ),
          }
          ,
          {
            title: "Gamified Assessments",
            content: (
              <>
              {/* Pop the Balloon */}
              
              {balloonGame.length > 0 && (
                <Box sx={{ marginBottom: 2, padding: 2 }}>
                  <Typography sx={{ fontWeight: "bold", color: "#003366", fontSize: "1.2rem" }}>
                    Pop the Balloon
                  </Typography>

                  {/* Level-wise Summary */}
                  <Box sx={{ padding: 2, backgroundColor: "#f8f9fa", borderRadius: "8px", color: "#333" }}>
                    <Typography sx={{ color: "#d63384", fontSize: "1rem" }}>
                      🟢 Level 1: Pink Balloons Only
                    </Typography>
                    <Typography sx={{ color: "#555" }}>
                      🎀 Popped: <strong style={{ color: "#d63384" }}>
                        {balloonGame.reduce((acc, game) => acc + (game.level === 1 ? game.correcttaps : 0), 0)}
                      </strong>
                    </Typography>
                    <Typography sx={{ color: "#555" }}>
                      🎈 Missed: <strong style={{ color: "#dc3545" }}>
                        {balloonGame.reduce((acc, game) => acc + (game.level === 1 ? game.missedballoons : 0), 0)}
                      </strong>
                    </Typography>
                    <Typography sx={{ color: "#555" }}>
                      ❌ Wrong Taps: <strong style={{ color: "#dc3545" }}>
                        {balloonGame.reduce((acc, game) => acc + (game.level === 1 ? game.incorrectclicks : 0), 0)}
                      </strong>
                    </Typography>

                    <Divider sx={{ marginY: 1 }} />

                    <Typography sx={{ color: "#ffc107", fontSize: "1rem" }}>
                      🟡 Level 2: Yellow Balloons Only
                    </Typography>
                    <Typography sx={{ color: "#555" }}>
                      🟡 Popped: <strong style={{ color: "#ffc107" }}>
                        {balloonGame.reduce((acc, game) => acc + (game.level === 2 ? game.correcttaps : 0), 0)}
                      </strong>
                    </Typography>
                    <Typography sx={{ color: "#555" }}>
                      🎈 Missed: <strong style={{ color: "#dc3545" }}>
                        {balloonGame.reduce((acc, game) => acc + (game.level === 2 ? game.missedballoons : 0), 0)}
                      </strong>
                    </Typography>
                    <Typography sx={{ color: "#555" }}>
                      🔵 Wrong Taps: <strong style={{ color: "#0d6efd" }}>
                        {balloonGame.reduce((acc, game) => acc + (game.level === 2 ? game.incorrectclicks : 0), 0)}
                      </strong>
                    </Typography>

                    <Divider sx={{ marginY: 1 }} />

                    {/* Total Incorrect Taps Across Both Levels */}
                    <Typography sx={{color: "#dc3545", fontSize: "1.1rem" }}>
                      ❌ Total Incorrect Taps: 
                      <strong style={{ color: "#dc3545", marginLeft: "5px" }}>
                        {balloonGame.reduce((acc, game) => acc + game.incorrectclicks, 0)}
                      </strong>
                    </Typography>
                  </Box>

                  {/* Expandable Detailed Attempts */}
                  <Accordion sx={{ marginTop: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#e9ecef", color: "#333" }}>
                      <Typography sx={{ fontWeight: "bold" }}>View Detailed Attempts</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Attempt #</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Level</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#d63384" }}>🎀 Pink Popped</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#ffc107" }}>🟡 Yellow Popped</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#0d6efd" }}>🔵 Wrong Taps</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>🎈 Missed</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#dc3545" }}>❌ Incorrect Clicks</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {balloonGame.map((game, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ color: "#333" }}>{index + 1}</TableCell>
                                <TableCell sx={{ color: "#333" }}>{game.level}</TableCell>
                                <TableCell sx={{ color: game.level === 1 ? "#d63384" : "#bbb" }}>
                                  {game.level === 1 ? game.correcttaps : "N/A"}
                                </TableCell>
                                <TableCell sx={{ color: game.level === 2 ? "#ffc107" : "#bbb" }}>
                                  {game.level === 2 ? game.correcttaps : "N/A"}
                                </TableCell>
                                <TableCell sx={{ color: game.level === 2 ? "#0d6efd" : "#bbb" }}>
                                  {game.level === 2 ? game.incorrectclicks : "N/A"}
                                </TableCell>
                                <TableCell sx={{ color: "#333" }}>{game.missedballoons}</TableCell>
                                <TableCell sx={{ color: "#dc3545" }}>{game.incorrectclicks}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

                {/* Follow the Fish */}
                {followFish.length > 0 && (
                  <Box sx={{ marginBottom: 2, padding: 1 }}>
                    <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
                      Follow the Fish
                    </Typography>
                    <Typography sx={{color: "#003366" }}>
                      Correct Trials: {followFish[0]?.correcttrials ?? "No data"}
                    </Typography>
                    <Typography sx={{color: "#003366" }}>
                      Incorrect Trials: {followFish[0]?.incorrecttrials ?? "No data"}
                    </Typography>
                  </Box>
                )}

                {/* Human vs Object */}
                {humanVsObject.length > 0 && (
                  <Box sx={{ marginBottom: 2, padding: 1 }}>
                    <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
                      Human vs Object
                    </Typography>
                    <Typography sx={{color: "#003366" }}>
                      Correct Responses: {humanVsObject[0]?.correctresponses ?? "No data"}
                    </Typography>
                    <Typography sx={{color: "#003366" }}>
                      Incorrect Responses: {humanVsObject[0]?.incorrectresponses ?? "No data"}
                    </Typography>
                  </Box>
                )}

                {/* Emotion Puzzle */}
                {emotionPuzzle.length > 0 && (
                  <Box sx={{ marginBottom: 2, padding: 1 }}>
                    <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
                      Emotion Puzzle
                    </Typography>

                    {/* Summary Table */}
                    <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: "#eef2f7" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                              Total Attempts
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                              Avg Reaction Time (ms)
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                              Correct Attempts
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                              Incorrect Attempts
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ color: "#000000" }}>{emotionPuzzle.length}</TableCell>
                            <TableCell sx={{ color: "#000000" }}>
                              {(
                                emotionPuzzle.reduce((acc, curr) => acc + curr.reaction_time, 0) /
                                emotionPuzzle.length
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ color: "#000000" }}>
                              {
                                emotionPuzzle.filter((data) => data.correct_emotion === data.selected_emotion)
                                  .length
                              }
                            </TableCell>
                            <TableCell sx={{ color: "#000000" }}>
                              {
                                emotionPuzzle.filter((data) => data.correct_emotion !== data.selected_emotion)
                                  .length
                              }
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Expandable History */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef2f7" }}>
                        <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
                          View Detailed Attempts
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead sx={{ backgroundColor: "#eef2f7" }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                                  Correct Emotion
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                                  Selected Emotion
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                                  Reaction Time (ms)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {emotionPuzzle.map((attempt, index) => (
                                <TableRow key={index}>
                                  <TableCell sx={{ color: "#000000" }}>{attempt.correct_emotion}</TableCell>
                                  <TableCell sx={{ color: "#000000" }}>{attempt.selected_emotion}</TableCell>
                                  <TableCell sx={{ color: "#000000" }}>{attempt.reaction_time.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}

                {/* Show "No data available" only if all games have no data */}
                {!balloonGame.length &&
                  !followFish.length &&
                  !humanVsObject.length &&
                  !emotionPuzzle.length && (
                    <Typography sx={{ color: "#666" }}>No data available</Typography>
                  )}
              </>
            ),
          },
          
          {
            title: "Speech Analysis",
            data: speechAnalysis, // Keep "data" to ensure compatibility with existing logic
            rows: [
              { key: "PredictionLabel", label: "Prediction" }
            ],
            content: (
              <Box sx={{ padding: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Feature</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {speechAnalysis.length > 0 ? (
                        speechAnalysis.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: "#666", fontWeight: "bold" }}>Prediction Label</TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: item.PredictionLabel === "Autistic" ? "red" : "green",
                              }}
                            >
                              {item.PredictionLabel}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} sx={{ textAlign: "center", color: "#666" }}>
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ),
          }  
        ,
        ].map(({ title, data = [], rows = [], content }) => (
          <Accordion key={title}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#eef2f7" }}
            >
              <Typography
                sx={{ fontWeight: "bold", color: "#002244", fontSize: "1.1rem" }}
              >
                {title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {content ||
                (data.length > 0 ? (
                  rows.map(({ key, label }) => (
                    <Typography key={key} sx={{ color: "#333" }}>
                      {label}:{" "}
                      {Array.isArray(data) && data.length > 0
                        ? (data[0] as any)?.[key] ?? "No data"
                        : "No data"}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ color: "#666" }}>No data available</Typography>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default Report;