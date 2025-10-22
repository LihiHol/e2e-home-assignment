import { useMemo } from "react";
import { useApiQuery } from "./useApiQuery";
import { workerService } from "../services/workerService";

/**
 * useWorkers({ filter, q, page, limit })
 * - filter: "all" | "manager" | "technician" ... (סינון בצד לקוח)
 * - q/page/limit: נשלחים לשרת (חיפוש+פגינציה)
 */
export function useWorkers({ filter = "all", q, page = 1, limit = 10 } = {}) {
  // data = מהרשימה המלאה מהשרת לפי q/page/limit
  const { data = [], loading, error, refetch, setData } = useApiQuery(
    () => workerService.getAll({ q, page, limit }),
    [q, page, limit]
  );

  // סינון דומייני (תפקיד) בצד הלקוח – מעל התוצאות מהשרת
  const workers = useMemo(
    () => (filter === "all" ? data : data.filter((w) => w.job === filter)),
    [data, filter]
  );

  // Utilities נוחים לעריכה אופטימית מקומית (נשארים כפי שהם)
  const patchLocal = (id, partial) =>
    setData((prev) => (prev ?? []).map((w) => (w.id === id ? { ...w, ...partial } : w)));
  const removeLocal = (id) =>
    setData((prev) => (prev ?? []).filter((w) => w.id !== id));

  return { workers, loading, error, refetch, setData, patchLocal, removeLocal };
}
