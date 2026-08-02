import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { isLoggedIn } from "../services/api";

/**
 * Public top navbar — shown only on Home, Login, Register.
 * Authenticated inner pages use the Sidebar exclusively.
 */
function Navbar() {
  const { pathname } = useLocation();
  const loggedIn     = isLoggedIn();

  const linkStyle = (path) => ({
    padding: "6px 13px",
    borderRadius: "var(--r-sm)",
    fontWeight: pathname === path ? 600 : 500,
    fontSize: "0.875rem",
    color: pathname === path ? "var(--blue)" : "var(--text-muted)",
    background: pathname === path ? "var(--blue-muted)" : "transparent",
    textDecoration: "none",
    transition: "background 0.15s, color 0.15s",
  });

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "13px 20px",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      boxShadow: "var(--shadow-xs)",
    }}>

      {/* Brand */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "var(--r-sm)",
          background: "var(--blue)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.9rem",
        }}>
          💊
        </div>
        <span style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
          MediTrack <span style={{ fontWeight: 400, color: "var(--text-subtle)", fontSize: "0.78rem" }}>Pro</span>
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Link to="/"      style={linkStyle("/")}>Home</Link>
        <Link to="/login" style={linkStyle("/login")}>Login</Link>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ThemeToggle />
        {loggedIn ? (
          <Link to="/dashboard" style={{
            padding: "7px 16px", borderRadius: "var(--r-md)",
            background: "var(--blue)", color: "white",
            textDecoration: "none", fontWeight: 600, fontSize: "0.85rem",
            boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
          }}>
            Dashboard →
          </Link>
        ) : (
          <Link to="/register" style={{
            padding: "7px 16px", borderRadius: "var(--r-md)",
            background: "var(--blue)", color: "white",
            textDecoration: "none", fontWeight: 600, fontSize: "0.85rem",
            boxShadow: "0 1px 4px rgba(37,99,235,0.3)",
          }}>
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
