import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { getUser, clearSession } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaBars, FaTimes, FaSignOutAlt, FaUser,
} from "react-icons/fa";

/**
 * Shell for all authenticated pages.
 *
 * - Sidebar starts HIDDEN.
 * - A fixed top bar contains the ☰ hamburger button, brand, and user actions.
 * - Clicking ☰ slides the sidebar in from the left.
 * - A dark overlay closes it when clicked.
 * - ESC key also closes it.
 */
function AppLayout({ children }) {
  const [open,    setOpen]    = useState(false);
  const navigate              = useNavigate();
  const user                  = getUser();
  const { pathname }          = useLocation();

  // Close sidebar on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Body scroll lock when sidebar open
  useEffect(() => {
    if (open) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [open]);

  // ESC to close
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleLogout = () => { clearSession(); navigate("/login"); };

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/reminders": "Reminders",
    "/calendar":  "Calendar",
    "/add":       "Add Medicine",
    "/history":   "History",
    "/notes":     "Health Notes",
    "/profile":   "Profile",
    "/home":      "Home",
  }[pathname] || "MediTrack";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── Overlay (closes sidebar when clicking outside) ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 199,
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* ── Sidebar (slides in from left) ── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        height: "100vh",
        zIndex: 200,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        willChange: "transform",
      }}>
        {/* Close button sitting on the sidebar edge */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            style={{
              position: "absolute",
              top: 18, right: -14,
              width: 28, height: 28,
              borderRadius: "50%",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-muted)",
              boxShadow: "var(--shadow-md)",
              zIndex: 1,
            }}
          >
            <FaTimes size={11} />
          </button>
        )}
        <Sidebar />
      </div>

      {/* ── Top Bar ── */}
      <header style={{
        position: "sticky",
        top: 0, zIndex: 100,
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-xs)",
        gap: 16,
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          style={{
            width: 38, height: 38,
            border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)",
            background: open ? "var(--blue-muted)" : "var(--bg-subtle)",
            color: open ? "var(--blue)" : "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s, color 0.15s",
          }}
        >
          <FaBars size={15} />
        </button>

        {/* Brand */}
        <Link to="/home" style={{
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none", flexShrink: 0,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "var(--r-sm)",
            background: "var(--blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem",
          }}>
            💊
          </div>
          <span style={{
            fontWeight: 800, fontSize: "0.95rem",
            color: "var(--text-heading)", letterSpacing: "-0.02em",
          }}>
            MediTrack
          </span>
        </Link>

        {/* Page title */}
        <span style={{
          fontSize: "0.82rem", fontWeight: 600,
          color: "var(--text-muted)",
          borderLeft: "1px solid var(--border)",
          paddingLeft: 14,
          display: window.innerWidth > 480 ? "block" : "none",
        }}>
          {pageTitle}
        </span>

        {/* Right side actions */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
          <NotificationBell />

          {/* Avatar + name chip */}
          <Link to="/profile" style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "5px 10px 5px 5px",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-full)",
            background: "var(--bg-subtle)",
            textDecoration: "none",
            transition: "box-shadow 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--blue), #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.72rem", color: "white", flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span style={{
              fontSize: "0.8rem", fontWeight: 600,
              color: "var(--text-heading)",
              maxWidth: 100,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              width: 34, height: 34,
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              background: "transparent",
              color: "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--red-bg)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <FaSignOutAlt size={13} />
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      <main style={{
        padding: "28px 32px 60px",
        maxWidth: 1280,
        margin: "0 auto",
      }}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
