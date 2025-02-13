import React, { useState } from "react";
import styles from "../theme/ProfileSettings.module.css";
import logo from "../assets/logo.png"; // Adjust the path based on your project structure
// import React from "react";
import { Box, Typography, Button} from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider} from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout} from "@mui/icons-material";

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    age: "",
    profileImage: null as File | null,
  });

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age.toString() : "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "dateOfBirth") {
      const age = calculateAge(value);
      setProfile({ ...profile, [name]: value, age });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({ ...profile, profileImage: e.target.files[0] });
    }
  };

  const handleSave = () => {
    alert("Profile saved successfully!");
    // API call or logic to save profile details can be implemented here
  };

  return (
    <div className={styles.container}>
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
              <ListItemButton component={Link} to="/reports">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Reports" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
          </List>

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



      <div className={styles.main}>
        <div className={styles.path}>Pages / Edit Profile</div>
        <h1>Create a profile for each child to track personalized assessments and progress</h1>
        <div className={styles.profileForm}>
          <div className={styles.imageUpload}>
            <div className={styles.imagePlaceholder}>+</div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Age:
            <input type="text" value={profile.age} disabled />
          </label>
          <label>
            Gender:
            <select name="gender" value={profile.gender} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
