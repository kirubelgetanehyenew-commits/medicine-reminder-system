import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTachometerAlt, FaBell, FaCalendarAlt, FaPlusCircle } from "react-icons/fa";

const navItems = [
  { to: "/",          icon: <FaHome />,            label: "Home"        },
  { to: "/dashboard", icon: <FaTachometerAlt />,   label: "Dashboard"   },
  { to: "/reminders", icon: <FaBell />,             label: "Reminders"   },
  { to: "/calendar",  icon: <FaCalendarAlt />,      label: "Calendar"    },
  { to: "/add",       icon: <FaPlusCircle />,        label: "Add Medicine"},
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: "1.5rem" }}>💊</span>
        <span className="gradient-text">MediTrack</span>
      </div>

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

      <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
          MediTrack v1.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
