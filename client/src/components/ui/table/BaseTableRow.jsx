import React from "react";
import { TableRow, TableCell } from "@mui/material";

/**
 * Row renderer that's UI-only.
 * columns: [{ id, accessor?: string | (row)=>any, render?: (row)=>ReactNode, align?, width? }]
 * row: object for the current line.
 */
export default function BaseTableRow({ row, columns, onClick }) {
  return (
    <TableRow hover onClick={onClick ? () => onClick(row) : undefined}>
      {columns.map((col) => {
        const content = col.render
          ? col.render(row)
          : typeof col.accessor === "function"
            ? col.accessor(row)
            : row?.[col.accessor];

        return (
          <TableCell key={col.id} align={col.align || "left"} style={{ width: col.width }}>
            {content}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
