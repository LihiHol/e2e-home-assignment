import React from "react";
import { Box } from "@mui/material";
import SearchInput from "../ui/inputs/SearchInput";
import WorkersFilter from "../ui/filter/WorkersFilter";

/**
 * UI-only toolbar: search + filter
 */
export default function WorkersToolbar({ query, onQueryChange, filter, onFilterChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1,
      }}
    >
      <SearchInput value={query} onChange={onQueryChange} />
      <WorkersFilter filter={filter} setFilter={onFilterChange} />
    </Box>
  );
}
