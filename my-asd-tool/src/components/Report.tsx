import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useSelector } from "react-redux";
import styles from "../theme/Questions.module.css";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider} from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout} from "@mui/icons-material";
import { Box, Typography} from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";

const Report: React.FC = () => {
  // Get the UserID from the Redux store
  const UserID = useSelector((state: any) => state.UserID);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      {/* Sidebar */}
      <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column" justifyContent="space-between">
        <Box>
          <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
            Chavez
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                  <Home sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile-selection">
                <ListItemIcon>
                  <Person sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Profile" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire">
                <ListItemIcon>
                  <QuestionAnswer sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Questionnaire" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon>
                  <Assessment sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Gamified Assessments" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/settings">
                <ListItemIcon>
                  <Settings sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Settings" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/sign-in">
                <ListItemIcon>
                  <Logout sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>

      <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
        <Box className={styles.main}>
          <div className={styles.path}>Report</div>
          {/* Display greeting */}
          <div className={styles.greeting}>
            {UserID ? `${UserID}` : "Hello Guest"}
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Report;
