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
} from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, Logout } from "@mui/icons-material";

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

  // const fetchData = async (sessionId: string) => {
  //   try {
  //     const responses = await Promise.allSettled([
  //       axios.get("http://localhost:5001/api/questionnaire", { params: { sessionId } }),
  //       axios.post("http://localhost:5001/api/balloon-game", { sessionID: sessionId }),
  //       axios.post("http://localhost:5001/api/emotion-puzzle", { sessionID: sessionId }),
  //       // axios.get("http://localhost:5001/api/balloon-game", { params: { sessionId } }),
  //       // axios.get("http://localhost:5001/api/follow-data", { params: { sessionId } }),
  //       // axios.get("http://localhost:5001/api/human-vs-object", { params: { sessionId } }),
  //       // axios.get("http://localhost:5001/api/emotion-puzzle", { params: { sessionId } }),
  //       axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
  //     ]);

  //     const newData = {
  //       questionnaire: responses[0].status === "fulfilled" ? responses[0].value.data || [] : [],
  //       balloonGame: responses[1].status === "fulfilled" ? responses[1].value.data || [] : [],
  //       followFish: responses[2].status === "fulfilled" ? responses[2].value.data || [] : [],
  //       humanVsObject: responses[3].status === "fulfilled" ? responses[3].value.data || [] : [],
  //       // emotionPuzzle: responses[4].status === "fulfilled" ? responses[4].value.data || [] : [],
  //       // speechAnalysis: responses[5].status === "fulfilled" ? responses[5].value.data || [] : [],
  //     };

  //     setQuestionnaire(newData.questionnaire);
  //     setBalloonGame(newData.balloonGame);
  //     setFollowFish(newData.followFish);
  //     setHumanVsObject(newData.humanVsObject);
  //     // setEmotionPuzzle(newData.emotionPuzzle);
  //     // setSpeechAnalysis(newData.speechAnalysis);

  //     const transformedData = {
  //       questionnaire: {
  //         mchat_score: questionnaire[0]?.Final_Score || 0,
  //       },
  //       pop_the_balloon: {
  //         session_duration: balloonGame[0]?.sessionduration || 0,
  //         correct_taps: balloonGame[0]?.correcttaps || 0,
  //         missed_balloons: balloonGame[0]?.missedballoons || 0,
  //         incorrect_clicks: balloonGame[0]?.incorrectclicks || 0,
  //         total_taps: balloonGame[0]?.totaltaps || 0,
  //         level: balloonGame[0]?.level || 1,
  //         age: balloonGame[0]?.Age || 4,
  //         gender: balloonGame[0]?.Gender || "Unknown"
  //       },
  //       emotion_puzzle: {
  //         attempt_number: emotionPuzzle[0]?.attempt_number || 0,
  //         correct_emotion: emotionPuzzle[0]?.correct_emotion || "",
  //         selected_emotion: emotionPuzzle[0]?.selected_emotion || "",
  //         reaction_time: emotionPuzzle[0]?.reaction_time || 0,
  //         is_correct: emotionPuzzle[0]?.is_correct || false,
  //         cumulative_time: emotionPuzzle[0]?.cumulative_time || 0,
  //         age: emotionPuzzle[0]?.Age || 4,
  //         gender: emotionPuzzle[0]?.Gender || "Unknown",
  //         level: emotionPuzzle[0]?.level || 1
  //       },
  //       audio_analysis: {
  //         mfcc_mean: 0.0,
  //         response_latency: 0.0,
  //         echolalia_score: 0.0,
  //         speech_confidence: 0.0
  //       }
  //     };
      

  //     const jsonData = JSON.stringify(transformedData);
  //     console.log("🔍 jsonData sent to Gemini:", jsonData);
  //     const geminiResponse = await axios.post("http://localhost:8000/api/generate-report", {
  //       data: jsonData
  //     });
      
  //     console.log("🔍 Gemini response:", geminiResponse.data);

  //     // setReport(geminiResponse.data.report);
  //     setReport(geminiResponse.data); // Since you're returning the JSON directly from backend
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async (sessionId: string) => {
    try {
      const responses = await Promise.allSettled([
        axios.get("http://localhost:5001/api/questionnaire", { params: { sessionId } }),
        axios.post("http://localhost:5001/api/balloon-game", { sessionID: sessionId }),
        axios.post("http://localhost:5001/api/emotion-puzzle", { sessionID: sessionId }),
        axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
      ]);
  
      const questionnaireData = responses[0].status === "fulfilled" ? responses[0].value.data || [] : [];
      const balloonData = responses[1].status === "fulfilled" ? responses[1].value.data || [] : [];
      const emotionData = responses[2].status === "fulfilled" ? responses[2].value.data || [] : [];
      const speechData = responses[3].status === "fulfilled" ? responses[3].value.data || [] : [];
  
      // Optional: keep states updated
      setQuestionnaire(questionnaireData);
      setBalloonGame(balloonData);
      setEmotionPuzzle(emotionData);
      setSpeechAnalysis(speechData);
  
      const transformedData = {
        questionnaire: {
          mchat_score: questionnaireData[0]?.Final_Score || 0,
        },
        pop_the_balloon: {
          session_duration: balloonData[0]?.sessionduration || 0,
          correct_taps: balloonData[0]?.correcttaps || 0,
          missed_balloons: balloonData[0]?.missedballoons || 0,
          incorrect_clicks: balloonData[0]?.incorrectclicks || 0,
          total_taps: balloonData[0]?.totaltaps || 0,
          level: balloonData[0]?.level || 1,
          age: balloonData[0]?.Age || 4,
          gender: balloonData[0]?.Gender || "Unknown"
        },
        emotion_puzzle: {
          attempt_number: emotionData[0]?.attempt_number || 0,
          correct_emotion: emotionData[0]?.correct_emotion || "",
          selected_emotion: emotionData[0]?.selected_emotion || "",
          reaction_time: emotionData[0]?.reaction_time || 0,
          is_correct: emotionData[0]?.is_correct || false,
          cumulative_time: emotionData[0]?.cumulative_time || 0,
          age: emotionData[0]?.Age || 4,
          gender: emotionData[0]?.Gender || "Unknown",
          level: emotionData[0]?.level || 1
        },
        audio_analysis: {
          mfcc_mean: speechData[0]?.mfcc_mean || 0.0,
          response_latency: speechData[0]?.response_latency || 0.0,
          echolalia_score: speechData[0]?.echolalia_score || 0.0,
          speech_confidence: speechData[0]?.speech_confidence || 0.0
        }
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
