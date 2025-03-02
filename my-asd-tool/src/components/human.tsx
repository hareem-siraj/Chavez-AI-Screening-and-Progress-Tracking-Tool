// "use client";

// import React, { useEffect } from "react";
// import styles from "../theme/Questions.module.css";
// // import logo from "../assets/logo.png"; // Adjust the path based on your project structure
// import { Box, Typography, } from "@mui/material";
// import { Home, Assessment } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
// import { Person, QuestionAnswer, Settings, Logout, HelpOutline } from "@mui/icons-material";

// const Human: React.FC = () => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "/Build/unityWebGL.loader.js"; // Fixed the path
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
//       {/* Sidebar */}
//      <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
//         <Box>
//           <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
//             Chavez
//           </Typography>
//           <Divider />
//           <List>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/dashboard">
//                 <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/profile-selection">
//                 <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Profile" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/questionnaire">
//                 <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/game-selection">
//                 <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }}/>
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/audio-analysis">
//                 <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }}/>
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to="/reports">
//                 <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
//                 <ListItemText primary="Reports" sx={{ color: "#003366" }}/>
//               </ListItemButton>
//             </ListItem>
//           </List>

//           <Divider />
//             <List>
//               <ListItem disablePadding>
//                 <ListItemButton component={Link} to="/sign-in">
//                   <ListItemIcon>
//                     <Logout sx={{ color: "#003366" }} />
//                   </ListItemIcon>
//                   <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
//                 </ListItemButton>
//               </ListItem>
//             </List>
            
//         </Box>
//       </Box>

//       <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
//         <Box className={styles.main}>
//           <div className={styles.path}>Gamified Assesments</div>
//           <div>
//             <iframe
//               src="Game4\index.html" 
//               width="100%"
//               height="100%"
//               style={{
//                 border: "none",
//                 position: "absolute",
//                 top: 100,
//                 left: 200,
//                 transform: "scale(0.8)", // Scales the iframe down
//                 transformOrigin: "top left", // Ensures scaling happens relative to the top-left corner
//                 right: 0,
//                 bottom: 0,
//               }}
//               allowFullScreen
//             ></iframe>
//           </div>
//           <div className={styles.comingSoon}>
//             {/* <h1>Coming Soon</h1> */}
//           </div>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Human;



"use client";

import React, { useEffect, useRef } from "react";
import styles from "../theme/Questions.module.css";
// import logo from "../assets/logo.png"; // Adjust the path based on your project structure
import { Box, Typography, } from "@mui/material";
import { Home, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Person, QuestionAnswer, Settings, Logout, HelpOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Human: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const sessionID = useSelector((state: any) => state.sessionData?.SessionID) || 0;
  console.log("SessionID:", sessionID);

  // Add event listener for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle message from Unity WebGL
      if (event.data === "gameEnded") {
        console.log("Game ended message received");
        // Navigate using React Router instead of window.location
        navigate("/game-selection");
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
          <Box flexGrow={1} p={3} bgcolor="#e6f4ff">
            <Box className={styles.main}>
              <div className={styles.path}>Gamified Assessments</div>
              <div>
                <iframe
                  ref={iframeRef}
                  src="Game4/index.html"
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                  }}
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-top-navigation"
                ></iframe>
              </div>
            </Box>
          </Box>

    </Box>

  );
};

export default Human;
