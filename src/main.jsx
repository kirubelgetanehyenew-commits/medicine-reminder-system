import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

// Apply saved theme before first paint to prevent flash
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--bg-surface)",
          color: "var(--text-heading)",
          border: "1px solid var(--border)",
          fontSize: "0.875rem",
          boxShadow: "var(--shadow-md)",
        },
        success: { iconTheme: { primary: "var(--green)", secondary: "white" } },
        error:   { iconTheme: { primary: "var(--red)",   secondary: "white" } },
      }}
    />
    <App />
  </React.StrictMode>
);
