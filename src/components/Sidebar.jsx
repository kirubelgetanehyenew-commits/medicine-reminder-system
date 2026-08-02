import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaTachometerAlt, FaBell,
  FaCalendarAlt, FaPlusCircle,
} from "react-icons/fa";

const navItems = [
  { to: "/",          icon: <FaHome />,          label: "Home"         },
  { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard"    },
  { to: "/reminders", icon: <FaBell />,           label: "Reminders"    },
  { to: "/calendar",  icon: <FaCalendarAlt />,    label: "Calendar"     },
  { to: "/add",       icon: <FaPlusCircle />,     label: "Add Medicine" },
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span style={{ fontSize: "1rem" }}>💊</span>
        </div>
        <span className="sidebar-logo-text">MediTrack</span>
      </div>

      {/* Nav label */}
      <p className="sidebar-section-label">Navigation</p>

      {/* Links */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${pathname === to ? "active" : ""}`}
          >
            <span className="sidebar-link-icon">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--text-subtle)",
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        >
          MediTrack · v1.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
