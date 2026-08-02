import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { authAPI, getUser, saveSession } from "../services/api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

function Profile() {
  const stored = getUser();
  const [info,      setInfo]      = useState({ name: stored?.name || "", email: stored?.email || "", phone: stored?.phone || "" });
  const [pwd,       setPwd]       = useState({ current: "", newPwd: "", confirm: "" });
  const [editInfo,  setEditInfo]  = useState(false);
  const [editPwd,   setEditPwd]   = useState(false);
  const [savingInfo,setSavingInfo]= useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  /* ── save profile info ── */
  const handleSaveInfo = async () => {
    if (!info.name.trim() || !info.email.trim()) { toast.error("Name and email are required."); return; }
    setSavingInfo(true);
    try {
      const data = await authAPI.updateProfile({ name: info.name.trim(), email: info.email.trim(), phone: info.phone.trim() });
      saveSession({ token: localStorage.getItem("token"), user: data });
      setEditInfo(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally { setSavingInfo(false); }
  };

  /* ── change password ── */
  const handleSavePwd = async () => {
    if (!pwd.current)          { toast.error("Enter your current password."); return; }
    if (pwd.newPwd.length < 6) { toast.error("New password must be at least 6 characters."); return; }
    if (pwd.newPwd !== pwd.confirm) { toast.error("Passwords do not match."); return; }
    setSavingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: pwd.current, newPassword: pwd.newPwd });
      setPwd({ current: "", newPwd: "", confirm: "" });
      setEditPwd(false);
      toast.success("Password changed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally { setSavingPwd(false); }
  };

  const lbl = { display: "block", fontSize: "0.73rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
  const ico = { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" };

  return (
    <AppLayout>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", margin: 0 }}>Profile</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>Manage your personal information and account settings.</p>
      </div>

      {/* Avatar banner */}
      <div style={{
        background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
        borderRadius: "var(--r-xl)",
        padding: "32px 36px",
        marginBottom: 24,
        display: "flex", alignItems: "center", gap: 24,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "3px solid rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", fontWeight: 800, color: "white", flexShrink: 0,
        }}>
          {info.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: "1.2rem", color: "white", margin: 0 }}>{info.name}</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", margin: "4px 0 0" }}>{info.email}</p>
          {info.phone && <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", margin: "2px 0 0" }}>{info.phone}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* ── Personal Info Card ── */}
        <div className="glass" style={{ padding: "26px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-heading)", margin: 0 }}>Personal Information</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "3px 0 0" }}>Your name, email, and phone number.</p>
            </div>
            <button onClick={() => setEditInfo(!editInfo)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)", background: editInfo ? "var(--blue-muted)" : "var(--bg-subtle)",
              color: editInfo ? "var(--blue)" : "var(--text-muted)", cursor: "pointer",
              fontWeight: 600, fontSize: "0.8rem", fontFamily: "inherit",
            }}>
              <FaEdit size={11} /> {editInfo ? "Cancel" : "Edit"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Full Name",     name: "name",  icon: <FaUser size={12} />,    type: "text",  placeholder: "Your name" },
              { label: "Email Address", name: "email", icon: <FaEnvelope size={12}/>, type: "email", placeholder: "you@example.com" },
              { label: "Phone Number",  name: "phone", icon: <FaPhone size={12} />,   type: "tel",   placeholder: "+1 234 567 8901" },
            ].map(({ label, name, icon, type, placeholder }) => (
              <div key={name}>
                <label style={lbl}>{label}</label>
                {editInfo ? (
                  <div style={{ position: "relative" }}>
                    <span style={ico}>{icon}</span>
                    <input
                      type={type} value={info[name]} placeholder={placeholder}
                      onChange={e => setInfo(p => ({ ...p, [name]: e.target.value }))}
                      className="modern-input" style={{ paddingLeft: 36 }}
                    />
                  </div>
                ) : (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", background: "var(--bg-subtle)",
                    borderRadius: "var(--r-sm)", border: "1px solid var(--border)",
                    fontSize: "0.9rem", color: "var(--text-heading)",
                  }}>
                    <span style={{ color: "var(--text-subtle)" }}>{icon}</span>
                    {info[name] || <span style={{ color: "var(--text-subtle)" }}>Not set</span>}
                  </div>
                )}
              </div>
            ))}

            {editInfo && (
              <button onClick={handleSaveInfo} disabled={savingInfo} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px", borderRadius: "var(--r-md)",
                background: "var(--blue)", border: "none", color: "white",
                fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                fontFamily: "inherit", opacity: savingInfo ? 0.7 : 1,
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}>
                <FaSave size={13} /> {savingInfo ? "Saving…" : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* ── Change Password Card ── */}
        <div className="glass" style={{ padding: "26px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-heading)", margin: 0 }}>Change Password</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "3px 0 0" }}>Update your account password.</p>
            </div>
            <button onClick={() => setEditPwd(!editPwd)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)", background: editPwd ? "var(--blue-muted)" : "var(--bg-subtle)",
              color: editPwd ? "var(--blue)" : "var(--text-muted)", cursor: "pointer",
              fontWeight: 600, fontSize: "0.8rem", fontFamily: "inherit",
            }}>
              <FaLock size={10} /> {editPwd ? "Cancel" : "Change"}
            </button>
          </div>

          {editPwd ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Current Password", key: "current", ph: "Your current password" },
                { label: "New Password",      key: "newPwd",  ph: "Min. 6 characters"    },
                { label: "Confirm Password",  key: "confirm", ph: "Repeat new password"   },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label style={lbl}>{label}</label>
                  <div style={{ position: "relative" }}>
                    <FaLock size={11} style={ico} />
                    <input type="password" value={pwd[key]} placeholder={ph}
                      onChange={e => setPwd(p => ({ ...p, [key]: e.target.value }))}
                      className="modern-input" style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>
              ))}
              <button onClick={handleSavePwd} disabled={savingPwd} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px", borderRadius: "var(--r-md)",
                background: "var(--blue)", border: "none", color: "white",
                fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                fontFamily: "inherit", opacity: savingPwd ? 0.7 : 1,
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}>
                <FaSave size={13} /> {savingPwd ? "Saving…" : "Update Password"}
              </button>
            </div>
          ) : (
            <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)" }}>
              <FaLock size={28} style={{ marginBottom: 12, opacity: 0.25 }} />
              <p style={{ margin: 0, fontSize: "0.875rem" }}>Click "Change" to update your password.</p>
            </div>
          )}
        </div>

        {/* ── Account details card ── */}
        <div className="glass" style={{ padding: "26px 28px", gridColumn: "1 / -1" }}>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-heading)", margin: "0 0 16px" }}>Account Details</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { label: "Account Status", value: "Active", color: "var(--green)" },
              { label: "Plan",           value: "Free",   color: "var(--blue)"  },
              { label: "Notifications",  value: "SMS + Email enabled", color: "var(--text-heading)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: "14px 16px", background: "var(--bg-subtle)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 5px" }}>{label}</p>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
