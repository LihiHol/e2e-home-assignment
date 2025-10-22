import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function WorkersFilter({ filter, setFilter }) {
  const handle = (_, val) => { if (val) setFilter(val); };
  return (
    <ToggleButtonGroup value={filter} exclusive onChange={handle} size="small">
      <ToggleButton value="all">All</ToggleButton>
      <ToggleButton value="manager">Managers</ToggleButton>
      <ToggleButton value="clerk">Clerks</ToggleButton>
      <ToggleButton value="technician">Technicians</ToggleButton>
    </ToggleButtonGroup>
  );
}
