export const WORKER_COLUMNS = [
  { id: "worker Id", header: "workerId", accessor: "workerId", width: 120 },
  { id: "name",     header: "name",       accessor: "name" },
  { id: "job",      header: "job",    accessor: "job" },
  { id: "phone",    header: "phone",    accessor: "phone" },
  { id: "address",  header: "address",    accessor: "address" },
  {
    id: "createdAt",
    header: "created at",
    accessor: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : ""),
    width: 200,
  },
];
