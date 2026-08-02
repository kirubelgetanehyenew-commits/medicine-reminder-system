import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, saveSession } from "../services/api";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";

const BG = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1400&q=80&auto=format&fit=crop";

function Login() {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authAPI.login(form);
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const lbl = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
  const ico = { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left panel: image ── */}
      <div style={{
        flex: 1, display: "none",
        position: "relative", overflow: "hidden",
        ...(window.innerWidth > 900 ? { display: "block" } : {}),
      }}
        className="auth-image-panel"
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.45)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, rgba(37,99,235,0.75), rgba(15,23,42,0.8))",
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>💊</div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "white" }}>MediTrack Pro</span>
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 16px" }}>
            Welcome back.<br />Your health matters.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Sign in to view your medicine schedule, track your adherence, and manage your reminders.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
            {["SMS & Email reminders at scheduled time", "Full medicine history & analytics", "Calendar view of all your medications"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}>
                <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "var(--bg-page)" }}>

        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 500, textDecoration: "none", marginBottom: 40 }}>
          <FaArrowLeft size={11} /> Back to home
        </Link>

        <div style={{ marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: "var(--r-md)", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 16 }}>💊</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", margin: "0 0 6px" }}>Sign in</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Enter your credentials to access your account.</p>
        </div>

        {error && (
          <div style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "var(--r-sm)", padding: "11px 14px", marginBottom: 20, fontSize: "0.86rem", color: "var(--red)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Email Address</label>
            <div style={{ position: "relative" }}>
              <FaEnvelope size={13} style={ico} />
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ ...lbl, marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: "0.75rem", color: "var(--blue)", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
            </div>
            <div style={{ position: "relative" }}>
              <FaLock size={13} style={ico} />
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
          </div>

          <button type="submit" className="add-btn" disabled={loading} style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
