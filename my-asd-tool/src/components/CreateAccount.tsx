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

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();

  // States for form fields
  const [userId, setUserId] = useState(""); // New userId field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // To show error messages
  const [success, setSuccess] = useState(""); // To show success messages

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    const newUser = {
      userId, // Include userId in the payload
      name,
      email,
      password,
    };

    try {
      // Send POST request to backend
      const response = await fetch("http://localhost:5001/api/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Account created successfully!");
        setError(""); // Clear any previous errors
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        setSuccess(""); // Clear success message on error
      }
    } catch (error) {
      setError("Error creating account");
      setSuccess(""); // Clear success message on error
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
        alignItems: "flex-start",
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
          zIndex: 1,
        }}
      >
        <img src={logo} alt="Chavez Logo" style={{ width: "200px" }} />
      </Box>

      {/* Create Account Container aligned to the left and vertically centered */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 8,
          padding: 4,
          marginLeft: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#0d6efd",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: "#0d6efd", fontWeight: "bold", mb: 1 }}>
          Create an account
        </Typography>
        <Typography component="p" variant="body1" sx={{ mt: 1, mb: 3 }}>
          Create an account to get started with Chavez
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {success && <Typography color="primary" sx={{ mb: 2 }}>{success}</Typography>}
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
            id="userId"
            label="Enter your user ID"
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            autoComplete="off"
            autoFocus
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
              input: { color: "#0d6efd" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Enter your name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
              input: { color: "#0d6efd" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter your email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
              input: { color: "#0d6efd" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Create a password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
              input: { color: "#0d6efd" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm password"
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
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
              background: "linear-gradient(180deg, #00b4d8 0%, #0077b6 100%)",
              color: "#ffffff",
              textTransform: "none",
            }}
          >
            SIGN UP
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
      {/* <Box
        sx={{
          width: "100%",
          height: "50",
          padding: 2,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          color: "#d7d7d7",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          bottom: 0,
        }}
      >
        <Typography variant="body2">Company</Typography>
        <Typography variant="body2">About Us</Typography>
        <Typography variant="body2">Team</Typography>
        <Typography variant="body2">Solutions</Typography>
        <Typography variant="body2">Security</Typography>
      </Box> */}
    </Box>
  );
};

export default CreateAccount;
