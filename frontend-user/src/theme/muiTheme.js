import { createTheme } from "@mui/material/styles";

export const getMuiTheme = ({ mode = "light", direction = "ltr" }) =>
  createTheme({
    direction,
    palette: {
      mode,

      primary: {
        main: mode === "dark" ? "#c0a427" : "#004d40",
      },
      secondary: {
        main: mode === "dark" ? "#90caf9" : "#00695c",
      },

      text:
        mode === "dark"
          ? {
              primary: "#ffffff",
              secondary: "rgba(255,255,255,0.7)",
            }
          : {
              primary: "#000000",
              secondary: "rgba(0,0,0,0.7)",
            },

      background:
        mode === "dark"
          ? {
              default: "#0f1115",
              paper: "#151923",
            }
          : {
              default: "#ffffff",
              paper: "#fafafa",
            },
    },

    typography: {
      fontFamily:
        direction === "rtl" ? "Cairo, sans-serif" : "Roboto, sans-serif",
    },

    shape: { borderRadius: 12 },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#151923" : "#ffffff",
            color: mode === "dark" ? "#fff" : "#000",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: "bold",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  });
