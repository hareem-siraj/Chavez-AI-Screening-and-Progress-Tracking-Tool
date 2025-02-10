
import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import backgroundImage from "../assets/bg.jpeg";
import logo from "../assets/logo.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, selectChild } from "../components/redux/store";
import { useNavigate } from 'react-router-dom';

const ProfileSelectionUrdu: React.FC = () => {
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

  const handleSelectChild = (ChildID: number) => {
    dispatch(selectChild(ChildID));
    dispatch(setUserId(userIdFromStore));  
    navigate("/dashboar-urdu");
  };

  const handleAddProfile = () => {
    dispatch(setUserId(userIdFromStore));
    navigate("/create-profile-urdu");
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
        اپنے بچے کا پروفائل منتخب کریں۔
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
          {children.map((Child) => (
            <Grid item key={Child.ChildID}>
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
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{Child.ChildID}</Typography>
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

export default ProfileSelectionUrdu;
