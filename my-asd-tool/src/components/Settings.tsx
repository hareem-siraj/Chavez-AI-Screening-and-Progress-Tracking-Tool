import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useSelector } from "react-redux";
import styles from "../theme/Questions.module.css";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider} from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout} from "@mui/icons-material";
import { Box, Typography} from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { setSessionIds } from "./redux/store";
import { useDispatch } from "react-redux";


const Setting: React.FC = () => {
  // Get the UserID from the Redux store
  const UserID = useSelector((state: any) => state.UserID);

  const dispatch = useDispatch();


  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear(); // Clear stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F9FF">
      
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

      <Box flexGrow={1} p={4} bgcolor="#e6f4ff">
        <Box className={styles.main}>
          <div className={styles.path}>Settings</div>
          {/* Display greeting */}
          <div className={styles.greeting}>
            {UserID ? `${UserID}` : "Hello Guest"}
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Setting;
