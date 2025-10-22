import React from "react";
import {
  Box,
  CircularProgress,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableBody,
} from "@mui/material";
import BaseTableHead from "./BaseTableHead";
import BaseTableRow from "./BaseTableRow";

/**
 * ColumnDef:
 * {
 *   id: string,
 *   header: string,
 *   accessor: string | (row)=>any,
 *   align?: "left"|"center"|"right",
 *   width?: number|string,
 *   render?: (row)=>ReactNode, // אופציונלי: רינדור מותאם לכל תא
 * }
 */

/**
 * @param {{
 *  columns: any[],
 *  rows: any[],
 *  loading?: boolean,
 *  error?: string | null,
 *  emptyMessage?: string,
 *  toolbar?: React.ReactNode,
 *  rowKey?: string,                     // ברירת מחדל: "id"
 *  onRowClick?: (row:any)=>void,
 *  containerSx?: object,               // התאמות עיצוב ל-TableContainer
 * }} props
 */
export default function BaseTable({
  columns,
  rows,
  loading = false,
  error = null,
  emptyMessage = "אין נתונים להצגה",
  toolbar,
  rowKey = "id",
  onRowClick,
  containerSx,
}) {
  if (loading)
    return (
      <CircularProgress sx={{ mt: 12, mx: "auto", display: "block" }} />
    );

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {toolbar && <Box sx={{ mb: 2 }}>{toolbar}</Box>}

      <TableContainer component={Paper} sx={{ maxWidth: 1000, mx: "auto", ...containerSx }}>
        <Table>
          <BaseTableHead columns={columns} />
          <TableBody>
            {rows?.length ? (
              rows.map((row) => (
                <BaseTableRow
                  key={String(row[rowKey] ?? Math.random())}
                  row={row}
                  columns={columns}
                  onClick={onRowClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <Typography sx={{ py: 6, textAlign: "center" }} color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
