import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("https://chavez-ai-screening-and-progress.onrender.com/api/reset-password", {
        token,
        newPassword,
      });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (err) {
      setError("Reset failed. The link may have expired.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "#e0f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm" sx={{ bgcolor: "#ffffff", borderRadius: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Reset Your Password
        </Typography>
        {message && <Typography color="green">{message}</Typography>}
        {error && <Typography color="red">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Reset Password
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
