import { useCallback, useEffect, useState } from "react";

export function useApiQuery(queryFn, deps = []) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await queryFn();
      setData(res);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }, deps); 

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run, setData };
}
