// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import styles from "../theme/Questions.module.css";
// import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, MenuItem, Select, FormControl, InputLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
// import { Person, QuestionAnswer, Settings, Logout, Home, Assessment } from "@mui/icons-material";
// import { Box, Typography } from "@mui/material";
// import axios from "axios";

// const Report: React.FC = () => {
//   const UserID = useSelector((state: any) => state.UserID);
//   const selectedChildId = useSelector((state: any) => state.selectedChildId);
//   const [childProfile, setChildProfile] = useState<any>(null);
//   const sessionData = useSelector((state: any) => state.sessionData);

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
//           <List>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/sign-in">
//                 <ListItemIcon><Logout sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
//               </ListItemButton>
//             </ListItem>
//           </List>
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
                  
//                   <TableRow key={row.SessionID}>
//                     <TableCell className={styles.table2}>{row.CorrectTaps}</TableCell>
//                     <TableCell className={styles.table2}>{row.MissedBalloons}</TableCell>
//                     <TableCell className={styles.table2}>{row.IncorrectClicks}</TableCell>
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
//                     <TableCell className={styles.table2}>{row.CorrectEmotion}</TableCell>
//                     <TableCell className={styles.table2}>{row.SelectedEmotion}</TableCell>
//                     <TableCell className={styles.table2}>{row.ReactionTime}</TableCell>
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
//       </Box>
//     </Box>
//   );
//   };

//   export default Report;



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../theme/Questions.module.css";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, MenuItem, Select, FormControl, InputLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout, Home, Assessment } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { setSessionIds } from "./redux/store";
import { useDispatch } from "react-redux";

const Report: React.FC = () => {
  const UserID = useSelector((state: any) => state.UserID);
  const selectedChildId = useSelector((state: any) => state.selectedChildId);
  const [childProfile, setChildProfile] = useState<any>(null);
  const sessionData = useSelector((state: any) => state.sessionData);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear(); // Clear stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchChildProfile(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchChildProfile = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/get-child-profile`, {
        params: { ChildID: childId }
      });
      if (response.data) {
        setChildProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching child profile:", error);
    }
  };

  const [questionnaire, setQuestionnaire] = useState([]);
  const [speechAnalysis, setSpeechAnalysis] = useState([]);
  const [balloonGame, setBalloonGame] = useState([]);
  const [emotionPuzzle, setEmotionPuzzle] = useState([]);

  useEffect(() => {
    if (sessionData?.SessionID) {
      fetchData(sessionData.SessionID);
    }
  }, [sessionData]);

  const fetchData = async (sessionId: number) => {
    try {
      const [qResponse, sResponse, bResponse, eResponse] = await Promise.all([
        axios.get("http://localhost:5001/api/questionnaire", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/balloon-game", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/emotion-puzzle", { params: { sessionId } }),
      ]);
  
      console.log("Questionnaire Data:", qResponse.data);
      console.log("Speech Analysis Data:", sResponse.data);
      console.log("Balloon Game Data:", bResponse.data);
      console.log("Emotion Puzzle Data:", eResponse.data);
  
      setQuestionnaire(qResponse.data);
      setSpeechAnalysis(sResponse.data);
      setBalloonGame(bResponse.data);
      setEmotionPuzzle(eResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  
  
  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F9FF">
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
                <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/audio-analysis">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Speech Analysis" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Reports" sx={{ color: "#003366" }} />
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
        
      <Box p={4} className={styles.main}>
        <Typography variant="h5" className={styles.heading2}>
          Reports for Session ID {sessionData?.SessionID || "No Session Data"}
        </Typography>

        {/* Questionnaire Section */}
        <Typography variant="h6" className={styles.heading2}>Questionnaire</Typography>
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table2}>Session ID</TableCell>
                <TableCell className={styles.table2}>Final Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionnaire.length > 0 ? (
                questionnaire.map((row: any) => (
                  <TableRow key={row.Session_ID}>
                    <TableCell className={styles.table2}>{row.Session_ID}</TableCell>
                    <TableCell className={styles.table2}>{row.Final_Score}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" className={styles.table4}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Speech Analysis Section */}
        <Typography variant="h6" className={styles.heading2}>Speech Analysis</Typography>
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table2}>Feature</TableCell>
                <TableCell className={styles.table2}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {speechAnalysis.length > 0 ? (
                speechAnalysis.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className={styles.table2}>Prediction Label</TableCell>
                    <TableCell className={styles.table2}>{row.PredictionLabel}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" className={styles.table4}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        
        {/* Gamified Assessments Section */}
        <Typography variant="h6" className={styles.heading2}>Gamified Assessments</Typography>

        {/* Balloon Game */}
        <Typography variant="subtitle1" className={styles.table3}>Pop the Balloon</Typography>
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table2}>Correct Taps</TableCell>
                <TableCell className={styles.table2}>Missed Balloons</TableCell>
                <TableCell className={styles.table2}>Incorrect Clicks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balloonGame.length > 0 ? (
                balloonGame.map((row: any) => (
                  <TableRow key={row.index || row.sessionId}>
                    <TableCell className={styles.table2}>{row.correcttaps}</TableCell>
                    <TableCell className={styles.table2}>{row.missedballoons}</TableCell>
                    <TableCell className={styles.table2}>{row.incorrectclicks}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" className={styles.table4}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>



        {/* Emotion Puzzle */}
        <Typography variant="subtitle1" className={styles.table3}>Emotion Puzzle</Typography>
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table2}>Correct Emotion</TableCell>
                <TableCell className={styles.table2}>Selected Emotion</TableCell>
                <TableCell className={styles.table2}>Reaction Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emotionPuzzle.length > 0 ? (
                emotionPuzzle.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className={styles.table2}>{row.correct_emotion}</TableCell>
                    <TableCell className={styles.table2}>{row.selected_emotion}</TableCell>
                    <TableCell className={styles.table2}>{row.reaction_time}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" className={styles.table4}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>


        {/* Follow  */}
        <Typography variant="subtitle1" className={styles.table3}>Follow the Fish</Typography>
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table2}>Gaze Fixation Duration</TableCell>
                <TableCell className={styles.table2}>Tracking Accuracy</TableCell>
                <TableCell className={styles.table2}>Saccade Amplitude</TableCell>
                <TableCell className={styles.table2}>Scanpath Analysis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                  <TableCell colSpan={3} align="center" className={styles.table4}>
                    No data available
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Human vs Obj */}
        <Typography variant="subtitle1" className={styles.table3}>Human vs Obj</Typography>
        <TableContainer component={Paper} className={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table2}>Heatmaps</TableCell>
                <TableCell className={styles.table2}>Fixatation Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                  <TableCell colSpan={3} align="center" className={styles.table4}>
                    No data available
                  </TableCell>
                </TableRow>

            </TableBody>
          </Table>
        </TableContainer>


      </Box>
    </Box>
  );
};

export default Report;