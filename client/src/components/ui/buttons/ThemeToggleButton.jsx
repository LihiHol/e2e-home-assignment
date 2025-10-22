import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useColorMode } from "../../../context/ThemeContext";

export default function ThemeToggleButton() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title="Toggle light/dark mode">
      <IconButton color="inherit" onClick={toggleColorMode}>
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}
