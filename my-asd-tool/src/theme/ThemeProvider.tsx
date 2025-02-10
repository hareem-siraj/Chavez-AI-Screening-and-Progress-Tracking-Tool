import {
    CssBaseline,
    ThemeProvider as MuiThemeProvider,
    createTheme,
  } from "@mui/material";
  import React, { ReactNode } from "react";
  
  const appTheme = createTheme({
    palette: {
      primary: {
        main: "#3a416f", // Main theme color
      },
      secondary: {
        main: "#e293d3", // Secondary color
      },
      text: {
        primary: "#ffffff", // Primary text color
        secondary: "#d7d7d7", // Secondary text color
      },
      background: {
        default: "#ffffff", // Background color
      },
    },
    typography: {
      fontFamily: "Poppins, Open Sans, Helvetica",
      h1: {
        fontSize: "3rem",
        fontWeight: 600,
      },
      h6: {
        fontSize: "1.25rem",
        fontWeight: 400,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
      button: {
        fontSize: "1rem",
        fontWeight: 700,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "50px",
            padding: "10px 24px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: "white",
            borderRadius: 4,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& fieldset": {
              borderColor: "#e293d3",
            },
            "&:hover fieldset": {
              borderColor: "#e293d3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e293d3",
            },
          },
        },
      },
    },
  });
  
  interface ThemeProviderProps {
    children: ReactNode;
  }
  
  export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    return (
      <MuiThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  };
  