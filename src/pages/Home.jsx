import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaBell, FaChartBar, FaCalendarAlt, FaPills,
  FaShieldAlt, FaMobile, FaTwitter, FaGithub,
  FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

/* ── Unsplash medical hero image ── */
const HERO_IMG = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=80&auto=format&fit=crop";
const ABOUT_IMG = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop";

const features = [
  { icon: <FaBell />,        title: "Smart Reminders",    desc: "Get notified by SMS and email the moment it's time to take your medicine.",  accent: "#2563eb" },
  { icon: <FaChartBar />,    title: "Adherence Tracking", desc: "Visualise weekly completion rates with easy-to-read interactive charts.",    accent: "#7c3aed" },
  { icon: <FaCalendarAlt />, title: "Calendar View",      desc: "Browse your entire medication schedule across any month at a glance.",        accent: "#0891b2" },
  { icon: <FaPills />,       title: "Medicine Log",       desc: "Log every medicine with dosage, category, frequency and priority.",           accent: "#16a34a" },
  { icon: <FaShieldAlt />,   title: "Secure & Private",   desc: "Health data protected with JWT authentication and encrypted passwords.",      accent: "#d97706" },
  { icon: <FaMobile />,      title: "SMS Notifications",  desc: "Real-time SMS alerts sent to your phone at the exact scheduled time.",        accent: "#dc2626" },
];

const steps = [
  { num: "01", title: "Create your account",  desc: "Sign up with your name, email, and phone number in under 60 seconds." },
  { num: "02", title: "Add your medicines",   desc: "Enter name, dosage, schedule, category, and priority for each medicine." },
  { num: "03", title: "Receive reminders",    desc: "Get SMS and email alerts precisely at the scheduled time every day." },
];

const testimonials = [
  { name: "Sarah M.",  role: "Diabetes patient",  text: "MediTrack changed my life. I used to forget my insulin doses regularly — not anymore." },
  { name: "Dr. James", role: "Cardiologist",       text: "I recommend MediTrack to all my patients. The adherence tracking is genuinely useful." },
  { name: "Aisha T.",  role: "Caregiver",          text: "Managing medications for my elderly mother became so much easier with this system." },
];

const footerLinks = {
  Product:  [{ label: "Dashboard",  to: "/dashboard" }, { label: "Reminders", to: "/reminders" }, { label: "Calendar", to: "/calendar" }, { label: "Add Medicine", to: "/add" }, { label: "History", to: "/history" }],
  Account:  [{ label: "Register",   to: "/register"  }, { label: "Login",     to: "/login"     }, { label: "Profile",  to: "/profile"  }],
  Support:  [{ label: "About Us",   to: "#about"     }, { label: "Contact",   to: "#contact"   }, { label: "Privacy Policy", to: "#privacy" }, { label: "Terms of Service", to: "#terms" }],
};

function Home() {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>

      {/* ─── NAVBAR ─── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, padding: "12px 32px" }}>
        <Navbar />
      </div>

      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.35)",
        }} />

        {/* Blue gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(37,99,235,0.7) 0%, rgba(15,23,42,0.85) 60%)",
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: 1140, margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--r-full)", padding: "6px 16px",
              fontSize: "0.78rem", fontWeight: 600, color: "white",
              marginBottom: 28, letterSpacing: "0.04em",
              backdropFilter: "blur(8px)",
            }}>
              💊 Smart Medicine Reminder System
            </div>

            <h1 style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              fontWeight: 800, color: "white",
              letterSpacing: "-0.04em", lineHeight: 1.1,
              margin: "0 0 20px",
            }}>
              Never miss a dose.<br />
              <span style={{ color: "#93c5fd" }}>Stay healthy.</span>
            </h1>

            <p style={{
              fontSize: "1.05rem", color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7, margin: "0 0 36px", maxWidth: 500,
            }}>
              MediTrack sends SMS and email reminders at the exact time your
              medicine is scheduled — so you can focus on living, not remembering.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/register" style={{
                display: "inline-flex", alignItems: "center",
                padding: "13px 30px", borderRadius: "var(--r-md)",
                background: "var(--blue)", color: "white",
                fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Get started free →
              </Link>
              <Link to="/login" style={{
                display: "inline-flex", alignItems: "center",
                padding: "13px 30px", borderRadius: "var(--r-md)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "white", fontWeight: 600, fontSize: "0.95rem",
                textDecoration: "none", backdropFilter: "blur(4px)",
                background: "rgba(255,255,255,0.08)",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                Sign in
              </Link>
            </div>

            {/* Trust strip */}
            <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
              {["Free to use", "SMS + Email alerts", "Secure JWT auth"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.65)", fontSize: "0.8rem" }}>
                  <FaCheckCircle style={{ color: "#4ade80", flexShrink: 0 }} size={12} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating stats card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--r-xl)",
              padding: "32px",
              width: "100%", maxWidth: 360,
              color: "white",
            }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7, margin: "0 0 20px" }}>
                Your Health Dashboard
              </p>
              {[
                { label: "Medicines Tracked",  val: "—",    color: "#93c5fd" },
                { label: "Reminders Sent",     val: "—",    color: "#86efac" },
                { label: "Adherence Rate",     val: "—%",   color: "#fde68a" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "0.88rem", opacity: 0.85 }}>{label}</span>
                  <span style={{ fontWeight: 800, fontSize: "1.15rem", color }}>{val}</span>
                </div>
              ))}
              <Link to="/register" style={{
                display: "block", marginTop: 20, textAlign: "center",
                padding: "11px", borderRadius: "var(--r-md)",
                background: "white", color: "var(--blue)",
                fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
              }}>
                Start tracking →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue)", marginBottom: 10 }}>How it works</p>
          <h2 style={{ textAlign: "center", fontSize: "1.9rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", marginBottom: 52 }}>
            Up and running in 3 steps
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            {steps.map(({ num, title, desc }) => (
              <div key={num} style={{ display: "flex", gap: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "var(--r-sm)",
                  background: "var(--blue-muted)", border: "1px solid var(--blue-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.82rem", color: "var(--blue)",
                  flexShrink: 0, marginTop: 2,
                }}>
                  {num}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-heading)", margin: "0 0 6px" }}>{title}</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SPLIT ─── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue)", marginBottom: 10 }}>About MediTrack</p>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 20 }}>
              Built for patients, caregivers, and healthcare professionals
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 18, fontSize: "0.95rem" }}>
              MediTrack was designed with a single mission: to make medication adherence effortless.
              Whether you're managing a chronic condition, caring for a family member, or simply
              trying to stay on top of supplements — MediTrack keeps you on schedule.
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: "0.95rem" }}>
              Our notification engine sends real-time SMS and email alerts so you never miss
              a dose, no matter where you are.
            </p>
            <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
              {[{ val: "10k+", label: "Active Users" }, { val: "99.9%", label: "Uptime" }, { val: "2M+", label: "Reminders Sent" }].map(({ val, label }) => (
                <div key={label}>
                  <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--blue)", margin: "0 0 2px", letterSpacing: "-0.03em" }}>{val}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img
              src={ABOUT_IMG}
              alt="Healthcare professional"
              style={{ width: "100%", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-xl)", objectFit: "cover", height: 380 }}
            />
            <div style={{
              position: "absolute", bottom: -16, left: -16,
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "14px 18px",
              boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--green-bg)", border: "1px solid var(--green-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>✅</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-heading)", margin: 0 }}>Dose taken!</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>Paracetamol · 8:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ background: "var(--bg-subtle)", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue)", marginBottom: 10 }}>Features</p>
          <h2 style={{ textAlign: "center", fontSize: "1.9rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", marginBottom: 48 }}>
            Everything you need to stay on track
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {features.map(({ icon, title, desc, accent }) => (
              <div key={title}
                className="card-hover"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "26px 24px", boxShadow: "var(--shadow-xs)" }}>
                <div style={{ width: 42, height: 42, borderRadius: "var(--r-sm)", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: accent, fontSize: "1.05rem", marginBottom: 16 }}>
                  {icon}
                </div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-heading)", margin: "0 0 7px" }}>{title}</p>
                <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 32px" }}>
        <p style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--blue)", marginBottom: 10 }}>Testimonials</p>
        <h2 style={{ textAlign: "center", fontSize: "1.9rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", marginBottom: 48 }}>
          Trusted by thousands
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map(({ name, role, text }) => (
            <div key={name} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "26px 24px", boxShadow: "var(--shadow-xs)" }}>
              <p style={{ fontSize: "1.2rem", color: "#fbbf24", margin: "0 0 12px" }}>★★★★★</p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-body)", lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic" }}>"{text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue-muted)", border: "1px solid var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--blue)", fontSize: "0.85rem" }}>
                  {name[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-heading)", margin: 0 }}>{name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", margin: 0 }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{
        margin: "0 32px 80px", borderRadius: "var(--r-xl)",
        background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
        padding: "60px 48px", textAlign: "center",
        boxShadow: "0 12px 40px rgba(37,99,235,0.35)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -30, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", margin: "0 0 14px" }}>
            Ready to take control of your health?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: "0 auto 32px", maxWidth: 480, fontSize: "0.95rem", lineHeight: 1.65 }}>
            Join thousands of users who never miss a dose. It's free, fast, and takes less than a minute to get started.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ display: "inline-flex", alignItems: "center", padding: "13px 32px", borderRadius: "var(--r-md)", background: "white", color: "var(--blue)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              Create free account →
            </Link>
            <Link to="/login" style={{ display: "inline-flex", alignItems: "center", padding: "13px 32px", borderRadius: "var(--r-md)", border: "1.5px solid rgba(255,255,255,0.4)", color: "white", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#0f172a", color: "#94a3b8" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "60px 32px 0" }}>

          {/* Top grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 52 }}>

            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: "var(--r-sm)", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>💊</div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "white", letterSpacing: "-0.02em" }}>MediTrack Pro</span>
              </div>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
                Your smart medicine reminder system. Stay healthy, stay on schedule, and never miss a dose again.
              </p>
              {/* Contact */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: <FaEnvelope size={12} />, text: "support@meditrack.app" },
                  { icon: <FaPhone size={12} />,    text: "+1 (800) MEDI-TRACK" },
                  { icon: <FaMapMarkerAlt size={12} />, text: "San Francisco, CA, USA" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
                    <span style={{ color: "#475569" }}>{icon}</span> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <p style={{ fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "white", marginBottom: 14 }}>
                  {section}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link to={to} style={{ fontSize: "0.86rem", color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#93c5fd"}
                        onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #1e293b", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: "0.8rem", margin: 0 }}>
              © {new Date().getFullYear()} MediTrack Pro. All rights reserved.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {[
                { icon: <FaTwitter size={15} />, href: "#twitter",  label: "Twitter"  },
                { icon: <FaGithub  size={15} />, href: "#github",   label: "GitHub"   },
                { icon: <FaLinkedin size={15}/>, href: "#linkedin", label: "LinkedIn" },
              ].map(({ icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  style={{ color: "#475569", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#93c5fd"}
                  onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                >
                  {icon}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: "0.78rem" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(t => (
                <a key={t} href="#" style={{ color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#93c5fd"}
                  onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
