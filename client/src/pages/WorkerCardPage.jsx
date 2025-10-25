// import React from "react";
// import { Box, CircularProgress, Grid, Typography } from "@mui/material";
// import WorkerCard from "../components/worker/WorkerCard";
// import { useApiQuery } from "../hooks/useApiQuery";
// import { workerService } from "../services/workerService";

// export default function WorkerCardPage() {
//   // Load the employee list and get setData for optimistic update
//   const { data: workers = [], loading, error, setData /*, refetch */ } =
//     useApiQuery(() => workerService.getAll(), []);

//   // When you click "Save" on a card (Inline Edit), the card calls onEdited(updated)
//   const handleEdited = (updatedWorker) => {
//     setData((prev = []) => prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w)));
//     // If there is a role-dependent graph — update that too
//     window.dispatchEvent(new Event("workers:changed"));
//     // Alternatively: use refetch() instead of setData, if you prefer to re-fetch
//   };

//   // Delete from the card
//   const handleDelete = async (worker) => {
//     try {
//       await workerService.remove(worker.id); // Delete in the server
//       setData((prev = []) => prev.filter((w) => w.id !== worker.id)); // Optimistic update
//       window.dispatchEvent(new Event("workers:changed"));
//       // or: await refetch();
//     } catch (e) {
//       console.error("Delete failed", e);
//     }
//   };

//   if (loading) {
//     return <CircularProgress sx={{ mt: 6, mx: "auto", display: "block" }} />;
//   }
//   if (error) {
//     return <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
//       שגיאה בטעינת עובדים
//     </Typography>;
//   }
//   if (!workers.length) {
//     return <Typography sx={{ textAlign: "center", mt: 2 }}>
//       אין עובדים להצגה
//     </Typography>;
//   }

//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, paddingTop: "75px" }}>
//       <Grid container spacing={2}>
//         {workers.map((w) => (
//           <Grid item xs={12} sm={6} md={4} key={w.id}>
//             <WorkerCard
//               workerId={w.id}
//               onEdited={handleEdited}
//               onDelete={handleDelete}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

// src/pages/WorkerCardPage.jsx
import React, { useEffect } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import WorkerCard from "../components/worker/WorkerCard";
import { useWorkers } from "../context/WorkerContext";

export default function WorkerCardPage() {
  const { workers, loading, error, loadWorkers , removeWorker} = useWorkers();

  const handleDelete = (worker) => {
    // אפשר להוסיף confirm אם תרצי
    // if (!window.confirm(`למחוק את ${worker.name}?`)) return;
    removeWorker(worker.id);
  };


  // טוען פעם אחת את העובדים. לא תולה ב-loadWorkers כדי למנוע טריגרים מיותרים
  useEffect(() => {
    loadWorkers?.({ page: 1, limit: 50 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", p: 2, paddingTop: "75px", minHeight: 300 }}>
      {/* תוכן קבוע - אין החלפות מלאות שגורמות לרעידות */}
      {error ? (
        <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
          שגיאה בטעינת עובדים
        </Typography>
      ) : workers?.length ? (
        <Grid container spacing={2}>
          {workers.map((w) => (
            <Grid item xs={12} sm={6} md={4} key={w.id}>
              {/* הכרטיס כבר עובד מול ה-Context; אין צורך ב-onEdited/onDelete */}
              <WorkerCard workerId={w.id} onDelete={handleDelete}/>
            </Grid>
          ))}
        </Grid>
      ) : (
        !loading && (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            אין עובדים להצגה
          </Typography>
        )
      )}

      {/* overlay טעינה: משאיר לייאאוט יציב ומונע "רעד" */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(1px)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

