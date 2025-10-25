// import React, { useMemo, useState } from "react";
// import {
//   CircularProgress,
//   Typography,
//   TextField,
//   MenuItem,
//   IconButton,
// } from "@mui/material";
// import { Edit, Save, Close } from "@mui/icons-material";

// import BaseTable from "../../components/ui/table/BaseTable";
// import WorkersToolbar from "./WorkersToolbar";
// import { useWorkers } from "../../hooks/useWorkersQuery";
// import { useDebouncedValue } from "../../hooks/useDebouncedValue";
// import { useWorkerInlineEdit } from "../../hooks/useWorkerInlineEdit";
// import { JOBS_OPTIONS } from "../../constants/JOBS_OPTIONS";

// export default function WorkersTable() {
//   // Search + Filter (debounced for server-side search)
//   const [filter, setFilter] = useState("all");
//   const [query, setQuery] = useState("");
//   const debouncedQ = useDebouncedValue(query, 400);

//   // Data from the server (returns workers + setData for optimism/rollback)
//   const { workers, loading, error, setData } = useWorkers({
//     filter,
//     q: debouncedQ,
//     page: 1,
//     limit: 10,
//   });

//   // Inline Edit
//   const {
//     editingId,
//     draft,
//     saving,
//     startEdit,
//     cancelEdit,
//     onDraftChange,
//     saveEdit,
//   } = useWorkerInlineEdit({ workers, setData });

//   // Save + notify chart
//   const handleSave = async () => {
//     try {
//       await saveEdit();
//       window.dispatchEvent(new Event("workers:changed"));
//     } catch (e) {
//       console.error("Save failed", e);
//     }
//   };

//   // fields → columns
//   const fields = useMemo(
//     () => [
//       { id: "workerId", label: "מס' עובד", width: 120, type: "text", disabledInEdit: true },
//       { id: "name", label: "שם", type: "text" },
//       { id: "job", label: "תפקיד", type: "select", options: JOBS_OPTIONS },
//       { id: "phone", label: "טלפון", type: "text" },
//       { id: "address", label: "כתובת", type: "text" },
//     ],
//     []
//   );

//   // General renderer for field: supports text/select in edit mode
//   const renderCell = (row, f) => {
//     if (editingId !== row.id) return row[f.id];

//     if (f.type === "select") {
//       return (
//         <TextField
//           select
//           value={draft[f.id] ?? ""}
//           onChange={onDraftChange(f.id)}
//           variant="standard"
//           size="small"
//           sx={{ width: "100%" }}
//         >
//           <MenuItem value="" disabled>בחר/י…</MenuItem>
//           {(f.options || []).map((opt) => (
//             <MenuItem key={String(opt.value)} value={opt.value}>
//               {opt.label}
//             </MenuItem>
//           ))}
//         </TextField>
//       );
//     }

//     return (
//       <TextField
//         value={draft[f.id] ?? ""}
//         onChange={onDraftChange(f.id)}
//         variant="standard"
//         size="small"
//         sx={{ width: "100%" }}
//         disabled={Boolean(f.disabledInEdit)}
//       />
//     );
//   };

//   // columns for base table
//   const columns = useMemo(() => {
//     const fieldColumns = fields.map((f) => ({
//       id: f.id,
//       header: f.label,
//       width: f.width,
//       render: (row) => renderCell(row, f),
//     }));
//     const actionsCol = {
//       id: "actions",
//       header: "",
//       width: 96,
//       align: "right",
//       render: (row) =>
//         editingId === row.id ? (
//           <>
//             <IconButton onClick={handleSave} disabled={saving} aria-label="שמור">
//               <Save />
//             </IconButton>
//             <IconButton onClick={cancelEdit} aria-label="ביטול">
//               <Close />
//             </IconButton>
//           </>
//         ) : (
//           <IconButton onClick={() => startEdit(row)} aria-label="עריכה">
//             <Edit />
//           </IconButton>
//         ),
//     };
//     return [...fieldColumns, actionsCol];
//   }, [fields, editingId, draft, saving]); // draft שומר על רנדר בזמן עריכה

//   if (loading) {
//     return <CircularProgress sx={{ mt: 6, mx: "auto", display: "block" }} />;
//   }
//   if (error) {
//     return (
//       <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
//         {error}
//       </Typography>
//     );
//   }

//   return (
//     <BaseTable
//       columns={columns}
//       rows={workers}
//       emptyMessage="אין עובדים להצגה"
//       rowKey="id"
//       containerSx={{ maxWidth: 1000, mx: "auto" }}
//       toolbar={
//         <WorkersToolbar
//           query={query}
//           onQueryChange={setQuery}
//           filter={filter}
//           onFilterChange={setFilter}
//         />
//       }
//     />
//   );
// }

// src/features/workers/WorkersTable.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Edit, Save, Close } from "@mui/icons-material";

import BaseTable from "../../components/ui/table/BaseTable";
import WorkersToolbar from "./WorkersToolbar";
import { useWorkers } from "../../context/WorkerContext"; // ← שימוש בקונטקסט
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useWorkerInlineEdit } from "../../hooks/useWorkerInlineEdit";
import { JOBS_OPTIONS } from "../../constants/JOBS_OPTIONS";

export default function WorkersTable() {
  // Search + Filter (debounced for server-side search)
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const debouncedQ = useDebouncedValue(query, 400);

  // מהקונטקסט
  const { workers, loading, error, loadWorkers, updateWorker } = useWorkers();

  // Inline Edit (נשמר כמו אצלך)
  const noopSetData = () => {};
  const {
    editingId,
    draft,
    saving,
    startEdit,
    cancelEdit,
    onDraftChange,
  } = useWorkerInlineEdit({ workers, setData: noopSetData });

  // ⚠️ יציבות: ה־effect לא תלוי ב־loadWorkers (שיכול להשתנות בזיכרון),
  // רק בפרמטרים של השאילתה. זה מונע לולאת רינדור/טעינות חוזרות.
  useEffect(() => {
    loadWorkers?.({ filter, q: debouncedQ, page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedQ]);

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateWorker(editingId, draft);
      cancelEdit();
      // אם יש לך מאזינים חיצוניים, אפשר להשאיר:
      // window.dispatchEvent(new Event("workers:changed"));
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  // fields (כמו שהיה)
  const fields = useMemo(
    () => [
      { id: "workerId", label: "מס' עובד", width: 120, type: "text", disabledInEdit: true },
      { id: "name", label: "שם", type: "text" },
      { id: "job", label: "תפקיד", type: "select", options: JOBS_OPTIONS },
      { id: "phone", label: "טלפון", type: "text" },
      { id: "address", label: "כתובת", type: "text" },
    ],
    []
  );

  // ✅ מייצבים את פונקציית הרינדור לתא (תלויה רק במה שחייב)
  const renderCell = useCallback((row, f) => {
    if (editingId !== row.id) return row[f.id];

    if (f.type === "select") {
      return (
        <TextField
          select
          value={draft[f.id] ?? ""}
          onChange={onDraftChange(f.id)}
          variant="standard"
          size="small"
          sx={{ width: "100%" }}
        >
          <MenuItem value="" disabled>בחר/י…</MenuItem>
          {(f.options || []).map((opt) => (
            <MenuItem key={String(opt.value)} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        value={draft[f.id] ?? ""}
        onChange={onDraftChange(f.id)}
        variant="standard"
        size="small"
        sx={{ width: "100%" }}
        disabled={Boolean(f.disabledInEdit)}
      />
    );
  }, [editingId, draft, onDraftChange]);

  // ✅ columns יציב: לא תלוי ב־draft ישירות (שהוא משתנה בכל הקלדה)
  const columns = useMemo(() => {
    const fieldColumns = fields.map((f) => ({
      id: f.id,
      header: f.label,
      width: f.width,
      render: (row) => renderCell(row, f),
    }));
    const actionsCol = {
      id: "actions",
      header: "",
      width: 96,
      align: "right",
      render: (row) =>
        editingId === row.id ? (
          <>
            <IconButton onClick={handleSave} disabled={saving} aria-label="שמור">
              <Save />
            </IconButton>
            <IconButton onClick={cancelEdit} aria-label="ביטול">
              <Close />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => startEdit(row)} aria-label="עריכה">
            <Edit />
          </IconButton>
        ),
    };
    return [...fieldColumns, actionsCol];
  }, [fields, renderCell, editingId, saving, cancelEdit, startEdit, handleSave]);

  // ❌ לא מחליפים את כל הטבלה בספינר (זה יוצר קפיצה)
  // ✅ משאירים את הטבלה ומציגים overlay בזמן טעינה
  return (
    <div style={{ position: "relative", minHeight: 360 }}>
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      <BaseTable
        columns={columns}
        rows={workers}
        emptyMessage="אין עובדים להצגה"
        rowKey="id"
        containerSx={{ maxWidth: 1000, mx: "auto" }}
        // אם ל-BaseTable יש API ל-styles של ה-table, שווה לקבע:
        // tableProps={{ sx: { tableLayout: "fixed" } }}
        toolbar={
          <WorkersToolbar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
          />
        }
      />

      {loading && (
        <div
          style={{
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
        </div>
      )}
    </div>
  );
}
