import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import {useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, Logout} from "@mui/icons-material";
import { Link } from "react-router-dom";
import avatar1 from "../assets/avatars/1.png";
import avatar2 from "../assets/avatars/2.png";
import avatar3 from "../assets/avatars/3.png";
import avatar4 from "../assets/avatars/4.png";
import avatar5 from "../assets/avatars/5.png";

const avatars = [
  { id: 1, src: avatar1 },
  { id: 2, src: avatar2 },
  { id: 3, src: avatar3 },
  { id: 4, src: avatar4 },
  { id: 5, src: avatar5 }
];


const ProfileCreation: React.FC = () => {
  const userIdFromStore = useSelector((state: any) => state.UserID);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const [childName, setChildName] = useState<string>("");
  const [childDOB, setChildDOB] = useState<string>("");
  const [childGender, setChildGender] = useState<string>("Female");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [childID, setChildID] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [loading, setLoading] = useState(false); // Loading indicator


  // Calculate Age
  useEffect(() => {
    if (childDOB) {
      const birthDate = new Date(childDOB);
      const currentDate = new Date();
      const calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();
      const month = currentDate.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        setAge(calculatedAge - 1);
      } else {
      setAge(calculatedAge);
    }
  }
  }, [childDOB]);

  const handleCreateProfile = async () => {
    if (!userIdFromStore) {
      console.error("UserID is not set!");
      return;
    }

    const profileData = {
      ChildID: childID,
      Name: childName,
      DOB: childDOB,
      Age: age,
      Gender: childGender,
      UserID: userIdFromStore,
      Avatar: selectedAvatar, //store avatar id
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:5001/api/save-child-profile", profileData);
      navigate("/profile-selection");
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
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

      {/* Main Content */}
{/* <Box flexGrow={1} p={4} bgcolor="#e6f4ff">
  <Typography variant="h4" sx={{ color: "#003366", mb: 3 }}>
    Create a Profile
  </Typography>

  <Box sx={{ backgroundColor: "#ffffff", p: 4, borderRadius: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Child's ID"
          variant="outlined"
          value={childID}
          onChange={(e) => setChildID(e.target.value)}
          sx={{
            "& .MuiInputBase-input": { color: "#003366" }, // Text color inside input
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" }, // Border color
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" }, // Hover effect
            "& .MuiInputLabel-root": { color: "#003366" }, // Label color
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Child's Name"
          variant="outlined"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          sx={{
            "& .MuiInputBase-input": { color: "#003366" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" },
            "& .MuiInputLabel-root": { color: "#003366" },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          variant="outlined"
          value={childDOB}
          onChange={(e) => setChildDOB(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiInputBase-input": { color: "#003366" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" },
            "& .MuiInputLabel-root": { color: "#003366" },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#003366" }}>Gender</InputLabel>
          <Select
            value={childGender}
            onChange={(e) => setChildGender(e.target.value)}
            sx={{
              color: "#003366", 
              "& .MuiSelect-icon": { color: "#003366" }, // Dropdown arrow color
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" },
              "& .MuiSelect-root": { color: "#003366" },
            }}
          >
            <MenuItem value="Male" sx={{ color: "#003366" }}>Male</MenuItem>
            <MenuItem value="Female" sx={{ color: "#003366" }}>Female</MenuItem>
            <MenuItem value="Other" sx={{ color: "#003366" }}>Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ color: "#003366" }}>Age: {age} years</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: "#003366" }}>Upload Profile Image:</Typography>
        <input type="file" onChange={(e) => setProfileImage(e.target.files ? e.target.files[0] : null)} />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#003366",
            color: "#ffffff",
            "&:hover": { bgcolor: "#0056b3" },
          }}
          onClick={handleCreateProfile}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Create Profile"}
        </Button>
      </Grid>
    </Grid>
  </Box>
</Box> */

<Box flexGrow={1} p={4} bgcolor="#e6f4ff">
<Typography variant="h4" sx={{ color: "#003366", mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Create a Profile
      </Typography>
  <Box sx={{ backgroundColor: "#ffffff", p: 4, borderRadius: 2 }}>
  <Grid container spacing={2}>
  <Grid item xs={12}>
        <TextField
          fullWidth
          label="Child's ID"
          variant="outlined"
          value={childID}
          onChange={(e) => setChildID(e.target.value)}
          sx={{
            "& .MuiInputBase-input": { color: "#003366" }, // Text color inside input
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" }, // Border color
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" }, // Hover effect
            "& .MuiInputLabel-root": { color: "#003366" }, // Label color
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Child's Name"
          variant="outlined"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          sx={{
            "& .MuiInputBase-input": { color: "#003366" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" },
            "& .MuiInputLabel-root": { color: "#003366" },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          variant="outlined"
          value={childDOB}
          onChange={(e) => setChildDOB(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiInputBase-input": { color: "#003366" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" },
            "& .MuiInputLabel-root": { color: "#003366" },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#003366" }}>Gender</InputLabel>
          <Select
            value={childGender}
            onChange={(e) => setChildGender(e.target.value)}
            sx={{
              color: "#003366", 
              "& .MuiSelect-icon": { color: "#003366" }, // Dropdown arrow color
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#003366" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0056b3" },
              "& .MuiSelect-root": { color: "#003366" },
            }}
          >
            <MenuItem value="Male" sx={{ color: "#003366" }}>Male</MenuItem>
            <MenuItem value="Female" sx={{ color: "#003366" }}>Female</MenuItem>
            <MenuItem value="Other" sx={{ color: "#003366" }}>Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ color: "#003366" }}>Age: {age} years</Typography>
      </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: "#003366" }}>Select Avatar:</Typography>
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              {avatars.map((avatar) => (
                <img
                  key={avatar.id}
                  src={avatar.src}
                  alt={`Avatar ${avatar.id}`}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  style={{
                    width: 100,
                    height: 100,
                    cursor: "pointer",
                    border: selectedAvatar === avatar.id ? "3px solid #003366" : "none",
                    borderRadius: "50%",
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth sx={{ bgcolor: "#003366", color: "#ffffff" }} onClick={handleCreateProfile} disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Create Profile"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>}
    </Box>
  );
};

export default ProfileCreation;
