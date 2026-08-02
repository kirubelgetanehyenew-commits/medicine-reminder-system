import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaBell, FaChartBar, FaCalendarAlt, FaPills, FaShieldAlt, FaMobile } from "react-icons/fa";

const features = [
  { icon: <FaBell />,        title: "Smart Reminders",  desc: "Get notified by SMS and email exactly when it's time to take your medicine.",     accent: "var(--blue)"  },
  { icon: <FaChartBar />,    title: "Adherence Tracking",desc: "Visualise your weekly completion rate with clear, easy-to-read charts.",          accent: "#7c3aed"      },
  { icon: <FaCalendarAlt />, title: "Calendar View",    desc: "Browse your entire medication schedule across any month at a glance.",             accent: "#0891b2"      },
  { icon: <FaPills />,       title: "Medicine Log",     desc: "Log every medicine with dosage, category, frequency, and priority.",               accent: "var(--green)" },
  { icon: <FaShieldAlt />,   title: "Secure & Private", desc: "Your health data is stored securely with JWT authentication.",                     accent: "var(--amber)" },
  { icon: <FaMobile />,      title: "SMS Notifications",desc: "Real-time SMS alerts sent to your phone at the exact scheduled time.",             accent: "var(--red)"   },
];

const steps = [
  { num: "01", title: "Create your account", desc: "Sign up with your name, email, and phone number." },
  { num: "02", title: "Add your medicines",  desc: "Enter the name, dosage, schedule, and priority." },
  { num: "03", title: "Receive reminders",   desc: "Get SMS and email alerts precisely on schedule."  },
];

function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 24px 0" }}>
        <Navbar />
      </div>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 24px 80px", textAlign: "center" }}>

        {/* Eyebrow pill */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "var(--blue-muted)", border: "1px solid var(--blue-light)",
            borderRadius: "var(--r-full)",
            padding: "6px 16px",
            fontSize: "0.78rem", fontWeight: 600,
            color: "var(--blue)", marginBottom: 28,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>💊</span>
          Smart Medicine Reminder System
        </div>

        <h1
          style={{
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            fontWeight: 800,
            color: "var(--text-heading)",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: "0 auto 22px",
            maxWidth: 760,
          }}
        >
          Never miss a dose.{" "}
          <span className="gradient-text">Stay healthy.</span>
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          MediTrack sends you SMS and email reminders at the exact time your
          medicine is scheduled — so you can focus on living, not remembering.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="primary-btn" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
            Get started free →
          </Link>
          <Link
            to="/login"
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "12px 28px", borderRadius: "var(--r-md)",
              border: "1.5px solid var(--border)",
              color: "var(--text-heading)", textDecoration: "none",
              fontWeight: 600, fontSize: "0.95rem",
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-xs)",
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-xs)"}
          >
            Sign in
          </Link>
        </div>

        {/* Social proof strip */}
        <p style={{ color: "var(--text-subtle)", fontSize: "0.8rem", marginTop: 28 }}>
          ✓ Free to use &nbsp;·&nbsp; ✓ SMS + Email alerts &nbsp;·&nbsp; ✓ Secure JWT auth
        </p>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue)", marginBottom: 12 }}>
            How it works
          </p>
          <h2 style={{ textAlign: "center", fontSize: "1.7rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", marginBottom: 48 }}>
            Up and running in 3 steps
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {steps.map(({ num, title, desc }) => (
              <div key={num} style={{ display: "flex", gap: 16 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: "var(--r-sm)",
                    background: "var(--blue-muted)", border: "1px solid var(--blue-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.8rem", color: "var(--blue)",
                    flexShrink: 0, marginTop: 2,
                  }}
                >
                  {num}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-heading)", margin: "0 0 5px" }}>{title}</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 24px 80px" }}>
        <p style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue)", marginBottom: 12 }}>
          Features
        </p>
        <h2 style={{ textAlign: "center", fontSize: "1.7rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", marginBottom: 40 }}>
          Everything you need to stay on track
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map(({ icon, title, desc, accent }) => (
            <div
              key={title}
              className="card-hover"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                padding: "24px 22px",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: "var(--r-sm)",
                  background: "var(--bg-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: accent, fontSize: "1rem", marginBottom: 14,
                }}
              >
                {icon}
              </div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-heading)", margin: "0 0 6px" }}>
                {title}
              </p>
              <p style={{ fontSize: "0.855rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          background: "var(--blue)", margin: "0 24px 60px",
          maxWidth: 1092, marginLeft: "auto", marginRight: "auto",
          borderRadius: "var(--r-xl)", padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
        }}
      >
        <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          Ready to take control of your health?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", margin: "0 auto 28px", maxWidth: 460, fontSize: "0.95rem", lineHeight: 1.6 }}>
          Join MediTrack today and never miss another dose.
        </p>
        <Link
          to="/register"
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "12px 32px", borderRadius: "var(--r-md)",
            background: "white", color: "var(--blue)",
            fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; }}
        >
          Create free account →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--text-subtle)",
        }}
      >
        © {new Date().getFullYear()} MediTrack · Built with care for your health 💙
      </footer>
    </div>
  );
}

export default Home;
