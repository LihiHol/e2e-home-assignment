import React, { useMemo, useState } from "react";
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
import { useWorkers } from "../../hooks/useWorkersQuery";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useWorkerInlineEdit } from "../../hooks/useWorkerInlineEdit";
import { JOBS_OPTIONS } from "../../constants/JOBS_OPTIONS";

export default function WorkersTable() {
  // Search + Filter (debounced for server-side search)
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const debouncedQ = useDebouncedValue(query, 400);

  // Data from the server (returns workers + setData for optimism/rollback)
  const { workers, loading, error, setData } = useWorkers({
    filter,
    q: debouncedQ,
    page: 1,
    limit: 10,
  });

  // Inline Edit
  const {
    editingId,
    draft,
    saving,
    startEdit,
    cancelEdit,
    onDraftChange,
    saveEdit,
  } = useWorkerInlineEdit({ workers, setData });

  // Save + notify chart
  const handleSave = async () => {
    try {
      await saveEdit();
      window.dispatchEvent(new Event("workers:changed"));
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  // fields → columns
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

  // General renderer for field: supports text/select in edit mode
  const renderCell = (row, f) => {
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
  };

  // columns for base table
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
  }, [fields, editingId, draft, saving]); // draft שומר על רנדר בזמן עריכה

  if (loading) {
    return <CircularProgress sx={{ mt: 6, mx: "auto", display: "block" }} />;
  }
  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  return (
    <BaseTable
      columns={columns}
      rows={workers}
      emptyMessage="אין עובדים להצגה"
      rowKey="id"
      containerSx={{ maxWidth: 1000, mx: "auto" }}
      toolbar={
        <WorkersToolbar
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
      }
    />
  );
}
