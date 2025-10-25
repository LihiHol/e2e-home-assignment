// import React from "react";
// import { SnackbarProvider } from "notistack";
// import ReactDOM from 'react-dom/client';
// import App from './App';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <SnackbarProvider>
//     <App />
//   </SnackbarProvider>

// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { ThemeModeProvider } from "./context/ThemeContext";
import { WorkerProvider } from "./context/WorkerContext"; // ⬅️ חדש

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeModeProvider>
    <WorkerProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <App />
      </SnackbarProvider>
    </WorkerProvider>
  </ThemeModeProvider>
);
