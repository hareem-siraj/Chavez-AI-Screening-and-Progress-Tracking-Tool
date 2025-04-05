import React, { useEffect, useState } from "react";
// import ReactMarkdown from 'react-markdown';
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
  // Accordion,
  // AccordionSummary,
  // AccordionDetails,
  // Paper,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
} from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Home, Person, QuestionAnswer, Assessment, Logout } from "@mui/icons-material";


// // Define types
// interface SessionData {
//   SessionID: string;
// }

interface QuestionnaireData {
  Session_ID: string;
  Final_Score: number;
}

interface BalloonGameData {
  correcttaps: number;
  missedballoons: number;
  incorrectclicks: number;
  level: number;
  sessionduration: number; // Added property
  totaltaps: number; // Added property
  Gender?: string; // Added property
  Age: number; // Added property
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
  attempt_number?: number; // Added property
  is_correct?: boolean; // Added property
  Age: number; // Added property
  Gender?: string; // Added property
  cumulative_time?: number; // Added property
  level:number
}


interface SpeechAnalysisData {
  PredictionLabel: string;
}

// const Report: React.FC = () => {
//   const selectedChildId = useSelector((state: any) => state.selectedChildId);
//   const [sessionList, setSessionList] = useState<SessionData[]>([]);
//   const [selectedSession, setSelectedSession] = useState<string | null>(null);
//   const [questionnaire, setQuestionnaire] = useState<QuestionnaireData[]>([]);
//   const [balloonGame, setBalloonGame] = useState<BalloonGameData[]>([]);
//   const [followFish, setFollowFish] = useState<FollowFishData[]>([]);
//   const [humanVsObject, setHumanVsObject] = useState<HumanVsObjectData[]>([]);
//   const [emotionPuzzle, setEmotionPuzzle] = useState<EmotionPuzzleData[]>([]);
//   const [speechAnalysis, setSpeechAnalysis] = useState<SpeechAnalysisData[]>([]);

//   useEffect(() => {
//     const storedSessions = localStorage.getItem("SessionList");
//     const storedSelectedSession = localStorage.getItem("SelectedSession");
  
//     if (storedSessions) {
//       // Load stored session IDs from LocalStorage
//       setSessionList(JSON.parse(storedSessions));
//       setSelectedSession(storedSelectedSession || JSON.parse(storedSessions)[0]?.SessionID);
//     } else if (selectedChildId) {
//       // Fetch from API if LocalStorage is empty
//       fetchSessions(selectedChildId);
//     }
//   }, [selectedChildId]);
  
//   useEffect(() => {
//     if (selectedSession) {
//       fetchData(selectedSession);
//     }
//   }, [selectedSession]);
  


//   useEffect(() => {
//     console.log("Updated Balloon Game Data:", balloonGame);
//     console.log("Updated Follow Fish Data:", followFish);
//     console.log("Updated Human vs Object Data:", humanVsObject);
//     console.log("Updated Emotion Puzzle Data:", emotionPuzzle);
//   }, [balloonGame, followFish, humanVsObject, emotionPuzzle]);

//   const fetchSessions = async (childId: string) => {
//     try {
//       const response = await axios.get(`http://localhost:5001/api/allSessions/${childId}`);
  
//       if (response.data.sessions.length > 0) {
//         const firstSessionID = response.data.sessions[0].SessionID;
  
//         setSessionList(response.data.sessions);
  
//         // ✅ First clear selected session (force re-render)
//         setSelectedSession(null);
  
//         // ✅ Ensure the new session is set after clearing it
//         setTimeout(() => {
//           setSelectedSession(firstSessionID);
//           localStorage.setItem("SelectedSession", firstSessionID);
//         }, 50); // Small delay ensures proper re-rendering
  
//         // ✅ fetchData() will now be triggered in the next useEffect()
//       }
//     } catch (error) {
//       console.error("Error fetching session list:", error);
//     }
//   };
  

//   const fetchData = async (sessionId: string) => {
//     try {
//       const responses = await Promise.allSettled([
//         axios.get("http://localhost:5001/api/questionnaire", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/balloon-game", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/follow-data", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/human-vs-object", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/emotion-puzzle", { params: { sessionId } }),
//         axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
//       ]);
//       console.log("Fetched Data for Session:", sessionId);

//       responses.forEach((res, index) => {
//         if (res.status === "fulfilled") {
//           console.log(`API ${index} Success:`, res.value.data);
//         } else {
//           console.error(`API ${index} Failed:`, res.reason);
//         }
//       });

//         setQuestionnaire(responses[0].status === "fulfilled" ? responses[0].value.data || [] : []);
//         setBalloonGame(responses[1].status === "fulfilled" ? responses[1].value.data || [] : []);
//         setFollowFish(responses[2].status === "fulfilled" ? responses[2].value.data || [] : []);
//         setHumanVsObject(responses[3].status === "fulfilled" ? responses[3].value.data || [] : []);
//         setEmotionPuzzle(responses[4].status === "fulfilled" ? responses[4].value.data || [] : []);
//         setSpeechAnalysis(responses[5].status === "fulfilled" ? responses[5].value.data || [] : []);

//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// };

//   return (
//     <Box display="flex" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
//       {/* Sidebar */}
      // <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
      //   <Box>
      //     <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
      //       Chavez
      //     </Typography>
      //     <Divider />
      //     <List>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/dashboard">
      //           <ListItemIcon>
      //             <Home sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
      //         </ListItemButton>
      //       </ListItem>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/profile">
      //           <ListItemIcon>
      //             <Person sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Profile" sx={{ color: "#003366" }} />
      //         </ListItemButton>
      //       </ListItem>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/questionnaire">
      //           <ListItemIcon>
      //             <QuestionAnswer sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
      //         </ListItemButton>
      //       </ListItem>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/game-selection">
      //           <ListItemIcon>
      //             <Assessment sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }} />
      //         </ListItemButton>
      //       </ListItem>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/audio-analysis">
      //           <ListItemIcon>
      //             <Assessment sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }} />
      //         </ListItemButton>
      //       </ListItem>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/reports">
      //           <ListItemIcon>
      //             <Assessment sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Reports" sx={{ color: "#003366" }} />
      //         </ListItemButton>
      //       </ListItem>
      //     </List>
      //     <Divider />
      //     <List>
      //       <ListItem disablePadding>
      //         <ListItemButton component={Link} to="/logout">
      //           <ListItemIcon>
      //             <Logout sx={{ color: "#003366" }} />
      //           </ListItemIcon>
      //           <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
      //         </ListItemButton>
      //       </ListItem>
      //     </List>
      //   </Box>
      // </Box>

//       {/* Main Content */}
//       <Box p={4} flex={1}>
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{ color: "#002244", fontWeight: "bold" }}
//         >
//           Reports
//         </Typography>

//         {/* Session Dropdown */}
//         <FormControl
//           fullWidth
//           sx={{
//             backgroundColor: "#ffffff",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             marginBottom: 2,
//           }}
//         >
//           <InputLabel sx={{ color: "#000000" }}>Select Session</InputLabel>
//           <Select
//               value={selectedSession || ""}
//               onChange={(e) => {
//                 const newSessionId = e.target.value as string;
//                 setSelectedSession(newSessionId);
            
//                 // Save selected session to LocalStorage
//                 localStorage.setItem("SelectedSession", newSessionId);
            
//                 setTimeout(() => fetchData(newSessionId), 0);
//               }}
//             sx={{
//               color: "#000000",
//               "& .MuiSelect-select": { color: "#000000" },
//               "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
//               "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
//             }}
//           >
//             {sessionList.map((session) => (
//               <MenuItem
//                 key={session.SessionID}
//                 value={session.SessionID}
//                 sx={{
//                   color: "#000000",
//                   backgroundColor: "#ffffff",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 {session.SessionID}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Reports Sections */}
//         {[
//           {
//             title: "Questionnaire",
//             content: (
//               <Box sx={{ padding: 2 }}>
//                 <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
//                         <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Session ID</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Final Score</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {questionnaire.length > 0 ? (
//                         questionnaire.map((item, index) => (
//                           <TableRow key={index}>
//                             <TableCell sx={{ color: "#333" }}>{item.Session_ID}</TableCell>
//                             <TableCell sx={{ color: "#333", fontWeight: "bold" }}>{item.Final_Score}</TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={2} sx={{ textAlign: "center", color: "#666" }}>
//                             No data available
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//             ),
//           }
//           ,
//           {
//             title: "Gamified Assessments",
//             content: (
//               <>
//               {/* Pop the Balloon */}
              
//               {balloonGame.length > 0 && (
//                 <Box sx={{ marginBottom: 2, padding: 2 }}>
//                   <Typography sx={{ fontWeight: "bold", color: "#003366", fontSize: "1.2rem" }}>
//                     Pop the Balloon
//                   </Typography>

//                   {/* Level-wise Summary */}
//                   <Box sx={{ padding: 2, backgroundColor: "#f8f9fa", borderRadius: "8px", color: "#333" }}>
//                     <Typography sx={{ color: "#d63384", fontSize: "1rem" }}>
//                       🟢 Level 1: Pink Balloons Only
//                     </Typography>
//                     <Typography sx={{ color: "#555" }}>
//                       🎀 Popped: <strong style={{ color: "#d63384" }}>
//                         {balloonGame.reduce((acc, game) => acc + (game.level === 1 ? game.correcttaps : 0), 0)}
//                       </strong>
//                     </Typography>
//                     <Typography sx={{ color: "#555" }}>
//                       🎈 Missed: <strong style={{ color: "#dc3545" }}>
//                         {balloonGame.reduce((acc, game) => acc + (game.level === 1 ? game.missedballoons : 0), 0)}
//                       </strong>
//                     </Typography>
//                     <Typography sx={{ color: "#555" }}>
//                       ❌ Wrong Taps: <strong style={{ color: "#dc3545" }}>
//                         {balloonGame.reduce((acc, game) => acc + (game.level === 1 ? game.incorrectclicks : 0), 0)}
//                       </strong>
//                     </Typography>

//                     <Divider sx={{ marginY: 1 }} />

//                     <Typography sx={{ color: "#ffc107", fontSize: "1rem" }}>
//                       🟡 Level 2: Yellow Balloons Only
//                     </Typography>
//                     <Typography sx={{ color: "#555" }}>
//                       🟡 Popped: <strong style={{ color: "#ffc107" }}>
//                         {balloonGame.reduce((acc, game) => acc + (game.level === 2 ? game.correcttaps : 0), 0)}
//                       </strong>
//                     </Typography>
//                     <Typography sx={{ color: "#555" }}>
//                       🎈 Missed: <strong style={{ color: "#dc3545" }}>
//                         {balloonGame.reduce((acc, game) => acc + (game.level === 2 ? game.missedballoons : 0), 0)}
//                       </strong>
//                     </Typography>
//                     <Typography sx={{ color: "#555" }}>
//                       🔵 Wrong Taps: <strong style={{ color: "#0d6efd" }}>
//                         {balloonGame.reduce((acc, game) => acc + (game.level === 2 ? game.incorrectclicks : 0), 0)}
//                       </strong>
//                     </Typography>

//                     <Divider sx={{ marginY: 1 }} />

//                     {/* Total Incorrect Taps Across Both Levels */}
//                     <Typography sx={{color: "#dc3545", fontSize: "1.1rem" }}>
//                       ❌ Total Incorrect Taps: 
//                       <strong style={{ color: "#dc3545", marginLeft: "5px" }}>
//                         {balloonGame.reduce((acc, game) => acc + game.incorrectclicks, 0)}
//                       </strong>
//                     </Typography>
//                   </Box>

//                   {/* Expandable Detailed Attempts */}
//                   <Accordion sx={{ marginTop: 2 }}>
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#e9ecef", color: "#333" }}>
//                       <Typography sx={{ fontWeight: "bold" }}>View Detailed Attempts</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       <TableContainer component={Paper}>
//                         <Table>
//                           <TableHead>
//                             <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
//                               <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Attempt #</TableCell>
//                               <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Level</TableCell>
//                               <TableCell sx={{ fontWeight: "bold", color: "#d63384" }}>🎀 Pink Popped</TableCell>
//                               <TableCell sx={{ fontWeight: "bold", color: "#ffc107" }}>🟡 Yellow Popped</TableCell>
//                               <TableCell sx={{ fontWeight: "bold", color: "#0d6efd" }}>🔵 Wrong Taps</TableCell>
//                               <TableCell sx={{ fontWeight: "bold", color: "#333" }}>🎈 Missed</TableCell>
//                               <TableCell sx={{ fontWeight: "bold", color: "#dc3545" }}>❌ Incorrect Clicks</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {balloonGame.map((game, index) => (
//                               <TableRow key={index}>
//                                 <TableCell sx={{ color: "#333" }}>{index + 1}</TableCell>
//                                 <TableCell sx={{ color: "#333" }}>{game.level}</TableCell>
//                                 <TableCell sx={{ color: game.level === 1 ? "#d63384" : "#bbb" }}>
//                                   {game.level === 1 ? game.correcttaps : "N/A"}
//                                 </TableCell>
//                                 <TableCell sx={{ color: game.level === 2 ? "#ffc107" : "#bbb" }}>
//                                   {game.level === 2 ? game.correcttaps : "N/A"}
//                                 </TableCell>
//                                 <TableCell sx={{ color: game.level === 2 ? "#0d6efd" : "#bbb" }}>
//                                   {game.level === 2 ? game.incorrectclicks : "N/A"}
//                                 </TableCell>
//                                 <TableCell sx={{ color: "#333" }}>{game.missedballoons}</TableCell>
//                                 <TableCell sx={{ color: "#dc3545" }}>{game.incorrectclicks}</TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </AccordionDetails>
//                   </Accordion>
//                 </Box>
//               )}

//                 {/* Follow the Fish */}
//                 {followFish.length > 0 && (
//                   <Box sx={{ marginBottom: 2, padding: 1 }}>
//                     <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
//                       Follow the Fish
//                     </Typography>
//                     <Typography sx={{color: "#003366" }}>
//                       Correct Trials: {followFish[0]?.correcttrials ?? "No data"}
//                     </Typography>
//                     <Typography sx={{color: "#003366" }}>
//                       Incorrect Trials: {followFish[0]?.incorrecttrials ?? "No data"}
//                     </Typography>
//                   </Box>
//                 )}

//                 {/* Human vs Object */}
//                 {humanVsObject.length > 0 && (
//                   <Box sx={{ marginBottom: 2, padding: 1 }}>
//                     <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
//                       Human vs Object
//                     </Typography>
//                     <Typography sx={{color: "#003366" }}>
//                       Correct Responses: {humanVsObject[0]?.correctresponses ?? "No data"}
//                     </Typography>
//                     <Typography sx={{color: "#003366" }}>
//                       Incorrect Responses: {humanVsObject[0]?.incorrectresponses ?? "No data"}
//                     </Typography>
//                   </Box>
//                 )}

//                 {/* Emotion Puzzle */}
//                 {emotionPuzzle.length > 0 && (
//                   <Box sx={{ marginBottom: 2, padding: 1 }}>
//                     <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
//                       Emotion Puzzle
//                     </Typography>

//                     {/* Summary Table */}
//                     <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
//                       <Table>
//                         <TableHead sx={{ backgroundColor: "#eef2f7" }}>
//                           <TableRow>
//                             <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                               Total Attempts
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                               Avg Reaction Time (ms)
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                               Correct Attempts
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                               Incorrect Attempts
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           <TableRow>
//                             <TableCell sx={{ color: "#000000" }}>{emotionPuzzle.length}</TableCell>
//                             <TableCell sx={{ color: "#000000" }}>
//                               {(
//                                 emotionPuzzle.reduce((acc, curr) => acc + curr.reaction_time, 0) /
//                                 emotionPuzzle.length
//                               ).toFixed(2)}
//                             </TableCell>
//                             <TableCell sx={{ color: "#000000" }}>
//                               {
//                                 emotionPuzzle.filter((data) => data.correct_emotion === data.selected_emotion)
//                                   .length
//                               }
//                             </TableCell>
//                             <TableCell sx={{ color: "#000000" }}>
//                               {
//                                 emotionPuzzle.filter((data) => data.correct_emotion !== data.selected_emotion)
//                                   .length
//                               }
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>
//                     </TableContainer>

//                     {/* Expandable History */}
//                     <Accordion>
//                       <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef2f7" }}>
//                         <Typography sx={{ fontWeight: "bold", color: "#003366" }}>
//                           View Detailed Attempts
//                         </Typography>
//                       </AccordionSummary>
//                       <AccordionDetails>
//                         <TableContainer component={Paper}>
//                           <Table>
//                             <TableHead sx={{ backgroundColor: "#eef2f7" }}>
//                               <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                                   Correct Emotion
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                                   Selected Emotion
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
//                                   Reaction Time (ms)
//                                 </TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               {emotionPuzzle.map((attempt, index) => (
//                                 <TableRow key={index}>
//                                   <TableCell sx={{ color: "#000000" }}>{attempt.correct_emotion}</TableCell>
//                                   <TableCell sx={{ color: "#000000" }}>{attempt.selected_emotion}</TableCell>
//                                   <TableCell sx={{ color: "#000000" }}>{attempt.reaction_time.toFixed(2)}</TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           </Table>
//                         </TableContainer>
//                       </AccordionDetails>
//                     </Accordion>
//                   </Box>
//                 )}

//                 {/* Show "No data available" only if all games have no data */}
//                 {!balloonGame.length &&
//                   !followFish.length &&
//                   !humanVsObject.length &&
//                   !emotionPuzzle.length && (
//                     <Typography sx={{ color: "#666" }}>No data available</Typography>
//                   )}
//               </>
//             ),
//           },
          
//           {
//             title: "Speech Analysis",
//             data: speechAnalysis, // Keep "data" to ensure compatibility with existing logic
//             rows: [
//               { key: "PredictionLabel", label: "Prediction" }
//             ],
//             content: (
//               <Box sx={{ padding: 2 }}>
//                 <TableContainer component={Paper} sx={{ borderRadius: "8px", overflow: "hidden" }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
//                         <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Feature</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>Value</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {speechAnalysis.length > 0 ? (
//                         speechAnalysis.map((item, index) => (
//                           <TableRow key={index}>
//                             <TableCell sx={{ color: "#666", fontWeight: "bold" }}>Prediction Label</TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: "bold",
//                                 color: item.PredictionLabel === "Autistic" ? "red" : "green",
//                               }}
//                             >
//                               {item.PredictionLabel}
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={2} sx={{ textAlign: "center", color: "#666" }}>
//                             No data available
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//             ),
//           }  
//         ,
//         ].map(({ title, data = [], rows = [], content }) => (
//           <Accordion key={title}>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               sx={{ backgroundColor: "#eef2f7" }}
//             >
//               <Typography
//                 sx={{ fontWeight: "bold", color: "#002244", fontSize: "1.1rem" }}
//               >
//                 {title}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               {content ||
//                 (data.length > 0 ? (
//                   rows.map(({ key, label }) => (
//                     <Typography key={key} sx={{ color: "#333" }}>
//                       {label}:{" "}
//                       {Array.isArray(data) && data.length > 0
//                         ? (data[0] as any)?.[key] ?? "No data"
//                         : "No data"}
//                     </Typography>
//                   ))
//                 ) : (
//                   <Typography sx={{ color: "#666" }}>No data available</Typography>
//                 ))}
//             </AccordionDetails>
//           </Accordion>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default Report;


// Define types
interface SessionData {
  SessionID: string;
}

const Section: React.FC<{ heading: string; text: string | { summary: string; details?: string } }> = ({ heading, text }) => {
  const content = typeof text === "string"
    ? text
    : `${text.summary ?? ""}\n\n${text.details ?? ""}`;

  return (
    <Box mb={4}>
      <Typography variant="h6" sx={{ color: "#002244", fontWeight: "bold", mb: 1 }}>{heading}</Typography>
      <Typography sx={{ color: "#000000", whiteSpace: "pre-line", lineHeight: 1.8 }}>
        {content}
      </Typography>
    </Box>
  );
};



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
  // const [report, setReport] = useState<string>("");
  interface ReportData {
    title: string;
    note: string;
    mchat_section: string;
    balloon_section: string;
    emotion_section: string;
    audio_section: string;
    summary: string;
    recommendations: string;
    important_consideration: string;
  }
  
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const storedSessions = localStorage.getItem("SessionList");
    const storedSelectedSession = localStorage.getItem("SelectedSession");

    if (storedSessions) {
      setSessionList(JSON.parse(storedSessions));
      setSelectedSession(storedSelectedSession || JSON.parse(storedSessions)[0]?.SessionID);
    } else if (selectedChildId) {
      fetchSessions(selectedChildId);
    }
  }, [selectedChildId]);

  useEffect(() => {
    if (selectedSession) {
      fetchData(selectedSession);
    }
  }, [selectedSession]);

  const fetchSessions = async (childId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/allSessions/${childId}`);

      if (response.data.sessions.length > 0) {
        const firstSessionID = response.data.sessions[0].SessionID;

        setSessionList(response.data.sessions);
        setSelectedSession(null);

        setTimeout(() => {
          setSelectedSession(firstSessionID);
          localStorage.setItem("SelectedSession", firstSessionID);
        }, 50);
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
        // axios.get("http://localhost:5001/api/follow-data", { params: { sessionId } }),
        // axios.get("http://localhost:5001/api/human-vs-object", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/emotion-puzzle", { params: { sessionId } }),
        axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
      ]);

      const newData = {
        questionnaire: responses[0].status === "fulfilled" ? responses[0].value.data || [] : [],
        balloonGame: responses[1].status === "fulfilled" ? responses[1].value.data || [] : [],
        followFish: responses[2].status === "fulfilled" ? responses[2].value.data || [] : [],
        humanVsObject: responses[3].status === "fulfilled" ? responses[3].value.data || [] : [],
        // emotionPuzzle: responses[4].status === "fulfilled" ? responses[4].value.data || [] : [],
        // speechAnalysis: responses[5].status === "fulfilled" ? responses[5].value.data || [] : [],
      };

      setQuestionnaire(newData.questionnaire);
      setBalloonGame(newData.balloonGame);
      setFollowFish(newData.followFish);
      setHumanVsObject(newData.humanVsObject);
      // setEmotionPuzzle(newData.emotionPuzzle);
      // setSpeechAnalysis(newData.speechAnalysis);

      const transformedData = {
        questionnaire: {
          mchat_score: questionnaire[0]?.Final_Score || 0,
        },
        pop_the_balloon: {
          session_duration: balloonGame[1]?.sessionduration || 0,
          correct_taps: balloonGame[1]?.correcttaps || 0,
          missed_balloons: balloonGame[1]?.missedballoons || 0,
          incorrect_clicks: balloonGame[1]?.incorrectclicks || 0,
          total_taps: balloonGame[1]?.totaltaps || 0,
          level: balloonGame[1]?.level || 1,
          age: balloonGame[1]?.Age || 4,
          gender: balloonGame[1]?.Gender || "Unknown"
        },
        emotion_puzzle: {
          attempt_number: emotionPuzzle[0]?.attempt_number || 0,
          correct_emotion: emotionPuzzle[0]?.correct_emotion || "",
          selected_emotion: emotionPuzzle[0]?.selected_emotion || "",
          reaction_time: emotionPuzzle[0]?.reaction_time || 0,
          is_correct: emotionPuzzle[0]?.is_correct || false,
          cumulative_time: emotionPuzzle[0]?.cumulative_time || 0,
          age: emotionPuzzle[0]?.Age || 4,
          gender: emotionPuzzle[0]?.Gender || "Unknown",
          level: emotionPuzzle[0]?.level || 1
        },
        audio_analysis: {
          mfcc_mean: 0.0,
          response_latency: 0.0,
          echolalia_score: 0.0,
          speech_confidence: 0.0
        }
      };
      

      const jsonData = JSON.stringify(transformedData);
      console.log("🔍 jsonData sent to Gemini:", jsonData);
      const geminiResponse = await axios.post("http://localhost:8000/api/generate-report", {
        data: jsonData
      });
      
      console.log("🔍 Gemini response:", geminiResponse.data);

      // setReport(geminiResponse.data.report);
      setReport(geminiResponse.data); // Since you're returning the JSON directly from backend
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
        {/* Sidebar Code Here */}
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

      <Box p={4} flex={1}>
        <Typography variant="h4" gutterBottom sx={{ color: "#002244", fontWeight: "bold" }}>
          Reports
        </Typography>

        <FormControl fullWidth sx={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #ccc", marginBottom: 2 }}>
          <InputLabel sx={{ color: "#000000" }}>Select Session</InputLabel>
          <Select
            value={selectedSession || ""}
            onChange={(e) => {
              const newSessionId = e.target.value as string;
              setSelectedSession(newSessionId);
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
                sx={{ color: "#000000", backgroundColor: "#ffffff", "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                {session.SessionID}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Display Generated Report */}
        {report && (
  <Box mt={4} p={3} bgcolor="#ffffff" borderRadius="12px" border="1px solid #ccc">
    <Typography variant="h5" sx={{ color: "#003366", mb: 3 }}>
      {report.title}
    </Typography>

    <Section heading="Note" text = "Thank you for participating in our gamified autism screening. The results from the assessments are summarized below. These games are designed to provide insights into various aspects of your child's development, including attention, motor skills, language, and social interaction. Please note that this report is based solely on the provided assessment data and should not be considered a definitive diagnosis. A qualified professional, such as a developmental pediatrician, psychologist, or psychiatrist, must conduct a comprehensive evaluation to determine an accurate diagnosis. This report aims to help you understand the results and guide you in seeking further professional help."/>
    <Section heading="M-CHAT Results" text={report.mchat_section} />
    <Section heading="Pop the Balloon (Attention & Motor Control)" text={report.balloon_section} />
    <Section heading="Emotion Puzzle (Emotion Recognition)" text={report.emotion_section} />
    <Section heading="Audio Analysis (Speech & Echolalia)" text={report.audio_section} />
    <Section heading="Developmental Summary" text={report.summary} />
    <Section heading="Recommendations" text={report.recommendations} />
    <Section heading="Important Considerations" text="Remember that every child is unique, and the presentation of ASD can
vary widely. Focus not only on areas of challenge but also on your child's strengths and talents. Continue to monitor your child's development and seek professional
guidance as needed. Maintain a positive and supportive attitude, as this can have a profound
impact on your child's well-being and development" />
  </Box>
)}

      </Box>
    </Box>
  );
};

export default Report;
