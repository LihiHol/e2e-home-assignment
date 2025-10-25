// Comments in English only
import React, { createContext, useContext, useState, useEffect } from "react";
import { workerService } from "../services/workerService";

const WorkerContext = createContext(null);

export const useWorkers = () => useContext(WorkerContext);

export const WorkerProvider = ({ children }) => {
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ======== Core CRUD Operations ========

    const loadWorkers = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await workerService.getAll(params);
            setWorkers(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load workers");
        } finally {
            setLoading(false);
        }
    };

    const loadWorkerById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const worker = await workerService.getById(id);
            setSelectedWorker(worker);
        } catch (err) {
            console.error(err);
            setError("Failed to load worker");
        } finally {
            setLoading(false);
        }
    };


    const createWorker = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const newWorker = await workerService.create(payload);
            setWorkers((prev) => [newWorker, ...prev]);
            return newWorker;
        } catch (err) {
            console.error(err);
            setError("Failed to create worker");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateWorker = async (id, partial) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await workerService.update(id, partial);
            setWorkers((prev) => prev.map((w) => (w.id === id ? updated : w)));
            if (selectedWorker?.id === id) setSelectedWorker(updated);
            return updated;
        } catch (err) {
            console.error(err);
            setError("Failed to update worker");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeWorker = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await workerService.remove(id);
            setWorkers((prev) => prev.filter((w) => w.id !== id));
            if (selectedWorker?.id === id) setSelectedWorker(null);
        } catch (err) {
            console.error(err);
            setError("Failed to delete worker");
        } finally {
            setLoading(false);
        }
    };

    const loadChart = async () => {
        try {
            const chart = await workerService.getChart();
            setChartData(chart);
        } catch (err) {
            console.error(err);
            setError("Failed to load chart data");
        }
    };
    const fetchWorkerById = async (id) => {
        return await workerService.getById(id);
    };



    // ======== Context Value ========
    const value = {
        workers,
        selectedWorker,
        chartData,
        loading,
        error,
        loadWorkers,
        loadWorkerById,
        createWorker,
        updateWorker,
        removeWorker,
        loadChart,
        setSelectedWorker,
        fetchWorkerById,
    };

    return (
        <WorkerContext.Provider value={value}>
            {children}
        </WorkerContext.Provider>
    );
};
