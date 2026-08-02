import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        display: "inline-flex", flexDirection: "column", alignItems: "flex-end",
        padding: "8px 14px",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-md)",
        background: "var(--bg-subtle)",
      }}
    >
      <span
        style={{
          fontSize: "1.1rem", fontWeight: 700,
          color: "var(--text-heading)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
        }}
      >
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <span style={{ fontSize: "0.68rem", color: "var(--text-subtle)", marginTop: 1 }}>
        {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </div>
  );
}

export default Clock;
