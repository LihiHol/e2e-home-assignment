import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // 🎨 Light mode colors
          primary: { main: "#1f7a8c" },
          secondary: { main: "#ff9f1c" },
          background: {
            default: "#f9fafb",
            paper: "#ffffff",
          },
          text: {
            primary: "#1e293b",
            secondary: "#475569",
          },
        }
      : {
          // 🌙 Dark mode colors
          primary: { main: "#7cd1e4" },
          secondary: { main: "#ffd166" },
          background: {
            default: "#0f172a",
            paper: "#1e293b",
          },
          text: {
            primary: "#f1f5f9",
            secondary: "#94a3b8",
          },
        }),
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "Roboto, 'Heebo', Arial, sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === "light" ? "0 2px 6px rgba(0,0,0,0.06)" : "0 2px 6px rgba(255,255,255,0.1)",
        },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
