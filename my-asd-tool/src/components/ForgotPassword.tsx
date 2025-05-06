import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import backgroundImage from "../assets/bg.jpeg"; // Full background image
import logo from "../assets/logo.png"; // Logo image
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    console.log("Email being sent:", email); // Log the email to verify it's being passed correctly

    try {
      const response = await axios.post(
        "https://chavez-ai-screening-and-progress.onrender.com/api/forgot-password", // Backend API endpoint
        { email }
      );
      setMessage("Password reset link sent to your email!");
    } catch (error) {
      console.error("Error sending reset link:", error); // Log the error for debugging
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`, // Set full background image here
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center content vertically
        alignItems: "flex-start", // Align content to the left horizontally
        position: "relative",
      }}
    >
      <CssBaseline />
      {/* Logo positioned in the top right of the page */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1, // Ensure logo is on top of other elements
        }}
      >
        <img
          src={logo}
          alt="Chavez Logo"
          style={{ width: "200px" }} // Adjust logo size as needed
        />
      </Box>

      {/* Forgot Password Container aligned to the left and vertically centered */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent background for the form
          borderRadius: 8,
          padding: 4,
          marginLeft: 4, // Align to the left
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#0d6efd",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: "#0d6efd", fontWeight: "bold", mb: 1 }}>
          Forgot Password
        </Typography>
        <Typography component="p" variant="body1" sx={{ mt: 1, mb: 3 }}>
          Enter your email address to receive a password reset link
        </Typography>

        {message && <Typography sx={{ color: "green", marginBottom: 2 }}>{message}</Typography>}
        {error && <Typography sx={{ color: "red", marginBottom: 2 }}>{error}</Typography>}

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter your email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
              input: { color: "#0d6efd" },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              background: "linear-gradient(180deg, #00b4d8 0%, #0077b6 100%)", // Blue gradient
              color: "#ffffff",
              textTransform: "none",
            }}
          >
            Send Reset Link
          </Button>
          <Button
            onClick={() => navigate("/sign-in")}
            fullWidth
            variant="text"
            sx={{
              mt: 1,
              color: "#0d6efd",
              textTransform: "none",
            }}
          >
            Back to Sign In
          </Button>
        </Box>
      </Container>

      {/* Footer Links at the bottom of the page */}
      <Box
        sx={{
          width: "100%",
          padding: 2,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          color: "#d7d7d7",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional background for visibility
          position: "absolute",
          bottom: 0,
        }}
      >
        {/* <Typography variant="body2">Company</Typography>
        <Typography variant="body2">About Us</Typography>
        <Typography variant="body2">Team</Typography>
        <Typography variant="body2">Solutions</Typography>
        <Typography variant="body2">Security</Typography> */}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
