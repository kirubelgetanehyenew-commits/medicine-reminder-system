import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaTachometerAlt, FaBell, FaCalendarAlt,
  FaPlusCircle, FaHistory, FaUser, FaStickyNote,
} from "react-icons/fa";

const mainNav = [
  { to: "/home",      icon: <FaHome size={15} />,          label: "Home"         },
  { to: "/dashboard", icon: <FaTachometerAlt size={15} />, label: "Dashboard"    },
  { to: "/reminders", icon: <FaBell size={15} />,          label: "Reminders"    },
  { to: "/calendar",  icon: <FaCalendarAlt size={15} />,   label: "Calendar"     },
  { to: "/add",       icon: <FaPlusCircle size={15} />,    label: "Add Medicine" },
  { to: "/history",   icon: <FaHistory size={15} />,       label: "History"      },
  { to: "/notes",     icon: <FaStickyNote size={15} />,    label: "Health Notes" },
];

const accountNav = [
  { to: "/profile", icon: <FaUser size={14} />, label: "Profile" },
];

function NavItem({ to, icon, label, pathname }) {
  const active = pathname === to;
  return (
    <Link
      to={to}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        borderRadius: "var(--r-sm)",
        color: active ? "var(--blue)" : "var(--text-muted)",
        background: active ? "var(--blue-muted)" : "transparent",
        fontWeight: active ? 600 : 500,
        fontSize: "0.875rem",
        textDecoration: "none",
        transition: "background 0.15s, color 0.15s",
        borderLeft: active ? "3px solid var(--blue)" : "3px solid transparent",
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = "var(--bg-subtle)";
          e.currentTarget.style.color = "var(--text-heading)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-muted)";
        }
      }}
    >
      <span style={{ opacity: active ? 1 : 0.65, flexShrink: 0 }}>{icon}</span>
      {label}
      {active && (
        <span style={{
          marginLeft: "auto",
          width: 6, height: 6,
          borderRadius: "50%",
          background: "var(--blue)",
          flexShrink: 0,
        }} />
      )}
    </Link>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.1em", color: "var(--text-subtle)",
      padding: "0 14px", margin: "16px 0 6px",
    }}>
      {children}
    </p>
  );
}

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside style={{
      width: 248,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border)",
      overflowY: "auto",
      overflowX: "hidden",
    }}>

      {/* ── Brand ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "18px 20px 16px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "var(--r-sm)",
          background: "linear-gradient(135deg, var(--blue), #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
        }}>
          💊
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-heading)", margin: 0, letterSpacing: "-0.02em" }}>
            MediTrack
          </p>
          <p style={{ fontSize: "0.62rem", color: "var(--text-subtle)", margin: 0 }}>
            Pro · v1.0
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{ flex: 1, padding: "8px 8px 0" }}>
        <SectionLabel>Main Menu</SectionLabel>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {mainNav.map(item => (
            <NavItem key={item.to} {...item} pathname={pathname} />
          ))}
        </nav>

        <SectionLabel>Account</SectionLabel>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {accountNav.map(item => (
            <NavItem key={item.to} {...item} pathname={pathname} />
          ))}
        </nav>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          padding: "10px 12px",
          background: "var(--blue-muted)",
          border: "1px solid var(--blue-light)",
          borderRadius: "var(--r-md)",
        }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--blue)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Daily Reminder
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
            Consistency is the foundation of good health.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
