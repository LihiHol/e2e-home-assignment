import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import WorkersPage from "./pages/WorkersPage";
import AddWorkerPage from "./pages/AddWorkerPage";
import WorkerCard from "./pages/WorkerCardPage";
import Navbar from "./components/ui/navBar/NavBar";


export default function App() {
    return (
        <BrowserRouter>
            {/* <nav style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #eee" }}>
        <Link to="/" style={{ marginInlineEnd: 12 }}>עובדים</Link>
        <Link to="/add">הוספת עובד</Link>
      </nav> */}
            <Navbar />

            <main style={{ paddingTop: '75px', padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<WorkersPage />} />
                    <Route path="/add" element={<AddWorkerPage />} />
                    <Route path="/cards" element={<WorkerCard />} />
                    <Route path="*" element={<div>404 — העמוד לא נמצא</div>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
