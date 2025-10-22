import React from "react";
import { TextField, MenuItem } from "@mui/material";

export default function SelectBase({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  options = [],
  sx,
  ...rest
}) {
  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value ?? ""}          
      onChange={onChange}           
      onBlur={onBlur}
      error={Boolean(error)}
      helperText={helperText}
      sx={{ width: "100%", ...sx }} 
      {...rest}
    >
      <MenuItem value="" disabled>בחר/י…</MenuItem>
      {options.map((opt) => (
        <MenuItem key={String(opt.value)} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
