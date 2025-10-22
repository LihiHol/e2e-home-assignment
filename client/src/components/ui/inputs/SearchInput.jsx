import React from "react";
import TextFieldBase from "./TextFieldBase";

/**
 * UI-only search input (controlled)
 * @param {{value:string, onChange:(v:string)=>void, placeholder?:string, sx?:object}} props
 */
export default function SearchInput({ value, onChange, placeholder = "חיפוש…", sx }) {
  return (
    <TextFieldBase
      label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      size="small"
      sx={{ minWidth: 260, ...sx }}
    />
  );
}
