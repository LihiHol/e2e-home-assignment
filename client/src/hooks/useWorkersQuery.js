import { useMemo } from "react";
import { useApiQuery } from "./useApiQuery";
import { workerService } from "../services/workerService";

/**
 * useWorkers({ filter, q, page, limit })
* - filter: "all" | "manager" | "technician" ... (client-side filtering)
* - q/page/limit: sent to server (search+pagination)
 */
export function useWorkers({ filter = "all", q, page = 1, limit = 10 } = {}) {
  // data = from the full list from the server according to q/page/limit
  const { data = [], loading, error, refetch, setData } = useApiQuery(
    () => workerService.getAll({ q, page, limit }),
    [q, page, limit]
  );

  // Domain (role) filtering on the client side – above the results from the server
  const workers = useMemo(
    () => (filter === "all" ? data : data.filter((w) => w.job === filter)),
    [data, filter]
  );

  // Convenient utilities for local optimistic editing (remain as is)
  const patchLocal = (id, partial) =>
    setData((prev) => (prev ?? []).map((w) => (w.id === id ? { ...w, ...partial } : w)));
  const removeLocal = (id) =>
    setData((prev) => (prev ?? []).filter((w) => w.id !== id));

  return { workers, loading, error, refetch, setData, patchLocal, removeLocal };
}
