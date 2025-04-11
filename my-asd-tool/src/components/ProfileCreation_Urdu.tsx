import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import {AppBar, Toolbar, IconButton } from "@mui/material";
import logoImage from "../assets/logo.png";

const avatars = [
  { id: 1, src: avatar1 },
  { id: 2, src: avatar2 },
  { id: 3, src: avatar3 },
  { id: 4, src: avatar4 },
  { id: 5, src: avatar5 }
];

const ProfileCreationUrdu: React.FC = () => {
  const userIdFromStore = useSelector((state: any) => state.UserID);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const response = await axios.post("http://localhost:5001/api/start-session", {
        ChildID: childID,
      });
  
      const { SessionID } = response.data;
      navigate("/profile-selection-urdu");
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/sign-in-urdu";
  };

  const handleProfileSelection = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/profile-selection-urdu");
  };
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="static" sx={{ bgcolor: "#003366" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box component="img" src={logoImage} alt="Chavez Logo" sx={{ height: 60, py: 1 }} />
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={handleProfileSelection}><Person /></IconButton>
            <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

    {/* Sidebar */}
    {/* //  <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
    //     <Box>
    //       <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
    //         Chavez
    //       </Typography>
    //       <Divider />
    //       <List>
    //         <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/dashboard-urdu">
    //             <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
    //             <ListItemText primary="ڈیش بورڈ" primaryTypographyProps={{ sx: { color: "#003366" } }} />
    //           </ListItemButton>
    //         </ListItem>
    //         <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/profile-selection-urdu">
    //             <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
    //             <ListItemText primary="پروفائل"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
    //           </ListItemButton>
    //         </ListItem>
    //         <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/questionnaire-urdu">
    //             <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
    //             <ListItemText primary="سوالنامہ" primaryTypographyProps={{ sx: { color: "#003366" } }} />
    //           </ListItemButton>
    //         </ListItem>
    //         <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/game-selection">
    //             <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
    //             <ListItemText primary="گیمیفائیڈ اسیسمنٹس"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
    //           </ListItemButton>
    //         </ListItem>
    //         <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/audio-analysis">
    //             <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
    //             <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }}/>
    //           </ListItemButton>
    //         </ListItem>
    //         <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/reports-urdu">
    //             <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
    //             <ListItemText primary="رپورٹس" sx={{ color: "#003366" }}/>
    //           </ListItemButton>
    //         </ListItem>
    //       </List>

    //       <Divider />
    //         <List>
    //           <ListItem disablePadding>
    //           <ListItemButton component={Link} to="/sign-in-urdu">
    //             <ListItemIcon>
    //               <Logout sx={{ color: "#003366" }} />
    //             </ListItemIcon>
    //             <ListItemText primary="لاگ آؤٹ"  primaryTypographyProps={{ sx: { color: "#003366" } }} />
    //             </ListItemButton>
    //           </ListItem>
    //         </List>
            
    //     </Box>
    //   </Box> */}

      {/* Main Content */}


<Box flexGrow={1} p={4} bgcolor="#e6f4ff">
<Typography variant="h4" sx={{ color: "#003366", mb: 3, textAlign: "center", fontWeight: "bold" }}>
پروفائل بنائیں   
      </Typography>
  <Box sx={{ backgroundColor: "#ffffff", p: 4, borderRadius: 2 }}>
  <Grid container spacing={2}>
  <Grid item xs={12}>
        <TextField
          fullWidth
          label=" ID بچے کی"
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
          label="بچے کا نام"
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
          label="تاریخ پیدائش"
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
            {/* <MenuItem value="Male" sx={{ color: "#003366" }}>Male</MenuItem>
            <MenuItem value="Female" sx={{ color: "#003366" }}>Female</MenuItem>
            <MenuItem value="Other" sx={{ color: "#003366" }}>Other</MenuItem> */}
            <MenuItem value="Male" sx={{ color: "#003366" }}>لڑکا</MenuItem>
            <MenuItem value="Female" sx={{ color: "#003366" }}>لڑکی</MenuItem>
            <MenuItem value="Other" sx={{ color: "#003366" }}>دوسرے</MenuItem>
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
              {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "میری پروفائل بنادیں"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Box>
  );
};

export default ProfileCreationUrdu;
