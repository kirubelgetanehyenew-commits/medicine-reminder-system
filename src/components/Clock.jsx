import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div
      style={{
        background: "rgba(20,184,166,0.08)",
        border: "1px solid rgba(20,184,166,0.18)",
        borderRadius: "var(--radius-md)",
        padding: "12px 20px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent-light)", fontVariantNumeric: "tabular-nums" }}>
        {timeStr}
      </span>
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{dateStr}</span>
    </div>
  );
}

export default Clock;
