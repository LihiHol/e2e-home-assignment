import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import PieChart from "../ui/charts/PieChart";
import { workerService } from "../../services/workerService";

export default function WorkerChartJobs() {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchChart = async () => {
        try {
            setLoading(true);
            setError("");
            const arr = await workerService.getChart();
            setRawData(Array.isArray(arr) ? arr : []);
        } catch {
            setError("שגיאה בטעינת נתוני הגרף");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        // טעינה ראשונית
        fetchChart();

        // האזנה לאירועי שינוי מהטבלה
        const onWorkersChanged = () => {
            if (mounted) fetchChart(); // רענון נתוני הגרף
        };
        window.addEventListener("workers:changed", onWorkersChanged);

        return () => {
            mounted = false;
            window.removeEventListener("workers:changed", onWorkersChanged);
        };
    }, []);

    const data = useMemo(
        () =>
            rawData.map((d, i) => ({
                id: i,
                value: Number(d.value) || 0,
                label: d.name || "—",
            })),
        [rawData]
    );

    return (
        <CardContent>
            {/* <Typography variant="h6" gutterBottom>
                התפלגות תפקידים
            </Typography> */}
            <PieChart data={data} loading={loading} error={error} />
        </CardContent>
    );
}
