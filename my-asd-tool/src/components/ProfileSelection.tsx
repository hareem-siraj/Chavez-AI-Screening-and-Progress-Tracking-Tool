
import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Avatar} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import backgroundImage from "../assets/bg.jpeg";
import logo from "../assets/logo.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, selectChild } from "../components/redux/store";
import { useNavigate } from 'react-router-dom';
import { setSessionIds } from "./redux/store";
import { Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// Avatar images mapping
import avatar1 from "../assets/avatars/1.png";
import avatar2 from "../assets/avatars/2.png";
import avatar3 from "../assets/avatars/3.png";
import avatar4 from "../assets/avatars/4.png";
import avatar5 from "../assets/avatars/5.png";

const avatars = [
  { id: 1, src: avatar1 },
  { id: 2, src: avatar2 },
  { id: 3, src: avatar3 },
  { id: 4, src: avatar4 },
  { id: 5, src: avatar5 }
];

const ProfileSelection: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const userIdFromStore = useSelector((state: any) => state.UserID);

  useEffect(() => {
    if (userIdFromStore) {
      axios.get(`http://localhost:5001/api/children/${userIdFromStore}`)
        .then((response) => setChildren(response.data))
        .catch((error) => console.error("Error fetching child profiles:", error));
    }
  }, [userIdFromStore]);

  // const handleSelectChild = (ChildID: number) => {
  //   dispatch(selectChild(ChildID));
  //   dispatch(setUserId(userIdFromStore));  
  //   navigate("/dashboard");
  // };

// Replace handleSelectChild in ProfileSelection.tsx with this fixed version:
const handleSelectChild = async (ChildID: number) => {
  dispatch(selectChild(ChildID));
  dispatch(setUserId(userIdFromStore));
  localStorage.setItem("selectedChildId", String(ChildID));

  try {
    const res = await axios.get(`http://localhost:5001/api/allSessionsDate/${ChildID}`);
    const sessions = res.data.sessions;

    if (sessions.length === 0) {
      const newSession = await axios.post("http://localhost:5001/api/start-session", { ChildID });
      const sessionPayload = {
        SessionID: newSession.data.SessionID,
        QuestionnaireID: null,
        GameSessionID: null,
        ReportID: null,
      };
      dispatch(setSessionIds(sessionPayload));
      localStorage.setItem("sessionData", JSON.stringify(sessionPayload));
      return navigate("/dashboard");
    }

    // Sort by CompleteDate descending, undefined last
    sessions.sort((a: any, b: any) => {
      const dateA = a.CompleteDate ? new Date(a.CompleteDate) : null;
      const dateB = b.CompleteDate ? new Date(b.CompleteDate) : null;
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB.getTime() - dateA.getTime();
    });

    const firstIncomplete = sessions.find((s: any) => !s.CompleteDate);
    const mostRecentComplete = sessions.find((s: any) => s.CompleteDate);

    if (firstIncomplete) {
      const sessionPayload = {
        SessionID: firstIncomplete.SessionID,
        QuestionnaireID: null,
        GameSessionID: null,
        ReportID: null,
      };
      dispatch(setSessionIds(sessionPayload));
      localStorage.setItem("sessionData", JSON.stringify(sessionPayload));
      return navigate("/dashboard");
    }

    if (mostRecentComplete) {
      const completeDate = new Date(mostRecentComplete.CompleteDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - completeDate.getTime()) / (1000 * 60 * 60 * 24));

      const sessionPayload = {
        SessionID: mostRecentComplete.SessionID,
        QuestionnaireID: null,
        GameSessionID: null,
        ReportID: null,
      };

      if (diffDays >= 90) {
        // if (diffDays < 1) {
        const proceed = window.confirm("It's been over 90 days since the last session. Start a new session?");

        if (proceed) {
          const newSession = await axios.post("http://localhost:5001/api/start-session", { ChildID });
          const newPayload = {
            SessionID: newSession.data.SessionID,
            QuestionnaireID: null,
            GameSessionID: null,
            ReportID: null,
          };
          dispatch(setSessionIds(newPayload));
          localStorage.setItem("sessionData", JSON.stringify(newPayload));
          return navigate("/dashboard");
        }
      }

      // If user does not want new session or under 180 days, continue with recent complete
      dispatch(setSessionIds(sessionPayload));
      localStorage.setItem("sessionData", JSON.stringify(sessionPayload));
      return navigate("/dashboard");
    }
  } catch (err) {
    console.error("Error during child session check:", err);
  }
};


  const handleAddProfile = () => {
    dispatch(setUserId(userIdFromStore));
    navigate("/create-profile");
  };

  const handleDeleteUser = async () => {
    if (!userIdFromStore) return;
  
    const confirmDelete = window.confirm("Are you sure you want to delete this user and all related data?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:5001/api/delete-user/${userIdFromStore}`);
      alert("User deleted successfully.");
      navigate("/");  // redirect to login/home page after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };
  
  const handleDeleteChild = async (ChildID: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this child profile and all related data?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:5001/api/delete-child/${ChildID}`);
      alert("Child profile deleted.");
      setChildren(prev => prev.filter(child => child.ChildID !== ChildID)); // update UI
    } catch (error) {
      console.error("Error deleting child profile:", error);
      alert("Failed to delete child profile.");
    }
  };
  
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        color: "#000",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box sx={{ position: "absolute", top: "2vh", right: "2vw", width: "15vw", maxWidth: "200px" }}>
        <img src={logo} alt="Logo" style={{ width: "100%" }} />
      </Box>

      <Button
        variant="contained"
        color="error"
        sx={{ position: "absolute", top: "2vh", left: "2vw" }}
        onClick={handleDeleteUser}
      >
        Delete User
      </Button>


      <Container
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "1vw",
          padding: "3vw",
          width: "50vw",
          maxWidth: "700px",
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: "2vh", fontWeight: "bold", color: "#005f99" }}>
          Select Your Child's Profile
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
        {children.map((Child) => (
        <Grid item key={Child.ChildID}>
          <Box sx={{ position: "relative" }}> {/* <-- Added relative wrapper */}
            <Box
              sx={{
                width: "140px",
                height: "100px",
                borderRadius: "12px",
                backgroundColor: "#0077b6",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                ":hover": { backgroundColor: "#005f99", transform: "scale(1.05)" },
              }}
              onClick={() => handleSelectChild(Child.ChildID)}
            >
              <Avatar
                src={Child.Avatar ? avatars.find(a => a.id === Number(Child.Avatar))?.src : ""}
                sx={{ width: 60, height: 60, bgcolor: "#ffffff" }}
              />
              <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
                {Child.Name}
              </Typography>
            </Box>

            <CloseIcon
              onClick={(e) => {
                e.stopPropagation(); // Prevent profile selection
                handleDeleteChild(Child.ChildID);
              }}
              sx={{
                position: "absolute",
                top: "4px",
                right: "4px",
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "2px",
                fontSize: "18px",
                "&:hover": { color: "#ff0000" }
              }}
            />
          </Box>
        </Grid>
      ))}

          
          <Grid item>
            <Box
              sx={{
                width: "140px",
                height: "100px",
                borderRadius: "12px",
                backgroundColor: "#0077b6",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                ":hover": { backgroundColor: "#005f99", transform: "scale(1.05)" },
              }}
              onClick={handleAddProfile}
            >
              <AddCircleIcon fontSize="large" />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileSelection;
