import React from "react";
import { TextField } from "@mui/material";


export default function TextFieldBase({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = "text",
  inputProps,
  ...rest
}) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      error={Boolean(error)}
      helperText={helperText}
      type={type}
      inputProps={inputProps}
      {...rest}
    />
  );
}
