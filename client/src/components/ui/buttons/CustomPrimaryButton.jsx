import React from "react";
import { Button } from "@mui/material";

/**
 * Custom primary button for consistent design across the app.
 * 
 * @param {{
 *   children: React.ReactNode,
 *   onClick?: ()=>void,
 *   type?: "button" | "submit" | "reset",
 *   disabled?: boolean,
 *   fullWidth?: boolean,
 *   color?: string,
 *   sx?: object
 * }} props
 */
export default function CustomPrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = true,
  color = "#1e293b",
  sx = {},
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      variant="contained"
      sx={{
        mt: 2,
        py: 1.2,
        borderRadius: 2,
        fontWeight: 600,
        backgroundColor: color,
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#334155",
          boxShadow: "none",
        },
        "&:disabled": {
          opacity: 0.6,
          backgroundColor: "#94a3b8",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
