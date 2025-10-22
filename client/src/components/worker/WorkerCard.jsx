import React, { useEffect, useState } from "react";
import InfoCard from "../ui/card/InfoCard";
import CustomPrimaryButton from "../ui/buttons/CustomPrimaryButton";
import { TextField, MenuItem, Stack } from "@mui/material";
import { useApiQuery } from "../../hooks/useApiQuery";
import { workerService } from "../../services/workerService";
import { JOBS_OPTIONS } from "../../constants/JOBS_OPTIONS";

export default function WorkerCard({ workerId, onDelete }) {
  const { data: worker, loading, error } = useApiQuery(() => workerService.getById(workerId), [workerId]);

  const [local, setLocal] = useState(null);                 
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", job: "", phone: "", address: "" });
  useEffect(() => { if (worker) setLocal(worker); }, [worker]);

  if (loading) return <div>טוען…</div>;
  if (error)   return <div style={{ color: "red" }}>שגיאה בטעינת עובד</div>;
  if (!local)  return null;

  const items = [
    { label: "מס' עובד", value: local.workerId },
    { label: "שם", value: local.name },
    { label: "תפקיד", value: local.job },
    { label: "טלפון", value: local.phone },
    { label: "כתובת", value: local.address },
    { label: "נוצר ב־", value: local.createdAt ? new Date(local.createdAt).toLocaleString() : "—" },
  ];

  const startEdit  = () => { setDraft({ name: local.name ?? "", job: local.job ?? "", phone: local.phone ?? "", address: local.address ?? "" }); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const onChange   = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    const updated = await workerService.update(local.id, draft);
    setLocal(updated);                  // Updated immediately in the card
    window.dispatchEvent(new Event("workers:changed")); // Refresh graphs/lists outside
    setEditing(false);
  };

  const actions = editing ? (
    <>
      <CustomPrimaryButton sx={{ width: "auto", px: 2 }} onClick={save}>שמור</CustomPrimaryButton>
      <CustomPrimaryButton sx={{ width: "auto", px: 2, backgroundColor: "#64748b" }} onClick={cancelEdit}>ביטול</CustomPrimaryButton>
    </>
  ) : (
    <>
      <CustomPrimaryButton sx={{ width: "auto", px: 2 }} onClick={startEdit}>עריכה</CustomPrimaryButton>
      {onDelete && (
        <CustomPrimaryButton
          sx={{ width: "auto", px: 2, backgroundColor: "#dc2626", "&:hover": { backgroundColor: "#b91c1c" } }}
          onClick={() => onDelete(local)}
        >
          מחיקה
        </CustomPrimaryButton>
      )}
    </>
  );

  return (
    <InfoCard
      title={local.name}
      subtitle={`#${local.workerId}`}
      avatar={{ src: local.avatarUrl, fallback: local.name?.[0] || "W" }}
      items={editing ? [] : items}
      actions={actions}
    >
      {editing && (
        <Stack gap={2} sx={{ minWidth: 0 }}>
          <TextField label="שם"     value={draft.name}  onChange={onChange("name")}  fullWidth size="small" />
          <TextField select label="תפקיד" value={draft.job} onChange={onChange("job")} fullWidth size="small">
            <MenuItem value="" disabled>בחר/י…</MenuItem>
            {JOBS_OPTIONS.map((o) => <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
          <TextField label="טלפון"  value={draft.phone} onChange={onChange("phone")} fullWidth size="small" />
          <TextField label="כתובת"  value={draft.address} onChange={onChange("address")} fullWidth size="small" />
        </Stack>
      )}
    </InfoCard>
  );
}
