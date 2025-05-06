import React, { useEffect, useState } from "react";
// import ReactMarkdown from 'react-markdown';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { setSessionIds } from "./redux/store";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Home, Person, Assessment, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoImage from "../assets/logo.png"; 
import { Description, CheckCircle, SportsEsports, Psychology, Visibility, RecordVoiceOver, TipsAndUpdates, Gavel, Info } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { persistor } from './redux/store'; 

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

interface EmotionPuzzleSummary {
  SessionID: number;
  Age: number;
  Gender: string;
  reaction_mean: number;
  reaction_median: number;
  reaction_min: number;
  reaction_max: number;
  correct_total: number;
  attempts_total: number;
}


interface SpeechAnalysisData {
  mfcc_mean: number[];  // ✅ array
  response_latency: number;
  speech_confidence: number;
  speech_onset_delay: number;
  echolalia_score: number;
}


// Define types
interface SessionData {
  SessionID: string;
}

interface ReportData {
  title: string;
  note: string;
  screening_summary: string;
  motor_cognitive: string;
  emotional_understanding: string;
  visual_social: string;
  speech_language: string;
  summary: string;
  recommendations: string;
  important_consideration: string;
}


const ReportCard: React.FC<{
  heading: string;
  text?: string;
  icon?: React.ReactElement;
  accentColor?: string;
  children?: React.ReactNode;  // ✅ add this line
}> = ({ heading, text, icon = "", accentColor = "#1976d2", children }) => (
  <Box
    sx={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: 2,
      padding: 3,
      marginBottom: 3,
      borderLeft: `6px solid ${accentColor}`,
      animation: "fadeIn 0.5s ease-in-out",
      "@keyframes fadeIn": {
        "0%": { opacity: 0, transform: "translateY(10px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
    }}
  >
    <Typography 
      variant="h6" 
      sx={{ 
        color: "#003366", 
        fontWeight: "bold", 
        mb: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"  // 🧩 center-align heading
      }}
    >
      {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
      {heading}
    </Typography>

    {/* Conditionally render text or children */}
    {text && (
      <Typography sx={{ color: "#333333", lineHeight: 1.8, whiteSpace: "pre-line" }}>
        {text}
      </Typography>
    )}
    
    {children}
  </Box>
);



const Report: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const selectedChildId = useSelector((state: any) => state.selectedChildId);
  const selectedChildId = useSelector((state: any) => state.selectedChildId) as string | null;

  const [sessionList, setSessionList] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData[]>([]);
  const [balloonGame, setBalloonGame] = useState<BalloonGameData[]>([]);
  const [followFish, setFollowFish] = useState<FollowFishData[]>([]);
  const [humanVsObject, setHumanVsObject] = useState<HumanVsObjectData[]>([]);
  const [emotionPuzzle, setEmotionPuzzle] = useState<EmotionPuzzleSummary | null>(null);
  const [speechAnalysis, setSpeechAnalysis] = useState<SpeechAnalysisData[]>([]);
  const [moduleClassifications, setModuleClassifications] = useState({
    ftf_output: "",
    hvo_output: "",
    balloonemotion_output: "",
    audio_output: ""
  });

  
  const [report, setReport] = useState<ReportData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
// ---------------------------------------------------------------------
  useEffect(() => {
    const storedChildId = localStorage.getItem("selectedChildId");
    if (!selectedChildId && storedChildId) {
      dispatch({ type: "SELECT_CHILD", payload: storedChildId }); // varchar-safe
    }
  }, [selectedChildId, dispatch]);
// ---------------------------------------------------------------------

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
      const response = await axios.get(`https://chavez-ai-screening-and-progress.onrender.com/api/allSessions/${childId}`);

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

  useEffect(() => {
    if (selectedSession) {
      fetchData(selectedSession);
      axios.post("https://chavez-ai-screening-and-progress.onrender.com/api/mark-complete", { sessionId: selectedSession })
      .then(() => {
        console.log("Session marked as complete.");
      })
      .catch((err) => {
        console.error("Failed to mark session complete:", err);
      });
    }
  }, [selectedSession]);
  
  const fetchData = async (sessionId: string) => {
    try {
      const responses = await Promise.allSettled([
        axios.get("https://chavez-ai-screening-and-progress.onrender.com/api/questionnaire", { params: { sessionId } }),
        axios.post("https://chavez-ai-screening-and-progress.onrender.com/api/balloon-game", { sessionID: sessionId }),
        axios.post("https://chavez-ai-screening-and-progress.onrender.com/api/emotion-puzzle1", { sessionID: sessionId }),
        axios.get("https://chavez-ai-screening-and-progress.onrender.com/api/speech-analysis", { params: { sessionId } }),
        axios.get(`https://chavez-ai-screening-and-progress.onrender.com/api/session-output/${sessionId}`),
      ]);
  
      const questionnaireData = responses[0].status === "fulfilled" ? responses[0].value.data || [] : [];
      const balloonData = responses[1].status === "fulfilled" ? responses[1].value.data || [] : [];
      const emotionData = responses[2].status === "fulfilled" ? responses[2].value.data || null : null;
      const speechData = responses[3].status === "fulfilled" ? responses[3].value.data || [] : [];
      const level1 = balloonData.find((b: BalloonGameData) => b.level === 1);
      const level2 = balloonData.find((b: BalloonGameData) => b.level === 2);
      const classificationData = responses[4].status === "fulfilled" ? responses[4].value.data || {} : {};

  
      // Optional: keep states updated
      setQuestionnaire(questionnaireData);
      setBalloonGame(balloonData);
      setEmotionPuzzle(emotionData);
      setSpeechAnalysis(speechData);
      setModuleClassifications(classificationData);
  
      const transformedData = {
        questionnaire: {
          mchat_score: questionnaireData[0]?.Final_Score || 0,
        },
        pop_the_balloon: {
          level_1: {
            session_duration: level1?.sessionduration || 0,
            correct_taps: level1?.correcttaps || 0,
            missed_balloons: level1?.missedballoons || 0,
            incorrect_clicks: level1?.incorrectclicks || 0,
            total_taps: level1?.totaltaps || 0
          },
          level_2: {
            session_duration: level2?.sessionduration || 0,
            correct_taps: level2?.correcttaps || 0,
            missed_balloons: level2?.missedballoons || 0,
            incorrect_clicks: level2?.incorrectclicks || 0,
            total_taps: level2?.totaltaps || 0
          },
          age: balloonData[0]?.Age || 4,
          gender: balloonData[0]?.Gender || "Unknown"
        },
        emotion_puzzle: {
          SessionID: emotionData?.SessionID || 0,
          Age: emotionData?.Age || 4,
          Gender: emotionData?.Gender || "Unknown",
          reaction_mean: emotionData?.reaction_mean || 0,
          reaction_median: emotionData?.reaction_median || 0,
          reaction_min: emotionData?.reaction_min || 0,
          reaction_max: emotionData?.reaction_max || 0,
          correct_total: emotionData?.correct_total || 0,
          attempts_total: emotionData?.attempts_total || 0
        },
        audio_analysis: {
          mfcc_mean: speechData[0]?.MFCC_Mean || [],
          response_latency: speechData[0]?.ResponseLatency || 0.0,
          echolalia_score: speechData[0]?.EcholaliaScore || 0.0,
          speech_confidence: speechData[0]?.SpeechConfidence || 0.0,
          speech_onset_delay: speechData[0]?.SpeechOnsetDelay || 0.0
        },
        classification_output: classificationData
      };
  
      const jsonData = JSON.stringify(transformedData);
      console.log("🔍 jsonData sent to Gemini:", jsonData);
      const geminiResponse = await axios.post("http://localhost:8000/api/generate-report", {
        data: jsonData
      });
  
      setReport(geminiResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const downloadPDF = async () => {
    setIsDownloading(true);
  
    try {
      const reportElement = document.getElementById("report-content");
      if (!reportElement) throw new Error("Report content not found");
  
      await new Promise(resolve => setTimeout(resolve, 500)); // wait for layout/rendering
  
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      // Add more pages if needed
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save(`ASD_Report_${selectedSession}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };



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

    return (
      <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ background: "linear-gradient(to bottom right, #edf2f7, #cce3dc)" }}>
        <AppBar position="static" sx={{ bgcolor: "#003366" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box component="img" src={logoImage} alt="Chavez Logo" sx={{ height: 60, py: 1 }} />
            <Box display="flex" alignItems="center">
              <IconButton color="inherit" component={Link} to="/dashboard"><Home /></IconButton>
              <IconButton color="inherit" onClick={handleProfileSelection}><Person /></IconButton>
              <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
            </Box>
          </Toolbar>
        </AppBar>
  
        <Box p={4} flex={1} maxWidth="1200px" mx="auto">
          <Typography variant="h4" gutterBottom sx={{ color: "#002244", fontWeight: "bold" }}>
            Reports
          </Typography>
  
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "flex-end" }, mb: 4, gap: 2 }}>

<FormControl
  sx={{
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "250px", // 👈 Fixed width for session selector
  }}
>
  <InputLabel sx={{ color: "#000000" }}>Select Session</InputLabel>
  <Select
    value={selectedSession || ""}
    onChange={(e) => {
      const newSessionId = e.target.value;
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
      <MenuItem key={session.SessionID} value={session.SessionID}>
        {session.SessionID}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<Button
  variant="contained"
  startIcon={<Assessment />}
  disabled={isDownloading || !report}
  sx={{
    backgroundColor: "#003366",
    "&:hover": { backgroundColor: "#002244" },
    minWidth: "180px",
  }}
  onClick={downloadPDF}
>
  {isDownloading ? "Downloading..." : "Download PDF"}
</Button>
</Box>

          {!report && (
                <Box mt={4} display="flex" justifyContent="center" alignItems="center">
                  <Typography variant="h6" sx={{ color: "#555" }}>
                    Please select a session to view the report.
                  </Typography>
                </Box>
              )}
                
          {report && (
                  <Box id="report-content" mt={2}>
                    <ReportCard heading="Child ASD Screening Report" text={report.note} icon={<Description />} accentColor="#3498db" />
                    <ReportCard heading="Screening Summary (M-CHAT)" text={report.screening_summary} icon={<CheckCircle />} accentColor="#2ecc71" />
                    <ReportCard heading="Motor & Cognitive Skills" text={report.motor_cognitive} icon={<SportsEsports />} accentColor="#9b59b6" />
                    <ReportCard heading="Emotional Understanding" text={report.emotional_understanding} icon={<Psychology />} accentColor="#e67e22" />
                    <ReportCard heading="Visual Attention & Social Focus" text={report.visual_social} icon={<Visibility />} accentColor="#1abc9c" />
                    <ReportCard heading="Speech & Language" text={report.speech_language} icon={<RecordVoiceOver />} accentColor="#3498db" />
                    <ReportCard 
  heading="Developmental Summary"
  text={""}
  icon={<TipsAndUpdates />} 
  accentColor="#2ecc71"
>
  <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#003366' }}>
          <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Games</TableCell>
          <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Classification</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell sx={{ color: '#000000' }}>Pop the Balloon and Emotion Puzzle</TableCell>
          <TableCell sx={{ color: '#000000' }}>{moduleClassifications.balloonemotion_output || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ color: '#000000' }}>Follow the Fish</TableCell>
          <TableCell sx={{ color: '#000000' }}>{moduleClassifications.ftf_output || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ color: '#000000' }}>Human vs Object</TableCell>
          <TableCell sx={{ color: '#000000' }}>{moduleClassifications.hvo_output || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ color: '#000000' }}>Speech & Language</TableCell>
          <TableCell sx={{ color: '#000000' }}>{moduleClassifications.audio_output || 'N/A'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
</ReportCard>




                    <ReportCard heading="Recommendations" text={report.recommendations} icon={<Gavel />} accentColor="#e74c3c" />
                    <ReportCard heading="Important Considerations" text={report.important_consideration} icon={<Info />} accentColor="#f39c12" />
                  </Box>
                )}


        </Box>
      </Box>
    
    );
  };
  
  export default Report;
