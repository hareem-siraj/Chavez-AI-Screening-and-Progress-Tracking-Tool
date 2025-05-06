import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CircularProgress, Avatar, Button } from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const childIdFromStore = useSelector((state: any) => state.ChildID); // Getting ChildID from Redux store
  const [childProfile, setChildProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://chavez-ai-screening-and-progress.onrender.com/api/get-child-profile?ChildID=${childIdFromStore}`);
        setChildProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (childIdFromStore) {
      fetchProfile();
    }
  }, [childIdFromStore]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
                <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }} />
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
                <ListItemText primary="Reports" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/sign-in">
                <ListItemIcon><Logout sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} p={4} bgcolor="#e6f4ff">
        <Typography variant="h4" sx={{ color: "#003366", mb: 3 }}>
          Child Profile
        </Typography>

        {childProfile ? (
          <Box sx={{ backgroundColor: "#ffffff", p: 4, borderRadius: 2, maxWidth: 500 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar
                src={childProfile.ProfileImage ? `https://chavez-ai-screening-and-progress.onrender.com/uploads/${childProfile.ProfileImage}` : ""}
                alt={childProfile.Name}
                sx={{ width: 100, height: 100 }}
              />
              <Typography variant="h5" sx={{ mt: 2, color: "#003366" }}>{childProfile.Name}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1"><strong>Child ID:</strong> {childProfile.ChildID}</Typography>
            <Typography variant="body1"><strong>Date of Birth:</strong> {childProfile.DOB}</Typography>
            <Typography variant="body1"><strong>Age:</strong> {childProfile.Age} years</Typography>
            <Typography variant="body1"><strong>Gender:</strong> {childProfile.Gender}</Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#003366",
                color: "#ffffff",
                "&:hover": { bgcolor: "#0056b3" },
              }}
              component={Link}
              to="/profile-selection"
            >
              Back to Profile Selection
            </Button>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ color: "red" }}>
            No profile found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Profile;

