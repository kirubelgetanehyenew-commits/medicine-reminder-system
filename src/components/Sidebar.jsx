import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt, FaBell, FaCalendarAlt,
  FaPlusCircle, FaHistory, FaUser,
  FaSignOutAlt, FaCog, FaStickyNote,
} from "react-icons/fa";
import { clearSession, getUser } from "../services/api";

const mainNav = [
  { to: "/dashboard", icon: <FaTachometerAlt size={15} />, label: "Dashboard"    },
  { to: "/reminders", icon: <FaBell size={15} />,          label: "Reminders"    },
  { to: "/calendar",  icon: <FaCalendarAlt size={15} />,   label: "Calendar"     },
  { to: "/add",       icon: <FaPlusCircle size={15} />,    label: "Add Medicine" },
  { to: "/history",   icon: <FaHistory size={15} />,       label: "History"      },
  { to: "/notes",     icon: <FaStickyNote size={15} />,    label: "Health Notes" },
];

const accountNav = [
  { to: "/profile",   icon: <FaUser size={14} />,          label: "Profile"      },
];

function NavItem({ to, icon, label, pathname }) {
  const active = pathname === to;
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: "var(--r-sm)",
        color: active ? "var(--blue)" : "var(--text-muted)",
        background: active ? "var(--blue-muted)" : "transparent",
        fontWeight: active ? 600 : 500,
        fontSize: "0.875rem",
        textDecoration: "none",
        transition: "background 0.15s, color 0.15s",
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
      <span style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }}>{icon}</span>
      {label}
    </Link>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.1em", color: "var(--text-subtle)",
      padding: "0 12px", margin: "16px 0 4px",
    }}>
      {children}
    </p>
  );
}

function Sidebar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const user         = getUser();

  const handleLogout = () => { clearSession(); navigate("/login"); };

  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border)",
      flexShrink: 0,
      overflowY: "auto",
    }}>

      {/* ── Brand ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "22px 20px 18px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "var(--r-sm)",
          background: "var(--blue)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", flexShrink: 0,
        }}>
          💊
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-heading)", margin: 0, letterSpacing: "-0.02em" }}>
            MediTrack
          </p>
          <p style={{ fontSize: "0.65rem", color: "var(--text-subtle)", margin: 0 }}>
            Pro · v1.0
          </p>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div style={{ flex: 1, padding: "8px 12px" }}>
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

      {/* ── User card + logout ── */}
      <div style={{
        padding: "12px 14px 16px",
        borderTop: "1px solid var(--border)",
      }}>
        <Link
          to="/profile"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 10px",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--border)",
            background: "var(--bg-subtle)",
            textDecoration: "none",
            marginBottom: 8,
            transition: "box-shadow 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "0.85rem", color: "white", flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-heading)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "User"}
            </p>
            <p style={{ fontSize: "0.68rem", color: "var(--text-subtle)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email || ""}
            </p>
          </div>
          <FaCog size={12} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
        </Link>

        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 7, padding: "8px 12px",
            border: "1px solid var(--border)", borderRadius: "var(--r-sm)",
            background: "transparent", color: "var(--text-muted)",
            cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
            fontFamily: "inherit", transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--red-bg)"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--red-border)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          <FaSignOutAlt size={12} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
