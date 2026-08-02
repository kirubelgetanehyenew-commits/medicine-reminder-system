import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: darkMode ? "rgba(99,102,241,0.15)" : "rgba(245,158,11,0.15)",
        border: `1px solid ${darkMode ? "rgba(99,102,241,0.3)" : "rgba(245,158,11,0.3)"}`,
        color: darkMode ? "#a5b4fc" : "#fbbf24",
        borderRadius: "var(--radius-sm)",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
    </button>
  );
}

export default ThemeToggle;
