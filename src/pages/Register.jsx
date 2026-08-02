import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, saveSession } from "../services/api";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaPills } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState({});
  const [apiError,setApiError]= useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p)   => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name     = "Name is required.";
    if (!form.email.trim()) errs.email    = "Email is required.";
    if (!form.phone.trim()) errs.phone    = "Phone number is required.";
    else if (!/^\+?[1-9]\d{6,14}$/.test(form.phone.trim()))
                            errs.phone    = "Enter a valid number with country code, e.g. +1234567890";
    if (form.password.length < 6)
                            errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm)
                            errs.confirm  = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await authAPI.register({
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        password: form.password,
      });
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "var(--text-muted)", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: 6,
  };

  const iconStyle = {
    position: "absolute", left: 14, top: "50%",
    transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
  };

  const errMsg = (key) => errors[key] ? (
    <p style={{ color: "#f87171", fontSize: "0.76rem", margin: "5px 0 0" }}>{errors[key]}</p>
  ) : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--accent), var(--indigo))", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <FaPills color="white" size={22} />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>
            <span className="gradient-text">MediTrack</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.9rem" }}>
            Create your account to get reminders
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: "32px 28px" }}>

          {apiError && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 20, fontSize: "0.88rem", color: "#f87171" }}>
              {apiError}
            </div>
          )}

          {/* Info banner */}
          <div style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: "var(--radius-sm)", padding: "11px 14px", marginBottom: 22, fontSize: "0.82rem", color: "var(--accent-light)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>📱</span>
            <span>We'll send medicine reminders to your <strong>email</strong> and <strong>phone number</strong> at the scheduled time.</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: "relative" }}>
                <FaUser style={iconStyle} size={13} />
                <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="modern-input" style={{ paddingLeft: 40 }} />
              </div>
              {errMsg("name")}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope style={iconStyle} size={13} />
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="modern-input" style={{ paddingLeft: 40 }} />
              </div>
              {errMsg("email")}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>
                Phone Number
                <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <FaPhone style={iconStyle} size={13} />
                <input type="tel" name="phone" placeholder="+1 234 567 8901" value={form.phone} onChange={handleChange} className="modern-input" style={{ paddingLeft: 40 }} />
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.74rem", margin: "5px 0 0" }}>
                Include country code (e.g. +1 for USA, +44 for UK, +251 for Ethiopia)
              </p>
              {errMsg("phone")}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <FaLock style={iconStyle} size={13} />
                <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className="modern-input" style={{ paddingLeft: 40 }} />
              </div>
              {errMsg("password")}
            </div>

            {/* Confirm */}
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <FaLock style={iconStyle} size={13} />
                <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} className="modern-input" style={{ paddingLeft: 40 }} />
              </div>
              {errMsg("confirm")}
            </div>

            <button type="submit" className="add-btn" disabled={loading} style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account…" : "🚀 Create Account"}
            </button>

          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
