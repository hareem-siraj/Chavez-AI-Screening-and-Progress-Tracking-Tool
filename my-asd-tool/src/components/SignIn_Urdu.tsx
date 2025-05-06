import React, { useState } from "react"; 
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import backgroundImage from "../assets/bg.jpeg";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserId } from "../components/redux/store"; // Import the Redux action

const SignInUrdu: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
   
    try {
      const response = await axios.post("https://chavez-ai-screening-and-progress.onrender.com/api/login", {
        Email,
        Password,
      });

      const { UserID } = response.data; // Access UserID instead of userId
      console.log("Login successful:", UserID);  // Log the UserID

      if (UserID) {
        dispatch(setUserId(UserID));  // Store UserID in Redux
        navigate("/profile-selection-urdu");  // Redirect after storing UserID
      } else {
        setErrorMessage("User ID not found in response.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred during login.");
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
        سائن ان کریں۔
        </Typography>
        <Typography component="p" variant="body1" sx={{ mt: 1, mb: 3 }}>
        شاویز کے ساتھ شروع کرنے کے لیے سائن ان کریں یا نیا اکاؤنٹ بنائیں
        </Typography>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            mb: 2,
            borderRadius: "50px",
            textTransform: "none",
            color: "#0d6efd",
            borderColor: "#0d6efd",
            "&:hover": {
              backgroundColor: "rgba(13, 110, 253, 0.1)",
            },
          }}
        >
          گوگل کے ساتھ سائن ان کریں۔
        </Button>
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
            label="اپنا ای میل درج کریں۔"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
            label="پاس ورڈ درج کریں"
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
              input: { color: "#0d6efd" },
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={
              <Typography variant="body2" sx={{ color: "#0d6efd" }}>
                میری تفصیلات یاد رکھیں
              </Typography>
            }
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
            سائن ان
          </Button>
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <Grid container>
            <Grid item xs>
              <Link
                onClick={() => navigate("/forgot-password-urdu")}
                variant="body2"
                sx={{ color: "#0d6efd", cursor: "pointer" }}
              >
                پاس ورڈ بھول گئے؟
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={() => navigate("/create-account-urdu")}
                variant="body2"
                sx={{ color: "#00b4d8", cursor: "pointer" }}
              >
                اکاؤنٹ نہیں ہے؟ سائن اپ کریں۔
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SignInUrdu;
