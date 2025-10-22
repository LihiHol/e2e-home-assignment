import React from "react";
import { Box, Typography } from "@mui/material";
import WorkersTable from "../components/worker/WorkersTable";
import WorkerChartJobs from "../components/worker/WorkerChartJobs";

export default function WorkersPage() {
    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", py: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Workers
            </Typography>
            <WorkersTable />
            <WorkerChartJobs />
        </Box>
    );
}
