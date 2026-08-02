import { FaBell } from "react-icons/fa";
import { useState } from "react";

const notifications = [
  { id: 1, text: "Vitamin D", time: "8:00 AM"  },
  { id: 2, text: "Paracetamol", time: "1:00 PM" },
  { id: 3, text: "Calcium",   time: "9:00 PM"  },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          background: open ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.06)",
          border: "1px solid var(--border)",
          color: open ? "var(--accent-light)" : "var(--text-muted)",
          borderRadius: "var(--radius-sm)",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <FaBell size={15} />
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            background: "#ef4444",
            borderRadius: "50%",
            border: "1.5px solid var(--bg-surface)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 280,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem" }}>Notifications</p>
          </div>
          {notifications.map(({ id, text, time }) => (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                fontSize: "0.85rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>💊</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)" }}>{text}</p>
                <p style={{ margin: "2px 0 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>{time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
