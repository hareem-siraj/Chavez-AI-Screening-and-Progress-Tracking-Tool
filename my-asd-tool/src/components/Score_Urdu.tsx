import React from "react";
import { Box, Typography, Button} from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider} from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout} from "@mui/icons-material";

const FinalScoreUrdu: React.FC = () => {
  // Get Redux state for session and score data
  const sessionData = useSelector((state: any) => state.sessionData);
  const finalScore = useSelector((state: any) => state.finalScore); // Add `finalScore` to Redux state management


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
              <ListItemButton component={Link} to="/dashboard-urdu">
                <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="ڈیش بورڈ" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile-selection-urdu">
                <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="پروفائل"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire-urdu">
                <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="سوالنامہ" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="گیمیفائیڈ اسیسمنٹس"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports-urdu">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="رپورٹس" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
            <List>
              <ListItem disablePadding>
              <ListItemButton component={Link} to="/sign-in-urdu">
                <ListItemIcon>
                  <Logout sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="لاگ آؤٹ"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h4" sx={{ color: "#003366" }}>
          فائنل سکور
          </Typography>
        </Box>

        <Box mt={4} bgcolor="#ffffff" p={3} borderRadius="8px" textAlign="center">
          {sessionData && finalScore !== null ? (
            <>
              <Typography
                variant="h5"
                sx={{ color: "#003366", fontWeight: "bold" }}
              >
                Your Score: {finalScore} / 5
              </Typography>
              <Typography
                mt={2}
                sx={{ color: "#003366", opacity: 0.8 }}
              >
                مبارک ہو! آپ نے سوالنامہ مکمل کر لیا ہے۔
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#003366" }}>
              کوئی حتمی اسکور دستیاب نہیں ہے۔
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
              ڈیش بورڈ پر واپس جائیں۔
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
              رپورٹس دیکھیں
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalScoreUrdu;


