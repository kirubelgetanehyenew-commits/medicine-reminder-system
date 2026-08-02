import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { medicinesAPI, getUser } from "../services/api";
import {
  FaPills, FaCheckCircle, FaClock, FaPlus,
  FaBell, FaCalendarAlt, FaStickyNote, FaHistory,
  FaArrowRight, FaHeartbeat, FaShieldAlt, FaTrophy,
} from "react-icons/fa";

const HERO_BG = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&auto=format&fit=crop";
const DOCTOR_IMG = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80&auto=format&fit=crop";

const HEALTH_TIPS = [
  "Take your medication at the same time every day to build a consistent habit.",
  "Set a daily alarm as a backup reminder alongside MediTrack notifications.",
  "Never skip a dose — if you miss one, take it as soon as you remember.",
  "Store medicines in a cool, dry place away from direct sunlight.",
  "Always finish your full course of antibiotics, even if you feel better.",
  "Keep a list of all your medications and share it with your doctor.",
  "Drink a full glass of water with most oral medications.",
];

function getTip() {
  const day = new Date().getDay();
  return HEALTH_TIPS[day % HEALTH_TIPS.length];
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const quickLinks = [
  { to: "/add",       icon: <FaPlus size={18} />,        label: "Add Medicine",  desc: "Schedule a new medication",       color: "#2563eb", bg: "rgba(37,99,235,0.1)"   },
  { to: "/reminders", icon: <FaBell size={18} />,        label: "Reminders",     desc: "View all your reminders",          color: "#7c3aed", bg: "rgba(124,58,237,0.1)"  },
  { to: "/calendar",  icon: <FaCalendarAlt size={18} />, label: "Calendar",      desc: "Browse your schedule",             color: "#0891b2", bg: "rgba(8,145,178,0.1)"   },
  { to: "/notes",     icon: <FaStickyNote size={18} />,  label: "Health Notes",  desc: "Journal your health observations", color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
  { to: "/history",   icon: <FaHistory size={18} />,     label: "History",       desc: "See your full medicine log",       color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  { to: "/profile",   icon: <FaShieldAlt size={18} />,   label: "Profile",       desc: "Manage your account settings",     color: "#64748b", bg: "rgba(100,116,139,0.1)" },
];

const features = [
  { icon: <FaBell size={20} />,       title: "Real-time Reminders",   desc: "SMS and email alerts sent at the exact scheduled minute — never late.", color: "#2563eb" },
  { icon: <FaHeartbeat size={20} />,  title: "Adherence Tracking",    desc: "Measure your consistency week-over-week with clear visual charts.",       color: "#dc2626" },
  { icon: <FaTrophy size={20} />,     title: "Smart Dose Tracker",    desc: "Mark doses taken, track pills remaining and get refill alerts early.",   color: "#d97706" },
  { icon: <FaShieldAlt size={20} />,  title: "Secure & Private",      desc: "Your data is protected with JWT authentication and password hashing.",   color: "#16a34a" },
];

export default function AppHome() {
  const user = getUser();
  const [stats,   setStats]   = useState({ total: 0, completed: 0, pending: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicinesAPI.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tip = getTip();

  return (
    <AppLayout>

      {/* ══ HERO BANNER ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        borderRadius: "var(--r-xl)",
        overflow: "hidden",
        minHeight: 340,
        display: "flex",
        alignItems: "center",
        marginBottom: 28,
      }}>
        {/* Photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          filter: "brightness(0.35)",
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(120deg, rgba(37,99,235,0.82) 0%, rgba(124,58,237,0.65) 60%, rgba(0,0,0,0.4) 100%)",
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 2,
          padding: "48px 52px",
          maxWidth: 700,
        }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "var(--r-full)",
            padding: "5px 14px", fontSize: "0.75rem",
            fontWeight: 600, color: "white",
            letterSpacing: "0.04em", marginBottom: 20,
            backdropFilter: "blur(8px)",
          }}>
            💊 MediTrack Pro
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 900, color: "white",
            letterSpacing: "-0.04em", lineHeight: 1.15,
            margin: "0 0 14px",
          }}>
            {getGreeting()},<br />
            <span style={{ color: "#93c5fd" }}>
              {user?.name?.split(" ")[0] || "there"} 👋
            </span>
          </h1>

          <p style={{
            fontSize: "1rem", color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7, margin: "0 0 28px", maxWidth: 480,
          }}>
            Welcome back to your personal health dashboard. Track your medications,
            record doses, and never miss a reminder.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/dashboard" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 24px", borderRadius: "var(--r-md)",
              background: "white", color: "var(--blue)",
              fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              View Dashboard <FaArrowRight size={11} />
            </Link>
            <Link to="/add" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 24px", borderRadius: "var(--r-md)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              color: "white", fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(4px)",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <FaPlus size={11} /> Add Medicine
            </Link>
          </div>
        </div>

        {/* Floating stats card */}
        <div style={{
          position: "absolute", right: 48, top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "var(--r-xl)",
          padding: "24px 28px",
          minWidth: 220,
          display: window.innerWidth < 900 ? "none" : "flex",
          flexDirection: "column", gap: 14,
          zIndex: 2,
        }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            Your Stats
          </p>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>Loading…</p>
          ) : [
            { label: "Total Medicines", val: stats.total,             icon: <FaPills size={13} />,       color: "#93c5fd" },
            { label: "Completed",       val: stats.completed,         icon: <FaCheckCircle size={13} />, color: "#86efac" },
            { label: "Pending",         val: stats.pending,           icon: <FaClock size={13} />,       color: "#fde68a" },
            { label: "Success Rate",    val: `${stats.successRate}%`, icon: <FaTrophy size={13} />,      color: "#f9a8d4" },
          ].map(({ label, val, icon, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ color, opacity: 0.9 }}>{icon}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem" }}>{label}</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color, letterSpacing: "-0.02em" }}>{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HEALTH TIP BANNER ════════════════════════════════════ */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        background: "linear-gradient(135deg, var(--blue-muted), rgba(124,58,237,0.06))",
        border: "1px solid var(--blue-light)",
        borderRadius: "var(--r-lg)", padding: "16px 22px",
        marginBottom: 28,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "var(--r-sm)",
          background: "var(--blue)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
        }}>
          <span style={{ fontSize: "1.1rem" }}>💡</span>
        </div>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>
            Health Tip of the Day
          </p>
          <p style={{ color: "var(--text-body)", fontSize: "0.9rem", margin: 0, lineHeight: 1.55 }}>
            {tip}
          </p>
        </div>
      </div>

      {/* ══ QUICK LINKS GRID ═════════════════════════════════════ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.02em", margin: 0 }}>
              Quick Access
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "3px 0 0" }}>
              Jump to any section instantly
            </p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 14,
        }}>
          {quickLinks.map(({ to, icon, label, desc, color, bg }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex", flexDirection: "column", gap: 12,
                padding: "20px 18px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                textDecoration: "none",
                boxShadow: "var(--shadow-xs)",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                e.currentTarget.style.borderColor = color;
                e.currentTarget.querySelector(".ql-icon").style.background = color;
                e.currentTarget.querySelector(".ql-icon").style.color = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.querySelector(".ql-icon").style.background = bg;
                e.currentTarget.querySelector(".ql-icon").style.color = color;
              }}
            >
              <div className="ql-icon" style={{
                width: 44, height: 44,
                borderRadius: "var(--r-sm)",
                background: bg, color: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.18s, color 0.18s",
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-heading)", margin: "0 0 3px" }}>
                  {label}
                </p>
                <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ ABOUT + DOCTOR IMAGE SPLIT ═══════════════════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 28,
      }}>
        {/* Left — text */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          padding: "32px 32px",
          boxShadow: "var(--shadow-xs)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--blue)", margin: "0 0 10px" }}>
            About MediTrack
          </p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", lineHeight: 1.25, margin: "0 0 14px" }}>
            Your health, always on schedule
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.75, margin: "0 0 20px" }}>
            MediTrack was built to eliminate the risk of missed doses. Whether you're
            managing a chronic condition, supporting a family member, or keeping on top
            of vitamins — we've got you covered with real-time SMS and email reminders.
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { val: "10k+", label: "Users" },
              { val: "2M+",  label: "Reminders" },
              { val: "99.9%",label: "Uptime" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--blue)", margin: "0 0 2px", letterSpacing: "-0.03em" }}>{val}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div style={{ position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden", minHeight: 260 }}>
          <img
            src={DOCTOR_IMG}
            alt="Healthcare"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 50%)",
          }} />
          <div style={{
            position: "absolute", bottom: 20, left: 20,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            borderRadius: "var(--r-md)",
            padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green-bg)", border: "2px solid var(--green-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>✅</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-heading)", margin: 0 }}>Dose taken!</p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>Paracetamol · just now</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FEATURES ROW ═════════════════════════════════════════ */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          What MediTrack does for you
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {features.map(({ icon, title, desc, color }) => (
            <div key={title} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "22px 20px",
              boxShadow: "var(--shadow-xs)",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
              className="card-hover"
            >
              <div style={{
                width: 40, height: 40, borderRadius: "var(--r-sm)",
                background: "var(--bg-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color, marginBottom: 14,
              }}>
                {icon}
              </div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-heading)", margin: "0 0 6px" }}>{title}</p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA FOOTER BANNER ════════════════════════════════════ */}
      <div style={{
        borderRadius: "var(--r-xl)",
        background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
        padding: "40px 44px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 24, flexWrap: "wrap",
        boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 8px" }}>
            Ready to stay on schedule?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", margin: 0 }}>
            Add your first medicine and start receiving reminders today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexShrink: 0, zIndex: 1 }}>
          <Link to="/add" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "11px 24px", borderRadius: "var(--r-md)",
            background: "white", color: "var(--blue)",
            fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transition: "transform 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <FaPlus size={11} /> Add Medicine
          </Link>
          <Link to="/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "11px 24px", borderRadius: "var(--r-md)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            color: "white", fontWeight: 600, fontSize: "0.9rem",
            textDecoration: "none", background: "rgba(255,255,255,0.1)",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            Dashboard <FaArrowRight size={11} />
          </Link>
        </div>
      </div>

    </AppLayout>
  );
}
