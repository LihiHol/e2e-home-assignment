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

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeModeProvider>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <App />
    </SnackbarProvider>
  </ThemeModeProvider>
);
