import React, { useEffect, useState } from "react";
// import ReactMarkdown from 'react-markdown';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { setSessionIds } from "./redux/store";
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
import { 
  Button, AppBar, Toolbar, IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoImage from "../assets/logo.png"; 

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedChildId = useSelector((state: any) => state.selectedChildId);
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


  interface ReportData {
    title: string;
    note: string;
    mchat_section: string;
    balloon_section: string;
    ftf_section: string;
    hvo_section: string;
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
        axios.post("http://localhost:5001/api/balloon-game", { sessionID: sessionId }),
        axios.post("http://localhost:5001/api/emotion-puzzle", { sessionID: sessionId }),
        axios.get("http://localhost:5001/api/speech-analysis", { params: { sessionId } }),
        axios.get(`http://localhost:5001/api/session-output/${sessionId}`),
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
          mfcc_mean: speechData[0]?.mfcc_mean || [],
          response_latency: speechData[0]?.response_latency || 0.0,
          echolalia_score: speechData[0]?.echolalia_score || 0.0,
          speech_confidence: speechData[0]?.speech_confidence || 0.0,
          speech_onset_delay: speechData[0]?.speech_onset_delay || 0.0
        },
        classification_output: classificationData
      };
  
      const jsonData = JSON.stringify(transformedData);
      console.log("🔍 jsonData sent to Gemini:", jsonData);
      const geminiResponse = await axios.post("http://localhost:8000/api/generate-report-urdu", {
        data: jsonData
      });
  
      setReport(geminiResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const downloadPDF = () => {
    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    html2canvas(reportElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ASD_Report_${selectedSession}.pdf`);
    });
  };

    const handleLogout = () => {
      dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
      localStorage.clear(); // Clear stored data
      sessionStorage.clear();
      window.location.href = "/sign-in"; // Redirect to login page
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
          <>
          <Button variant="contained" color="primary" sx={{ mt: 2, mb: 3 }} onClick={downloadPDF}>Download PDF</Button>
          <Box id="report-content" mt={2} p={3} bgcolor="#ffffff" borderRadius="12px" border="1px solid #ccc">
    <Typography variant="h5" sx={{ color: "#003366", mb: 3 }}>
      {report.title}
    </Typography>

    <Section heading="نوٹ" text = "ہماری گیمیفائیڈ آٹزم اسکریننگ میں حصہ لینے کا شکریہ۔ تشخیص کے نتائج ذیل میں خلاصہ کیے گئے ہیں۔ یہ گیمز آپ کے بچے کی نشوونما کے مختلف پہلوؤں، جیسے توجہ، موٹر اسکلز، زبان، اور سماجی تعامل کو سمجھنے کے لیے ڈیزائن کی گئی ہیں۔ براہ کرم نوٹ کریں کہ یہ رپورٹ صرف دی گئی تشخیصی معلومات پر مبنی ہے اور اسے حتمی تشخیص نہیں سمجھا جانا چاہیے۔ درست تشخیص کے لیے ایک ماہر پیشہ ور، جیسے کہ بچوں کا ماہرِ نفسیات، ماہرِ نفسیات، یا ماہرِ اطفال سے مکمل جائزہ لینا ضروری ہے۔ یہ رپورٹ آپ کو نتائج کو سمجھنے میں مدد دینے اور پیشہ ورانہ مدد حاصل کرنے کی رہنمائی فراہم کرنے کے لیے بنائی گئی ہے۔" />
    <Section heading="ایم-چیٹ کے نتائج" text={report.mchat_section} />
    <Section heading="پاپ دی بیلون (توجہ اور موٹر کنٹرول)" text={report.balloon_section} />
    <Section heading="ایموشن پزل (جذبات کی پہچان)" text={report.emotion_section} />
    <Section heading="فالو دی فِش (سماجی توجہ)" text={report.ftf_section} />
    <Section heading="ہیومن بمقابلہ آبجیکٹ (سماجی توجہ)" text={report.hvo_section} />
    <Section heading="آڈیو تجزیہ (تقریر اور ایکولالیا)" text={report.audio_section} />
    <Section heading="ترقیاتی خلاصہ" text={report.summary} />
    <Section heading="تجاویز" text={report.recommendations} />
    <Section heading="اہم نکات" text="یاد رکھیں کہ ہر بچہ منفرد ہوتا ہے، اور آٹزم کی علامات مختلف طریقوں سے ظاہر ہو سکتی ہیں۔ صرف چیلنجز پر نہیں بلکہ اپنے بچے کی خوبیوں اور صلاحیتوں پر بھی توجہ دیں۔ اپنے بچے کی نشوونما پر نظر رکھیں اور ضرورت پڑنے پر ماہرین سے رہنمائی حاصل کریں۔ مثبت اور معاون رویہ اپنانا آپ کے بچے کی ذہنی اور جسمانی نشوونما پر بہت اچھا اثر ڈال سکتا ہے۔" />

  </Box>
  </>
)}

      </Box>
    </Box>
  );
};

export default Report;
