import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle     from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { isLoggedIn, clearSession, getUser } from "../services/api";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const loggedIn  = isLoggedIn();
  const user      = getUser();

  const handleLogout = () => { clearSession(); navigate("/login"); };

  const linkStyle = (path) => ({
    ...{},
    fontWeight: location.pathname === path ? 600 : 500,
    color: location.pathname === path
      ? "var(--blue)"
      : "var(--text-muted)",
    background: location.pathname === path
      ? "var(--blue-muted)"
      : "transparent",
  });

  return (
    <nav className="topnav">
      {/* Brand */}
      <div className="topnav-logo">
        <div
          style={{
            width: 28, height: 28, borderRadius: "var(--r-sm)",
            background: "var(--blue)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", flexShrink: 0,
          }}
        >
          💊
        </div>
        <span>MediTrack</span>
        <span
          style={{
            fontSize: "0.7rem", color: "var(--text-subtle)",
            fontWeight: 400, marginLeft: 2,
          }}
        >
          Pro
        </span>
      </div>

      {/* Links */}
      <div className="topnav-links">
        <Link to="/" className="topnav-link" style={linkStyle("/")}>Home</Link>
        {loggedIn && (
          <>
            <Link to="/dashboard" className="topnav-link" style={linkStyle("/dashboard")}>Dashboard</Link>
            <Link to="/reminders" className="topnav-link" style={linkStyle("/reminders")}>Reminders</Link>
            <Link to="/calendar"  className="topnav-link" style={linkStyle("/calendar")}>Calendar</Link>
            <Link to="/add"       className="topnav-link" style={linkStyle("/add")}>Add</Link>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="topnav-actions">
        <ThemeToggle />
        {loggedIn ? (
          <>
            <NotificationBell />

            {/* Avatar chip */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 10px 5px 6px",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-full)",
                background: "var(--bg-subtle)",
              }}
            >
              <div
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "var(--blue)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: "white",
                  flexShrink: 0,
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-heading)" }}>
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer", fontWeight: 500, fontSize: "0.82rem",
                fontFamily: "inherit",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--red-bg)"; e.currentTarget.style.color = "var(--red)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <FaSignOutAlt size={11} /> Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: "7px 18px", borderRadius: "var(--r-md)",
              background: "var(--blue)", color: "white",
              textDecoration: "none", fontWeight: 600, fontSize: "0.85rem",
              boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
              transition: "background 0.15s",
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
