import React from "react";
import { SnackbarProvider } from "notistack";
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <SnackbarProvider>
    <App />
  </SnackbarProvider>

);