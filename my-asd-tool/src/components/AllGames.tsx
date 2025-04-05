import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Person, QuestionAnswer, Logout} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { setSessionIds } from "./redux/store";
import { useDispatch } from "react-redux";

const GameScreen: React.FC = () => {
  // const SessionID = useSelector((state: any) => state.sessionData?.SessionID);

  const SessionID = useSelector((state: any) => state.sessionData?.SessionID) || sessionStorage.getItem("sessionID");

  console.log("Session ID:", SessionID); // Debugging: Check if the value is assigned correctly
  

  console.log("SessionID:", SessionID);
  const games = [
    { name: "POP THE BALLOON", route: "/balloon" },
    { name: "FOLLOW THE FISH", route: "/follow" },
    // { name: "FLASH CARDS", route: "/flashcard" },
    { name: "HUMAN VS OBJECT", route: "/human" },
    { name: "EMOTION PUZZLE", route: "/puzzle" },
  ];

  const dispatch = useDispatch();


  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear(); // Clear stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

  return (
    <Box display="flex" minHeight="100vh">
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
      <Box
        flexGrow={1}
        p={4}
        sx={{
          background: "linear-gradient(to right, #e6f4ff, #f5faff)",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#003366",
            textAlign: "center",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Game Selection
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {games.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="#ffffff"
                p={4}
                borderRadius="16px"
                boxShadow={3}
                sx={{
                  height: "160px",
                  cursor: "pointer",
                  transition: "0.3s",
                  textDecoration: "none",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#e3f2fd",
                    transform: "scale(1.05)",
                  },
                }}
                component={Link}
                to={`${game.route}?sessionID=${SessionID}`}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#003366",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {game.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GameScreen;
