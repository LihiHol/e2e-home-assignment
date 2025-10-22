// src/components/ui/table/BaseTableHead.jsx
import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

/** @param {{ columns: any[] }} props */
export default function BaseTableHead({ columns }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => (
          <TableCell
            key={col.id}
            align={col.align || "left"}
            style={{ width: col.width }}
          >
            {col.header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
