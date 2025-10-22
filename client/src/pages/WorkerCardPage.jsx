import React from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import WorkerCard from "../components/worker/WorkerCard";
import { useApiQuery } from "../hooks/useApiQuery";
import { workerService } from "../services/workerService";

export default function WorkerCardPage() {
  // טוענים את רשימת העובדים ומקבלים setData לעדכון אופטימיסטי
  const { data: workers = [], loading, error, setData /*, refetch */ } =
    useApiQuery(() => workerService.getAll(), []);

  // כשלוחצים "שמירה" בכרטיס (Inline Edit), הכרטיס קורא onEdited(updated)
  const handleEdited = (updatedWorker) => {
    setData((prev = []) => prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w)));
    // אם יש גרף תלוי-תפקיד — נעדכן גם אותו
    window.dispatchEvent(new Event("workers:changed"));
    // לחלופין: אפשר refetch() במקום setData, אם מעדיפים למשוך מחדש
  };

  // מחיקה מתוך הכרטיס
  const handleDelete = async (worker) => {
    try {
      await workerService.remove(worker.id); // מחיקה בשרת
      setData((prev = []) => prev.filter((w) => w.id !== worker.id)); // עדכון אופטימיסטי
      window.dispatchEvent(new Event("workers:changed"));
      // לחלופין: await refetch();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ mt: 6, mx: "auto", display: "block" }} />;
  }
  if (error) {
    return <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
      שגיאה בטעינת עובדים
    </Typography>;
  }
  if (!workers.length) {
    return <Typography sx={{ textAlign: "center", mt: 2 }}>
      אין עובדים להצגה
    </Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, paddingTop: "75px" }}>
      <Grid container spacing={2}>
        {workers.map((w) => (
          <Grid item xs={12} sm={6} md={4} key={w.id}>
            <WorkerCard
              workerId={w.id}
              onEdited={handleEdited}   // ⬅️ כרטיס יעביר Worker מעודכן אחרי Save
              onDelete={handleDelete}   // ⬅️ כרטיס יקרא למחיקה
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
