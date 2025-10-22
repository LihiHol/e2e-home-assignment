import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { workerService } from "../services/workerService";
/**
 * Inline edit logic for workers table.
 * Keeps a single source of truth by updating setData from useWorkers (optimistic update).
 */
export function useWorkerInlineEdit({ workers, setData }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  const startEdit = (row) => {
    setEditingId(row.id);
    setDraft({
      workerId: row.workerId ?? "",
      name: row.name ?? "",
      job: row.job ?? "",
      phone: row.phone ?? "",
      address: row.address ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const onDraftChange = (field) => (e) =>
    setDraft((d) => ({ ...d, [field]: e.target.value }));

  const saveEdit = async () => {
    setSaving(true);

    const prev = workers.find((w) => w.id === editingId);
    const optimistic = { ...prev, ...draft };

    // Optimistic
    setData((list) => (list ?? []).map((w) => (w.id === editingId ? optimistic : w)));

    try {
      const patch = {
        name: draft.name,
        job: draft.job,
        phone: draft.phone,
        address: draft.address,
      };
      const updated = await workerService.update(editingId, patch);

      // Sync with server response
      setData((list) => (list ?? []).map((w) => (w.id === updated.id ? updated : w)));
      enqueueSnackbar("העובד עודכן בהצלחה", { variant: "success" });
      cancelEdit();
    } catch (e) {
      // Rollback
      setData((list) => (list ?? []).map((w) => (w.id === editingId ? prev : w)));
      enqueueSnackbar("אירעה שגיאה בעדכון", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return {
    editingId,
    draft,
    saving,
    startEdit,
    cancelEdit,
    onDraftChange,
    saveEdit,
    setDraft, // חשוף אם תרצי לגשת מבחוץ
  };
}
