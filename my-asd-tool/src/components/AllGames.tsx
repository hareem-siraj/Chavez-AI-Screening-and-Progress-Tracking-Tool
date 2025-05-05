import React, { useState, useEffect } from "react";
import { Box, Typography, AppBar, Toolbar, IconButton, Button, CircularProgress, GlobalStyles } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Home, Person, Logout, Lock } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setSessionIds } from "./redux/store";
import logoImage from "../assets/logo.png";
import balloon from "../assets/balloon.png";
import fish from "../assets/fish.png";
import emotion from "../assets/emotion.png";
import hvo from "../assets/hvo.png";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { persistor } from './redux/store'; 

const GameScreen: React.FC = () => {
  const SessionID = useSelector((state: any) => state.sessionData?.SessionID) || sessionStorage.getItem("sessionID");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [storedStatus, setStoredStatus] = useState({
  //   FishStatus: false,
  //   HumanObjStatus: false,
  //   EmotionStatus: false,
  //   SpeechStatus: false,
  //   BalloonStatus: false,
  //   QuesStatus: false,
  // });
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
    fetchAndStoreSessionStatus(SessionID);
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionStatus = async () => {
      if (SessionID) {
        await fetchAndStoreSessionStatus(SessionID); // Wait until status is saved
        getStoredSessionStatus(); // Then load stored status
        setLoading(false); // Now everything is ready
      }
    };
  
    loadSessionStatus();
  }, [SessionID]);


  const games = [
    { name: "POP THE BALLOON", route: "/balloon", image: balloon, key: "BalloonStatus", description: "Tracks reaction time and motor skills." },
    { name: "FOLLOW THE FISH", route: "/follow", image: fish, key: "FishStatus", description: "Tracks visual tracking and attention." },
    { name: "HUMAN VS OBJECT", route: "/human", image: hvo, key: "HumanObjStatus", description: "Tracks preference between humans and objects." },
    { name: "EMOTION PUZZLE", route: "/puzzle", image: emotion, key: "EmotionStatus", description: "Tracks emotional recognition and motor skills." },
  ];

  const storedStatus = getStoredSessionStatus();

  const allGamesCompleted = 
    storedStatus.FishStatus && 
    storedStatus.HumanObjStatus && 
    storedStatus.EmotionStatus && 
    storedStatus.BalloonStatus;


  const handleLogout = async () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear();
    sessionStorage.clear();
    await persistor.purge(); // ✅ Clear persisted Redux state
    window.location.href = "/sign-in";
  };

  const handleProfileSelection = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear();
    sessionStorage.clear();
    navigate("/profile-selection");
  };


  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <Box className={className} onClick={onClick} sx={{ ...style, display: "flex !important", alignItems: "center", justifyContent: "center", backgroundColor: "#003366", borderRadius: "50%", width: 40, height: 40, left: -50, top: "45%", zIndex: 2, cursor: "pointer", "&:hover": { backgroundColor: "#00509e" } }}>
        <Typography color="white" fontSize={24}>{'<'}</Typography>
      </Box>
    );
  };

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <Box className={className} onClick={onClick} sx={{ ...style, display: "flex !important", alignItems: "center", justifyContent: "center", backgroundColor: "#003366", borderRadius: "50%", width: 40, height: 40, right: -50, top: "45%", zIndex: 2, cursor: "pointer", "&:hover": { backgroundColor: "#00509e" } }}>
        <Typography color="white" fontSize={24}>{'>'}</Typography>
      </Box>
    );
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    swipe: true,
    touchMove: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5faff">
        <CircularProgress color="primary" size={80} />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <GlobalStyles styles={{
        '.slick-slider, .slick-list, .slick-track': {
          overflow: 'visible !important',
        }
      }} />

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

      <Box flexGrow={1} p={4} bgcolor="#f5faff" sx={{ overflow: "visible" }}>
        <Typography variant="h4" color="#003366" textAlign="center" fontWeight="bold" mb={6}>Choose a Game</Typography>

        <Box sx={{ overflow: "visible" }}>
          <Slider {...settings}>
            {games.map((game, index) => {
              const isCompleted = storedStatus[game.key as keyof typeof storedStatus];
              return (
                <Box key={index} position="relative" display="flex" flexDirection="column" alignItems="center" bgcolor="#ffffff" borderRadius="20px" p={3} mx={2} boxShadow={4} sx={{ height: "600px", width: "700px", overflow: "hidden", filter: activeSlide === index ? "none" : "blur(3px)", transition: "filter 0.4s, transform 0.4s, box-shadow 0.4s", textDecoration: "none", color: "inherit", "&:hover": { boxShadow: 8, transform: "scale(1.05)", ".playButton": { opacity: 1, transform: "translate(-50%, -10%)" } } }}>
                  <Box component="img" src={game.image} alt={game.name} sx={{ height: 400, width: "100%", objectFit: "cover", borderRadius: "12px", mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" textAlign="center" mb={1} sx={{ color: "#003366" }}>{game.name}</Typography>
                  <Typography variant="body2" textAlign="center" sx={{ color: "#003366", mb: 2 }}>{game.description}</Typography>

                  <Button
                    className="playButton"
                    variant="contained"
                    color="primary"
                    disabled={isCompleted}
                    component={isCompleted ? "button" : Link}
                    to={isCompleted ? undefined : `${game.route}?sessionID=${SessionID}`}
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      opacity: 0,
                      transition: "opacity 0.4s, transform 0.4s",
                      ...(isCompleted && {
                        bgcolor: "rgba(0, 0, 0, 0.1)",
                        color: "rgba(0, 0, 0, 0.5)",
                        cursor: "not-allowed",
                      })
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 1 }}>Play Game</span>
                    {isCompleted && (
                      <Lock
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: 10,
                          transform: "translateY(-50%)",
                          fontSize: 18,
                          opacity: 0.7,
                          zIndex: 2
                        }}
                      />
                    )}
                  </Button>
                </Box>
              );
            })}
          </Slider>
        </Box>

        {allGamesCompleted && (    
        <Box display="flex" justifyContent="center" gap={2} mt={6}>
          <Button variant="contained" color="primary" onClick={() => navigate("/audio-analysis")}>Proceed to Speech Analysis</Button>
          <Button variant="outlined" color="primary" onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
        </Box>
        )}

      </Box>
    </Box>
  );
};

export default GameScreen;
