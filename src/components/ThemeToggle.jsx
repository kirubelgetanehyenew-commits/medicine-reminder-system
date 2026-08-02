import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 34, height: 34,
        border: "1px solid var(--border)",
        borderRadius: "var(--r-sm)",
        background: "var(--bg-subtle)",
        color: "var(--text-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-heading)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-subtle)"; e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      {dark ? <FaSun size={13} /> : <FaMoon size={13} />}
    </button>
  );
}

export default ThemeToggle;
