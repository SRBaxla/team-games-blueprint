// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { LobbyProvider } from "./context/LobbyContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <LobbyProvider>
      <App />
    </LobbyProvider>
    </BrowserRouter>
  </React.StrictMode>
);
