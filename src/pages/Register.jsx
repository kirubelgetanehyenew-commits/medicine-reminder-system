import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, saveSession } from "../services/api";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaArrowLeft } from "react-icons/fa";

const BG = "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1400&q=80&auto=format&fit=crop";

function Register() {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState({});
  const [apiError,setApiError]= useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(p   => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name     = "Name is required.";
    if (!form.email.trim())   e.email    = "Email is required.";
    if (!form.phone.trim())   e.phone    = "Phone number is required.";
    else if (!/^\+?[1-9]\d{6,14}$/.test(form.phone.trim()))
                              e.phone    = "Include country code, e.g. +12345678901";
    if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await authAPI.register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password });
      saveSession(data);
      navigate("/home");
    } catch (err) {
      setApiError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  const lbl = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
  const ico = { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" };
  const err = (k) => errors[k] ? <p style={{ color: "var(--red)", fontSize: "0.74rem", margin: "5px 0 0" }}>{errors[k]}</p> : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left: image ── */}
      <div className="auth-image-panel" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.38)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(124,58,237,0.7), rgba(15,23,42,0.85))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>💊</div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "white" }}>MediTrack Pro</span>
          </div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 14px" }}>
            Join thousands who stay on schedule.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.93rem", lineHeight: 1.7, marginBottom: 28 }}>
            Create your free account in under a minute and start receiving reminders today.
          </p>
          <div style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "var(--r-lg)", padding: "18px 20px",
            backdropFilter: "blur(10px)",
          }}>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Daily Tip</p>
            <p style={{ color: "white", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              "Consistency in medication is the foundation of long-term health. Small daily habits build lasting wellness."
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div style={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "var(--bg-page)", overflowY: "auto" }}>

        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 500, textDecoration: "none", marginBottom: 36 }}>
          <FaArrowLeft size={11} /> Back to home
        </Link>

        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: "var(--r-md)", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 14 }}>💊</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", margin: "0 0 6px" }}>Create account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Fill in your details. You'll receive reminders on email and phone.</p>
        </div>

        {/* SMS info banner */}
        <div style={{ background: "var(--blue-muted)", border: "1px solid var(--blue-light)", borderRadius: "var(--r-sm)", padding: "11px 14px", marginBottom: 20, fontSize: "0.82rem", color: "var(--blue)", display: "flex", gap: 8 }}>
          <span>📱</span>
          <span>We'll send medicine reminders to your <strong>email</strong> and <strong>phone</strong> at the scheduled time.</span>
        </div>

        {apiError && (
          <div style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "var(--r-sm)", padding: "11px 14px", marginBottom: 20, fontSize: "0.85rem", color: "var(--red)" }}>{apiError}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <div>
            <label style={lbl}>Full Name</label>
            <div style={{ position: "relative" }}>
              <FaUser size={12} style={ico} />
              <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
            {err("name")}
          </div>

          <div>
            <label style={lbl}>Email Address</label>
            <div style={{ position: "relative" }}>
              <FaEnvelope size={12} style={ico} />
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
            {err("email")}
          </div>

          <div>
            <label style={lbl}>Phone Number <span style={{ color: "var(--red)" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <FaPhone size={12} style={ico} />
              <input type="tel" name="phone" placeholder="+1 234 567 8901" value={form.phone} onChange={handleChange} className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", margin: "4px 0 0" }}>Include country code · +1 USA · +44 UK · +251 Ethiopia</p>
            {err("phone")}
          </div>

          <div>
            <label style={lbl}>Password</label>
            <div style={{ position: "relative" }}>
              <FaLock size={12} style={ico} />
              <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
            {err("password")}
          </div>

          <div>
            <label style={lbl}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <FaLock size={12} style={ico} />
              <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} className="modern-input" style={{ paddingLeft: 38 }} />
            </div>
            {err("confirm")}
          </div>

          <button type="submit" className="add-btn" disabled={loading} style={{ marginTop: 6, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 22, fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
