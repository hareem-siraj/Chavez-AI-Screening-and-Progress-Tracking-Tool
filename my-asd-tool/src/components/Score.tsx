import React from "react";
import { Box, Typography, Button} from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider} from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout} from "@mui/icons-material";
import { setSessionIds } from "./redux/store";
import { useDispatch } from "react-redux";

const FinalScore: React.FC = () => {
  // Get Redux state for session and score data
  const sessionData = useSelector((state: any) => state.sessionData);
  const finalScore = useSelector((state: any) => state.finalScore); // Add `finalScore` to Redux state management

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear(); // Clear stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      {/* Sidebar */}
     <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
        <Box>
          <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
            Chavez
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile-selection">
                <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Profile" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire">
                <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/audio-analysis">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Reports" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}> {/* Call handleLogout on click */}
                  <ListItemIcon>
                    <Logout sx={{ color: "#003366" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} p={4} bgcolor="#e6f4ff">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h4" sx={{ color: "#003366" }}>
            Final Score
          </Typography>
        </Box>

        <Box mt={4} bgcolor="#ffffff" p={3} borderRadius="8px" textAlign="center">
          {sessionData && finalScore !== null ? (
            <>
              <Typography
                variant="h5"
                sx={{ color: "#003366", fontWeight: "bold" }}
              >
                Your Score: {finalScore} / 20
              </Typography>
              <Typography
                mt={2}
                sx={{ color: "#003366", opacity: 0.8 }}
              >
                Congratulations! You've completed the questionnaire.
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#003366" }}>
              No final score available.
            </Typography>
          )}
          <Box mt={3}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                bgcolor: "#003366",
                color: "#ffffff",
                mb: 2,
              }}
              component={Link}
              to="/dashboard"
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                textTransform: "none",
                borderColor: "#003366",
                color: "#003366",
              }}
              component={Link}
              to="/reports"
            >
              View Reports
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalScore;


