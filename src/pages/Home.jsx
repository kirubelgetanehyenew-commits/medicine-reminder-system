import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaBell, FaChartBar, FaCalendarAlt, FaPills } from "react-icons/fa";

const features = [
  {
    icon: <FaBell size={28} />,
    title: "Smart Reminders",
    desc: "Never miss a dose with timely, customizable notifications.",
    color: "rgba(20,184,166,0.12)",
    border: "rgba(20,184,166,0.2)",
    iconColor: "#5eead4",
  },
  {
    icon: <FaChartBar size={28} />,
    title: "Analytics",
    desc: "Track your adherence trends with clear weekly charts.",
    color: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.2)",
    iconColor: "#a5b4fc",
  },
  {
    icon: <FaCalendarAlt size={28} />,
    title: "Calendar View",
    desc: "See all your medications laid out across the month.",
    color: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.2)",
    iconColor: "#fbbf24",
  },
  {
    icon: <FaPills size={28} />,
    title: "Medicine Log",
    desc: "Keep a full history of every medicine you've tracked.",
    color: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.2)",
    iconColor: "#f87171",
  },
];

function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "24px 32px" }}>
        <Navbar />
      </div>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "60px 24px 80px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(20,184,166,0.1)",
            border: "1px solid rgba(20,184,166,0.25)",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: "0.82rem",
            color: "var(--accent-light)",
            fontWeight: 600,
            marginBottom: 28,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          💊 Your personal health companion
        </div>

        <h1
          style={{
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: "0 auto 24px",
            maxWidth: 720,
          }}
        >
          Welcome to{" "}
          <span className="gradient-text">MediTrack</span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            maxWidth: 500,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Stay on top of your health. Schedule medicines, track completion,
          and build a consistent routine — all in one place.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/add"
            className="primary-btn"
            style={{ fontSize: "1rem", padding: "14px 32px" }}
          >
            Get Started →
          </Link>
          <Link
            to="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: 40,
            color: "var(--text-muted)",
            letterSpacing: "-0.01em",
          }}
        >
          Everything you need to stay healthy
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 20,
          }}
        >
          {features.map(({ icon, title, desc, color, border, iconColor }) => (
            <div
              key={title}
              className="card-hover"
              style={{
                background: color,
                border: `1px solid ${border}`,
                borderRadius: "var(--radius-lg)",
                padding: "28px 24px",
              }}
            >
              <div
                style={{
                  color: iconColor,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 52,
                  height: 52,
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 8, color: "var(--text-primary)" }}>
                {title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
