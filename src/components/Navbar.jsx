import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { isLoggedIn, clearSession, getUser } from "../services/api";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate   = useNavigate();
  const loggedIn   = isLoggedIn();
  const user       = getUser();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <nav className="topnav">
      <div className="topnav-logo">
        <span className="gradient-text">MediTrack Pro</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: 8 }}>
          Smart Medicine Reminder
        </span>
      </div>

      <div className="topnav-links">
        <Link to="/"          className="topnav-link">Home</Link>
        {loggedIn && (
          <>
            <Link to="/dashboard" className="topnav-link">Dashboard</Link>
            <Link to="/reminders" className="topnav-link">Reminders</Link>
            <Link to="/calendar"  className="topnav-link">Calendar</Link>
            <Link to="/add"       className="topnav-link">Add</Link>
          </>
        )}
      </div>

      <div className="topnav-actions">
        <ThemeToggle />
        {loggedIn ? (
          <>
            <NotificationBell />
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)",
                color: "#f87171", borderRadius: "var(--radius-sm)", padding: "7px 12px",
                cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
              }}
            >
              <FaSignOutAlt size={12} /> Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: "7px 16px", borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, var(--accent), var(--indigo))",
              color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem",
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
