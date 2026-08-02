import { FaBell, FaTimes } from "react-icons/fa";
import { useState } from "react";

const notifications = [
  { id: 1, medicine: "Vitamin D",    time: "8:00 AM",  status: "pending" },
  { id: 2, medicine: "Paracetamol", time: "1:00 PM",  status: "pending" },
  { id: 3, medicine: "Calcium",     time: "9:00 PM",  status: "pending" },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        title="Notifications"
        style={{
          position: "relative",
          width: 34, height: 34,
          border: "1px solid var(--border)",
          borderRadius: "var(--r-sm)",
          background: open ? "var(--blue-muted)" : "var(--bg-subtle)",
          color: open ? "var(--blue)" : "var(--text-muted)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
          flexShrink: 0,
        }}
      >
        <FaBell size={13} />
        <span
          style={{
            position: "absolute", top: 6, right: 6,
            width: 6, height: 6,
            background: "var(--red)", borderRadius: "50%",
            border: "1.5px solid var(--bg-surface)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            width: 300,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 200,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 16px 12px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-heading)", margin: 0 }}>
                Notifications
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", margin: "2px 0 0" }}>
                {notifications.length} upcoming reminders
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
            >
              <FaTimes size={12} />
            </button>
          </div>

          {/* List */}
          {notifications.map(({ id, medicine, time }) => (
            <div
              key={id}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-subtle)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div
                style={{
                  width: 34, height: 34, borderRadius: "var(--r-sm)",
                  background: "var(--blue-muted)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                💊
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {medicine}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
                  Scheduled at {time}
                </p>
              </div>
              <span className="badge badge-warning" style={{ flexShrink: 0 }}>Soon</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
