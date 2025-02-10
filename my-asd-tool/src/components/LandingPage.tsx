import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import logo from "../assets/logo.png"; // Logo image
import heroImage from "../assets/heroImage.jpeg"; // Replace with the actual image file name
import { useNavigate, useLocation } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  // Check if the current page is Urdu
  const isUrdu = location.pathname === "/urdu";

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: 4 }}>
      {/* Top Navigation Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "16px", backgroundColor: "#0077b6", color: "white" }}>
        {/* Logo */}
        <Box sx={{ textAlign: "left" }}>
          <img src={logo} alt="Chavez Logo" style={{ width: "150px" }} />
        </Box>

        {/* Language Toggle Button */}
        <Button
          onClick={() => navigate(isUrdu ? "/" : "/urdu")}
          variant="contained"
          sx={{
            backgroundColor: "#ffffff",
            color: "#0077b6",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          {isUrdu ? "English" : "اردو"}
        </Button>
      </Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#0077b6",
          color: "#ffffff",
          padding: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Centered Logo */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img src={logo} alt="Chavez Logo" style={{ width: "200px" }} />
        </Box>

        {/* Sign Up Button */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Button
            onClick={() => navigate("/sign-in")}
            variant="contained"
            sx={{
              backgroundColor: "#ffffff",
              color: "#0077b6",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            Sign in now
          </Button>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 4 }}>
          The <span style={{ color: "#ffe66d" }}>Key</span> to Early Autism Diagnosis and Progress Tracking
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, maxWidth: "600px", mx: "auto" }}>
          Innovative, AI-driven assessments and interactive tools to support every step of your child’s developmental progress
        </Typography>

        {/* Hero Image */}
        <Box
          component="img"
          src={heroImage}
          alt="Hero"
          sx={{
            borderRadius: "50%",
            width: "300px",
            height: "300px",
            mt: 4,
            border: "4px solid #ffffff",
          }}
        />
      </Box>

      {/* Changing how autism is diagnosed Section */}
      <Container sx={{ mt: 6 }}>
        <Box
          sx={{
            backgroundColor: "#90e0ef",
            borderRadius: 2,
            padding: 3,
            textAlign: "center",
            color: "#000000",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Changing how autism is diagnosed
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            When you have a child on the autism spectrum, the challenges and frustrations can be overwhelming.
            You want to do everything possible to help your child reach their full potential. But navigating traditional
            assessments and resources can take months, even years—time that could be better spent making real progress.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            That’s where Chavez comes in. Our AI-powered, gamified tools bring real-time insights to caregivers, turning
            understanding into action and helping every family support their child’s growth today.
          </Typography>
        </Box>
      </Container>

      {/* Information Cards Section */}
      <Container sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Card 1 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#f94144",
                color: "#ffffff",
                borderRadius: 2,
                padding: 3,
                textAlign: "center",
                minHeight: "300px", // Ensure all cards are the same height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Rapid Pre-Diagnosis Screening
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Gain early insights into your child’s developmental profile with our fast and reliable ASD Questionnaires.
                These expert-designed questionnaires provide a comprehensive look at key behaviors associated with ASD.
              </Typography>
            </Box>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#ffbe0b",
                color: "#000000",
                borderRadius: 2,
                padding: 3,
                textAlign: "center",
                minHeight: "300px", // Ensure all cards are the same height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Gamified Assessments
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Engage your child in meaningful developmental activities through our Gamified Assessments.
                These assessments transform testing into play, capturing valuable data on your child’s abilities.
              </Typography>
            </Box>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#43aa8b",
                color: "#ffffff",
                borderRadius: 2,
                padding: 3,
                textAlign: "center",
                minHeight: "300px", // Ensure all cards are the same height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Progress Tracking & Custom Reports
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Track your child’s development with our Progress Tracking and Report tool. Generate detailed reports anytime
                to monitor progress and share valuable data with therapists or educators.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Button
          onClick={() => navigate("/create-account")}
          variant="contained"
          sx={{
            backgroundColor: "#0077b6",
            color: "#ffffff",
            textTransform: "none",
            padding: "12px 24px",
            "&:hover": {
              backgroundColor: "#005f8a",
            },
          }}
        >
          Get Started Now
        </Button>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          padding: 3,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          color: "#888888",
          mt: 6,
        }}
      >
        <Typography variant="body2">Company</Typography>
        <Typography variant="body2">About Us</Typography>
        <Typography variant="body2">Team</Typography>
        <Typography variant="body2">Solutions</Typography>
        <Typography variant="body2">Security</Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
