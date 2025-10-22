import api from "./api";

const mapWorker = (w) => ({
    id: w.id,
    workerId: w.workerId,
    name: w.name,
    job: w.job,
    phone: w.phone ?? "",
    address: w.address ?? "",
    createdAt: w.created_at,
    updatedAt: w.updated_at ?? null,
});

export const workerService = {
    async getAll(params = {}) {
        const { data } = await api.get("/workers", { params });
        return data.map(mapWorker);
    },

    async getById(id) {
        const { data } = await api.get(`/workers/${id}`);
        return mapWorker(data);
    },

    async getChart() {
        const { data } = await api.get("/workers/chart");
        // { managers_number, technicians_number, clerks_number }
        return [
            { name: "managers", value: data.managers_number },
            { name: "technicians", value: data.technicians_number },
            { name: "clerks", value: data.clerks_number },
        ];
    },

    async create(payload) {
        const body = {
            workerId: Number(payload.workerId),
            name: payload.name?.trim(),
            job: payload.job,
            phone: payload.phone?.trim() || undefined,
            address: (payload.address ?? payload.adress)?.trim() || undefined,
            password: payload.password || undefined,
        };
        const { data } = await api.post("/workers", body);
        return mapWorker(data);
    },

    async update(id, partial) {
        const patch = {
            ...(partial.name !== undefined ? { name: partial.name } : {}),
            ...(partial.job !== undefined ? { job: partial.job } : {}),
            ...(partial.phone !== undefined ? { phone: partial.phone } : {}),
            ...(partial.address !== undefined ? { address: partial.address } : {}),
            ...(partial.password !== undefined ? { password: partial.password } : {}),
        };
        const { data } = await api.patch(`/workers/${id}`, patch);
        return mapWorker(data);
    },

    async remove(id) {
        await api.delete(`/workers/${id}`);
    },
};
