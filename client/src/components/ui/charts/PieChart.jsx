import React from "react";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";
import { Typography, CircularProgress } from "@mui/material";


export default function PieChart({ data, loading, error }) {
  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
  if (error)
    return (
      <Typography color="error" align="center" sx={{ my: 4 }}>
        {error}
      </Typography>
    );
  if (!data || data.length === 0)
    return (
      <Typography align="center" sx={{ my: 4 }}>
        אין נתונים להצגה
      </Typography>
    );

  return (
    <MuiPieChart
      series={[
        {
          data,
          innerRadius: 40,
          outerRadius: 90,
          paddingAngle: 3,
        },
      ]}
      width={520}
      height={300}
    />
  );
}
