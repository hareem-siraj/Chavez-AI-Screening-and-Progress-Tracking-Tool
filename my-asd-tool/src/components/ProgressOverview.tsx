import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar } from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, CheckCircle, Cancel, Logout, TrendingUp } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Tabs, Tab } from "@mui/material";
import { Grid } from "@mui/material";

import { AppBar, Toolbar, IconButton } from "@mui/material";
import logoImage from "../assets/logo.png"; 


import { Button, Paper, Fade, Card, CardContent, Grow } from "@mui/material";

import avatar1 from "../assets/avatars/1.png";
import avatar2 from "../assets/avatars/2.png";
import avatar3 from "../assets/avatars/3.png";
import avatar4 from "../assets/avatars/4.png";
import avatar5 from "../assets/avatars/5.png";

axios.defaults.baseURL = "http://localhost:5001";

const avatars = [
  { id: 1, src: avatar1 },
  { id: 2, src: avatar2 },
  { id: 3, src: avatar3 },
  { id: 4, src: avatar4 },
  { id: 5, src: avatar5 }
];

interface SessionInfo {
    id: string;
    date: string | null;
  }
  
  interface QuestionnaireData {
    Session_ID: string;
    Final_Score: number;
  }
  
  interface BalloonGameData {
    SessionID: string;
    correcttaps: number;
    incorrectclicks: number;
  }
  
  interface PuzzleGameData {
    SessionID: string;
    correct_emotion: string;
    selected_emotion: string;
    reaction_time: number;
    is_correct: boolean;
  }
  
  interface SpeechAggregateData {
    SessionID: string;
    Confidence: number;
    Latency: number;
    OnsetDelay: number;
    Echolalia: number;
  }
  
  interface ChildProfile {
    Name: string;
    Avatar: number;
  }

    type GraphInput = {
        title: string;
        description: string;
        xAxis: string[];
        yAxis: number[];
    };  
  const ProgressOverview: React.FC = () => {
    
    const dispatch = useDispatch();
    const selectedChildId = useSelector((state: any) => state.selectedChildId);
    const sessionData = useSelector((state: any) => state.sessionData); 
    const [sessionStarted, setSessionStarted] = useState(false);
    const [childProfile, setChildProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState(false);
  
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData[]>([]);
    const [balloonGameData, setBalloonGameData] = useState<BalloonGameData[]>([]);
    const [puzzleGameData, setPuzzleGameData] = useState<PuzzleGameData[]>([]);
    const [speechAnalysisData, setSpeechAnalysisData] = useState<SpeechAggregateData[]>([]);
    // const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
    // const [loading, setLoading] = useState(true);

    const [graphExplanations, setGraphExplanations] = useState<{ [key: string]: string }>({});
    const [explanationLoading, setExplanationLoading] = useState<{ [key: string]: boolean }>({});

    
      
    const explainGraph = async (graphKey: string, data: GraphInput) => {
        setExplanationLoading(prev => ({ ...prev, [graphKey]: true }));
      
        const glossary: Record<string, string> = {
          "questionnaire_score": "The M-CHAT-R/F score is part of an early autism screening tool. Higher scores can indicate more behaviors associated with autism, but it is not a diagnosis — it only suggests if more professional evaluation may be helpful.",
          "balloon_accuracy": "Balloon Game Accuracy shows how well your child was able to tap the correct balloons during a focus and coordination game. A higher percentage indicates better attention and motor control.",
          "puzzle_accuracy": "Puzzle Game Accuracy shows how well your child recognized emotions during a game. Higher percentages suggest stronger emotion recognition skills.",
          "puzzle_reaction": "Average Reaction Time measures how quickly your child responded during emotion recognition tasks. Shorter times may suggest increased focus or familiarity with the game.",
          "puzzle_misclass": "Emotion Misclassifications show how often your child selected the wrong emotion during the game. This helps us identify which emotions may be harder for them to understand.",
          "puzzle_perEmotion": "Per Emotion Performance compares how your child performed across different emotions like happy, sad, angry, etc. It helps highlight strengths and areas that may need support.",
          "speech_confidence": "Speech Confidence reflects how clearly your child speaks. Higher values usually mean the speech was more understandable and confident.",
          "speech_latency": "Response Latency tracks how long it takes your child to begin speaking after a question. Shorter times may suggest quicker understanding or reduced hesitation.",
          "speech_onset": "Speech Onset Delay is the time between the start of a speaking task and when your child actually begins to talk. Shorter onset may reflect improved communication comfort.",
          "speech_echolalia": "Echolalia Score reflects how often your child repeats what they hear. While some repetition is normal, frequent echolalia may be a sign to explore speech development further."
        };
      
        const definition = glossary[graphKey] || "";
      
        const prompt = `
      You are an AI assistant designed to help parents understand trends in their child's developmental data.
      
      The data below reflects a developmental metric tracked across multiple screening sessions. The X-axis lists session IDs and the Y-axis shows numeric values.
      
      Title: ${data.title}
      Description: ${data.description}
      
      X-Axis: ${JSON.stringify(data.xAxis)}
      Y-Axis: ${JSON.stringify(data.yAxis)}
      
      ${definition}
      
      Please write a clear and caring explanation for parents in 2 short paragraphs:
      
      1. Explain the overall trend (increasing, decreasing, stable, fluctuating). Even with two points, describe what the change may suggest, but mention that more sessions will help confirm patterns.
      2. Describe what this metric actually means in simple terms, especially if it's technical (e.g., echolalia, latency). Explain whether higher/lower scores are generally good or not, and what parents might understand from it.
      
      If your explanation exceeds 500 characters, please insert a line break (\`\n\n\`) after the first paragraph to ensure readability. Each paragraph should be concise and focused.

      Avoid technical jargon. Use warm, reassuring language and never make diagnostic claims. You’re just helping them understand patterns and possibilities.
        `.trim();
      
        // Try Gemini
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );
      
          const geminiJson = await geminiRes.json();
          const geminiText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (geminiText) {
            setGraphExplanations(prev => ({ ...prev, [graphKey]: geminiText }));
            return;
          }
        } catch (err) {
          console.warn("Gemini failed, falling back to GPT-4");
        }
      
        // Fallback to GPT-4
        try {
          const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
            }),
          });
      
          const gptJson = await gptRes.json();
          const gptText =
            gptJson.choices?.[0]?.message?.content ?? "Explanation not available.";
      
          setGraphExplanations(prev => ({ ...prev, [graphKey]: gptText }));
        } catch (err) {
          setGraphExplanations(prev => ({
            ...prev,
            [graphKey]: "Failed to fetch explanation from both models. Please try again.",
          }));
        } finally {
          setExplanationLoading(prev => ({ ...prev, [graphKey]: false }));
        }
      };
      
      
    useEffect(() => {
        const storedChildId = localStorage.getItem("selectedChildId");
        if (storedChildId) {
          dispatch({ type: "SELECT_CHILD", payload: storedChildId });  
          fetchChildProfile(storedChildId);                             
          fetchSessionsAndData(storedChildId);                       
        }
    }, []);
      
    useEffect(() => {
        if (selectedChildId) {
          fetchChildProfile(selectedChildId);
          fetchSessionsAndData(selectedChildId);
        }
    }, [selectedChildId]);
      
const fetchChildProfile = async (childId: string) => {
        try {
          const res = await axios.get("/api/get-child-profile", {
            params: { ChildID: childId }
          });
          setChildProfile(res.data);
        } catch (err) {
          console.error("Error fetching child profile:", err);
        }
    };


    const fetchSessionsAndData = async (childId: string) => {
        try {
          const response = await axios.get(`http://localhost:5001/api/allSessions/${childId}`);
          
          if (response.data && Array.isArray(response.data.sessions)) {
            const sessionsData: SessionInfo[] = response.data.sessions.map((s: any) => ({
              id: s.SessionID,
              date: s.CreatedAt || null, // if available, otherwise null
            }));
      
            // Optional: store in Redux/localStorage if needed
            setSessions(sessionsData);
      
            const ids = sessionsData.map((s) => s.id);
            if (ids.length > 0) {
              await fetchAllData(ids);
            }
          }
        } catch (error) {
          console.error("Error fetching all sessions:", error);
        }
    };
      
const fetchAllData = async (ids: string[]) => {
    try {
      const [qnsRes, balloonRes, puzzleRes, speechRes] = await Promise.all([
        // Questionnaire (GET)
        Promise.all(ids.map((id) =>
          axios.get(`/api/questionnaire?sessionId=${id}`)
        )),
        // Balloon game (POST)
        Promise.all(ids.map((id) =>
          axios.post(`/api/balloon-game`, { sessionID: id })
        )),
        // Puzzle game (POST)
        Promise.all(ids.map((id) =>
          axios.post(`/api/emotion-puzzle`, { sessionID: id })
        )),
        // Speech analysis (GET)
        Promise.all(ids.map((id) =>
          axios.get(`/api/speech-analysis?sessionId=${id}`)
        )),
      ]);

      setQuestionnaireData(qnsRes.flatMap((r) => r.data));
      setBalloonGameData(balloonRes.flatMap((r) => r.data));
      setPuzzleGameData(puzzleRes.flatMap((r) => r.data));

      // Aggregate speech
      const speechRaw = speechRes.flatMap((r) => r.data || []);
      const aggregates = ids.map((id) => {
        const rows = speechRaw.filter((row: any) => String(row.SessionID) === id);
        const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        return {
          SessionID: id,
          Confidence: avg(rows.map((r) => r.SpeechConfidence || 0)),
          Latency: avg(rows.map((r) => r.ResponseLatency || 0)),
          OnsetDelay: avg(rows.map((r) => r.SpeechOnsetDelay || 0)),
          Echolalia: avg(rows.map((r) => r.EcholaliaScore || 0)),
        };
      });
      setSpeechAnalysisData(aggregates);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setLoading(false);
    }
  };

  const computeBalloonAccuracyBySession = () => {
    const map: Record<string, { correct: number; incorrect: number }> = {};
    balloonGameData.forEach((e) => {
      map[e.SessionID] ??= { correct: 0, incorrect: 0 };
      map[e.SessionID].correct += e.correcttaps || 0;
      map[e.SessionID].incorrect += e.incorrectclicks || 0;
    });

    const labels: string[] = [];
    const accuracy: number[] = [];
    const tooltips: string[] = [];

    sessions.forEach(({ id, date }) => {
      const d = map[id];
      const total = d ? d.correct + d.incorrect : 0;
      const acc = total ? (d!.correct / total) * 100 : 0;
      labels.push(date ? new Date(date).toLocaleDateString() : id);
      accuracy.push(parseFloat(acc.toFixed(2)));
      tooltips.push(d ? `${d.correct} correct / ${d.incorrect} incorrect` : "No data");
    });

    return { labels, accuracy, tooltips };
  };

  const computePuzzleMetrics = () => {
    const sessionStats: Record<string, {
      correct: number;
      incorrect: number;
      total: number;
      reactionTimes: number[];
      emotionStats: Record<string, { correct: number; incorrect: number }>;
    }> = {};
  
    puzzleGameData.forEach((entry: any) => {
      const { SessionID, correct_emotion, selected_emotion, reaction_time } = entry;
      if (!sessionStats[SessionID]) {
        sessionStats[SessionID] = { correct: 0, incorrect: 0, total: 0, reactionTimes: [], emotionStats: {} };
      }
  
      const session = sessionStats[SessionID];
      const isCorrect = correct_emotion === selected_emotion;
  
      session.total += 1;
      isCorrect ? session.correct++ : session.incorrect++;
      if (reaction_time) session.reactionTimes.push(parseFloat(reaction_time));
  
      if (!session.emotionStats[correct_emotion]) {
        session.emotionStats[correct_emotion] = { correct: 0, incorrect: 0 };
      }
      isCorrect ? session.emotionStats[correct_emotion].correct++ : session.emotionStats[correct_emotion].incorrect++;
    });
  
    return sessionStats;
  };
  
  const [puzzleTab, setPuzzleTab] = useState<"accuracy" | "reaction" | "misclass" | "perEmotion">("accuracy");
  const [speechTab, setSpeechTab] = useState<"confidence" | "latency" | "onset" | "echolalia">("confidence");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setSessions([]); // ✅ clear local session state
    window.location.href = "/sign-in";
  };


  const handlePuzzleTabChange = (_evt: React.SyntheticEvent, val: "accuracy" | "reaction" | "misclass" | "perEmotion") => {
    setPuzzleTab(val);
  };
  
  const handleSpeechTabChange = (_evt: React.SyntheticEvent, val: "confidence" | "latency" | "onset" | "echolalia") => {
    setSpeechTab(val);
  };

  const handleProfileSelection = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/profile-selection";
  };
  
  
// derive a properly typed list of IDs
const sessionIds: string[] = sessions.map(s => s.id);

  return (
    <>
    {/* Top Navigation Bar */}
    <AppBar position="static" sx={{ bgcolor: "#003366" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box component="img"
          src={logoImage}
          alt="Chavez Logo"
          sx={{ height: 60, maxHeight: "100%", py: 1 }}
        />
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" component={Link} to="/dashboard">
            <Home />
          </IconButton>
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
      <Box p={4} flex={1}>
        
        {/* Child Information Navbar */}
        <Box display="flex" alignItems="center" p={2} bgcolor="#e3f2fd" borderRadius="8px">
          {childProfile?.Avatar && (
            <Avatar
              src={avatars.find(a => a.id === Number(childProfile.Avatar))?.src || ""}
              sx={{ width: 50, height: 50, marginRight: 2 }}
            />
          )}
          <Box>
            <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold" }}>
              {childProfile?.Name || "No Child Selected"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
            Active Sessions: {sessions
                .map(s => s.date
                    ? new Date(s.date).toLocaleDateString()
                    : s.id
                )
                .join(", ")}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" mt={3} sx={{ color: "#003366", fontWeight: "bold" }}>Progress Overview</Typography>

        {loading ? (
          <Typography>Loading data...</Typography>
        ) : sessions.length === 0 ? (
          <Typography>No sessions found for this child.</Typography>
        ) : (
          <>
            {/* Questionnaire Score Section */}
            <Typography variant="h6" mt={4} sx={{ color: "#003366", fontWeight: "bold" }}>
                Questionnaire Score Trend
                </Typography>

                <Grid container spacing={3} alignItems="center" mt={1}>
                {/* Chart Column */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ width: "100%", height: "500px", pr: 2 }}>
                    <Line
                        data={{
                        labels: questionnaireData.map((d) => d.Session_ID),
                        datasets: [
                            {
                            label: "Final Score",
                            data: questionnaireData.map((d) => d.Final_Score),
                            borderColor: "#004aad",
                            fill: false,
                            borderWidth: 2,
                            pointRadius: 3
                            }
                        ]
                        }}
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                            labels: {
                                color: "#003366",
                                font: { weight: "bold" }
                            }
                            }
                        },
                        scales: {
                            x: {
                            ticks: { color: "#003366" }
                            },
                            y: {
                            ticks: { color: "#003366" }
                            }
                        }
                        }}
                    />
                    </Box>
                </Grid>

                {/* Explanation + Button Column */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Button
                        variant="contained"
                        sx={{
                        bgcolor: "#005f99",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 3,
                        py: 1.5,
                        mb: 2,
                        borderRadius: "8px",
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(0, 95, 153, 0.3)",
                        ":hover": { bgcolor: "#004d80" }
                        }}
                        onClick={() =>
                        explainGraph("questionnaire_score", {
                            title: "Questionnaire Score Trend",
                            description: "Final scores from screening sessions  X-axis represents unique session IDs",
                            xAxis: questionnaireData.map((d) => d.Session_ID),
                            yAxis: questionnaireData.map((d) => d.Final_Score)
                        })
                        }
                    >
                        {explanationLoading["questionnaire_score"] ? "Generating..." : "Explain this graph"}
                    </Button>

                    {graphExplanations["questionnaire_score"] && (
                        <Fade in={true} timeout={600}>
                        <Card
                            elevation={5}
                            sx={{
                            p: 3,
                            backgroundColor: "#f5faff",
                            borderRadius: "14px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                            border: "1px solid #d2e3f3"
                            }}
                        >
                            <CardContent>
                            <Typography sx={{ fontSize: "1.15rem", color: "#002b5c", lineHeight: 1.85, fontWeight: 500 }}>
                                {graphExplanations["questionnaire_score"]}
                            </Typography>
                            </CardContent>
                        </Card>
                        </Fade>
                    )}
                    </Box>
                </Grid>
                </Grid>





            {/* Balloon Game Accuracy */}
            <Typography variant="h6" mt={4} sx={{ color: "#003366", fontWeight: "bold" }}>
                Balloon Game Accuracy (%)
                </Typography>

                {(() => {
                const { labels, accuracy, tooltips } = computeBalloonAccuracyBySession();

                return (
                    <Grid container spacing={3} alignItems="center" mt={1}>
                    {/* Graph Column */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ width: "100%", height: "500px", pr: 2 }}>
                        <Bar
                            data={{
                            labels,
                            datasets: [{
                                label: "Accuracy (%)",
                                data: accuracy,
                                backgroundColor: "steelblue"
                            }]
                            }}
                            options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                callbacks: {
                                    label: function (context) {
                                    return `Accuracy: ${context.raw}% (${tooltips[context.dataIndex]})`;
                                    }
                                }
                                },
                                legend: {
                                labels: {
                                    color: "#003366",
                                    font: { weight: "bold" }
                                }
                                }
                            },
                            scales: {
                                y: {
                                min: 0,
                                max: 100,
                                ticks: {
                                    callback: (value) => `${value}%`,
                                    color: "#003366"
                                },
                                title: {
                                    display: true,
                                    text: "Accuracy (%)",
                                    color: "#003366"
                                }
                                },
                                x: {
                                ticks: { color: "#003366" }
                                }
                            }
                            }}
                        />
                        </Box>
                    </Grid>

                    {/* Explanation Column */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Button
                            variant="contained"
                            sx={{
                            bgcolor: "#005f99",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            py: 1.5,
                            mb: 2,
                            borderRadius: "8px",
                            textTransform: "none",
                            boxShadow: "0 4px 12px rgba(0, 95, 153, 0.3)",
                            ":hover": { bgcolor: "#004d80" }
                            }}
                            onClick={() =>
                            explainGraph("balloon_accuracy", {
                                title: "Balloon Game Accuracy (%)",
                                description: "This measures how accurately the child tapped the correct balloons in each session. Higher accuracy indicates better motor control and attention.",
                                xAxis: labels,
                                yAxis: accuracy
                            })
                            }
                        >
                            {explanationLoading["balloon_accuracy"] ? "Generating..." : "Explain this graph"}
                        </Button>

                        {graphExplanations["balloon_accuracy"] && (
                            <Fade in={true} timeout={600}>
                            <Card
                                elevation={5}
                                sx={{
                                p: 3,
                                backgroundColor: "#f5faff",
                                borderRadius: "14px",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                                border: "1px solid #d2e3f3"
                                }}
                            >
                                <CardContent>
                                <Typography sx={{ fontSize: "1.15rem", color: "#002b5c", lineHeight: 1.85, fontWeight: 500 }}>
                                    {graphExplanations["balloon_accuracy"]}
                                </Typography>
                                </CardContent>
                            </Card>
                            </Fade>
                        )}
                        </Box>
                    </Grid>
                    </Grid>
                );
                })()}



            {/* Puzzle Game Performance */}
            <Typography variant="h6" mt={4} sx={{ color: "#003366", fontWeight: "bold" }}>
            Puzzle Game Performance
            </Typography>

            <Tabs value={puzzleTab} onChange={handlePuzzleTabChange} sx={{ mb: 2 }}>
            <Tab value="accuracy" label="Accuracy per Session" />
            <Tab value="reaction" label="Avg Reaction Time" />
            <Tab value="misclass" label="Emotion Misclassifications" />
            <Tab value="perEmotion" label="Per Emotion Performance" />
            </Tabs>

            {(() => {
            const stats = computePuzzleMetrics();
            const sessions = sessionIds.filter((id) => stats[id] && stats[id].total > 0);

            let chart: JSX.Element | null = null;
            let data: number[] = [];
            let graphInput = {
                title: "",
                description: "",
                xAxis: [] as string[],
                yAxis: [] as number[]
            };

            if (puzzleTab === "accuracy") {
                data = sessions.map(id => (stats[id].correct / stats[id].total) * 100);
                chart = (
                <Bar data={{
                    labels: sessions,
                    datasets: [{ label: "Accuracy (%)", data, backgroundColor: "blue" }]
                }} />
                );
                graphInput = {
                title: "Puzzle Accuracy per Session",
                description: "This shows the percentage of correctly identified emotions by the child per session. Higher accuracy indicates better emotional recognition.",
                xAxis: sessions,
                yAxis: data
                };
            } else if (puzzleTab === "reaction") {
                data = sessions.map(id => {
                const times = stats[id].reactionTimes;
                return times.length ? parseFloat((times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(2)) : 0;
                });
                chart = (
                <Bar data={{
                    labels: sessions,
                    datasets: [{ label: "Avg Reaction Time (s)", data, backgroundColor: "purple" }]
                }} />
                );
                graphInput = {
                title: "Average Reaction Time per Session",
                description: "This reflects the average time the child took to respond during the puzzle game. Faster response times can suggest improved attention or familiarity.",
                xAxis: sessions,
                yAxis: data
                };
            } else if (puzzleTab === "misclass") {
                const emotionLabels = Array.from(new Set(puzzleGameData.map(e => e.correct_emotion)));
                const misclassCounts: Record<string, number> = {};
                emotionLabels.forEach(emotion => misclassCounts[emotion] = 0);
                puzzleGameData.forEach(e => {
                if (e.correct_emotion !== e.selected_emotion) misclassCounts[e.correct_emotion]++;
                });
                data = emotionLabels.map(e => misclassCounts[e]);
                chart = (
                <Bar data={{
                    labels: emotionLabels,
                    datasets: [{ label: "Misclassifications", data, backgroundColor: "orange" }]
                }} />
                );
                graphInput = {
                title: "Emotion Misclassifications",
                description: "This shows how often each emotion was incorrectly identified. Higher values may indicate emotions the child struggles to recognize.",
                xAxis: emotionLabels,
                yAxis: data
                };
            } else if (puzzleTab === "perEmotion") {
                const emotionLabels = Array.from(new Set(puzzleGameData.map(e => e.correct_emotion)));
                const correctData = emotionLabels.map(e =>
                puzzleGameData.filter(x => x.correct_emotion === e && x.correct_emotion === x.selected_emotion).length
                );
                const incorrectData = emotionLabels.map(e =>
                puzzleGameData.filter(x => x.correct_emotion === e && x.correct_emotion !== x.selected_emotion).length
                );
                data = [...correctData, ...incorrectData];
                chart = (
                <Bar data={{
                    labels: emotionLabels,
                    datasets: [
                    { label: "Correct", data: correctData, backgroundColor: "green" },
                    { label: "Incorrect", data: incorrectData, backgroundColor: "red" }
                    ]
                }} />
                );
                graphInput = {
                title: "Per-Emotion Performance",
                description: "Displays how well the child performed for each emotion, showing correct and incorrect identifications.",
                xAxis: emotionLabels,
                yAxis: correctData.map((c, i) => c + incorrectData[i])
                };
            }

        return (
            <Grid container spacing={3} alignItems="center">
            {/* Graph Column */}
            <Grid item xs={12} md={6}>
                <Box sx={{ width: "100%", height: "500px", pr: 2 }}>
                {React.cloneElement(chart!)}
                </Box>
            </Grid>

            {/* Button + Explanation Column */}
            <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Button
                    variant="contained"
                    sx={{
                    bgcolor: "#005f99",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 3,
                    py: 1.5,
                    mb: 2,
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(0, 95, 153, 0.3)",
                    ":hover": { bgcolor: "#004d80" }
                    }}
                    onClick={() => explainGraph(`puzzle_${puzzleTab}`, graphInput)}
                >
                    {explanationLoading[`puzzle_${puzzleTab}`] ? "Generating..." : "Explain this graph"}
                </Button>

                {graphExplanations[`puzzle_${puzzleTab}`] && (
                    <Fade in={true} timeout={600}>
                    <Card
                        elevation={5}
                        sx={{
                        p: 3,
                        backgroundColor: "#f5faff",
                        borderRadius: "14px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #d2e3f3"
                        }}
                    >
                        <CardContent>
                        <Typography sx={{ fontSize: "1.15rem", color: "#002b5c", lineHeight: 1.85, fontWeight: 500 }}>
                            {graphExplanations[`puzzle_${puzzleTab}`]}
                        </Typography>
                        </CardContent>
                    </Card>
                    </Fade>
                )}
                </Box>
            </Grid>
            </Grid>
        );
        })()}


                  

        {/* Speech Analysis Trends */}
        <Typography variant="h6" mt={4} sx={{ color: "#003366", fontWeight: "bold" }}>
        Speech Trends
        </Typography>

        <Tabs value={speechTab} onChange={handleSpeechTabChange} sx={{ mb: 2 }}>
        <Tab value="confidence" label="Speech Confidence" />
        <Tab value="latency" label="Response Latency" />
        <Tab value="onset" label="Speech Onset Delay" />
        <Tab value="echolalia" label="Echolalia Score" />
        </Tabs>

        {(() => {
        const labels = speechAnalysisData.map(d => d.SessionID);

        const dataMap = {
            confidence: {
            label: "Speech Confidence",
            data: speechAnalysisData.map(d => d.Confidence),
            color: "teal",
            description: "Represents how confidently the child spoke. A higher score (closer to 1) indicates clearer speech."
            },
            latency: {
            label: "Response Latency (s)",
            data: speechAnalysisData.map(d => +(d.Latency).toFixed(2)),
            color: "orange",
            description: "Measures the delay before the child responded to a prompt. Lower latency suggests quicker responses."
            },
            onset: {
            label: "Speech Onset Delay (s)",
            data: speechAnalysisData.map(d => +(d.OnsetDelay).toFixed(2)),
            color: "purple",
            description: "Tracks the time taken for the child to begin speaking. Lower onset delay may indicate quicker initiation."
            },
            echolalia: {
            label: "Echolalia Score",
            data: speechAnalysisData.map(d => d.Echolalia),
            color: "gray",
            description: "Indicates the extent of repeated speech. Higher scores may suggest more frequent echolalia behavior."
            },
        };

        const selected = dataMap[speechTab];

        return (
            <Grid container spacing={3} alignItems="center" mt={1}>
            {/* Graph Column */}
            <Grid item xs={12} md={6}>
                <Box sx={{ width: "100%", height: "500px", pr: 2 }}>
                <Line
                    data={{
                    labels,
                    datasets: [
                        {
                        label: selected.label,
                        data: selected.data,
                        borderColor: selected.color,
                        backgroundColor: `${selected.color}80`,
                        fill: false,
                        borderWidth: 2,
                        pointRadius: 3
                        }
                    ]
                    }}
                    options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                        callbacks: {
                            label: function (context) {
                            const value = context.raw as number;
                            const label = context.dataset.label;
                            switch (speechTab) {
                                case "confidence":
                                return `${label}: ${value.toFixed(2)} (0–1 scale — higher means clearer speech)`;
                                case "latency":
                                return `${label}: ${value.toFixed(2)} seconds (delay before responding)`;
                                case "onset":
                                return `${label}: ${value.toFixed(2)} seconds (time to start speaking)`;
                                case "echolalia":
                                return `${label}: ${value.toFixed(2)} (higher = more repeated words)`;
                                default:
                                return `${label}: ${value}`;
                            }
                            }
                        }
                        }
                    },
                    scales: {
                        y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: selected.label
                        }
                        }
                    }
                    }}
                />
                </Box>
            </Grid>

            {/* Button + Explanation Column */}
            <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Button
                    variant="contained"
                    sx={{
                    bgcolor: "#005f99",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 3,
                    py: 1.5,
                    mb: 2,
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(0, 95, 153, 0.3)",
                    ":hover": { bgcolor: "#004d80" }
                    }}
                    onClick={() =>
                    explainGraph(`speech_${speechTab}`, {
                        title: selected.label,
                        description: selected.description,
                        xAxis: labels,
                        yAxis: selected.data
                    })
                    }
                >
                    {explanationLoading[`speech_${speechTab}`]
                    ? "Generating..."
                    : "Explain this graph"}
                </Button>

                {graphExplanations[`speech_${speechTab}`] && (
                    <Fade in={true} timeout={600}>
                    <Card
                        elevation={5}
                        sx={{
                        p: 3,
                        backgroundColor: "#f5faff",
                        borderRadius: "14px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #d2e3f3"
                        }}
                    >
                        <CardContent>
                        <Typography sx={{ fontSize: "1.15rem", color: "#002b5c", lineHeight: 1.85, fontWeight: 500 }}>
                            {graphExplanations[`speech_${speechTab}`]}
                        </Typography>
                        </CardContent>
                    </Card>
                    </Fade>
                )}
                </Box>
            </Grid>
            </Grid>
        );

        })()}

          </>
        )}
        </Box>
      </>
    );
  };

export default ProgressOverview;
