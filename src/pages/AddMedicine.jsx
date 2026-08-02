import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { medicinesAPI } from "../services/api";
import toast from "react-hot-toast";

const features = [
  { icon: "💊", label: "Medicine"  },
  { icon: "⏰", label: "Schedule"  },
  { icon: "📅", label: "Calendar"  },
  { icon: "🔔", label: "Reminder"  },
];

function AddMedicine() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", time: "", date: "", frequency: "Daily",
    category: "Tablet", dosage: "", notes: "", priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Medicine name is required.";
    if (!form.time)        errs.time = "Time is required.";
    if (!form.date)        errs.date = "Date is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await medicinesAPI.create(form);
      toast.success("Medicine added successfully!");
      navigate("/reminders");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to add medicine.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "var(--text-muted)", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: 6,
  };

  const fieldWrap = { display: "flex", flexDirection: "column" };

  const errMsg = (key) =>
    errors[key] ? (
      <p style={{ color: "#f87171", fontSize: "0.78rem", margin: "5px 0 0" }}>{errors[key]}</p>
    ) : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        <Navbar />

        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <h1 className="add-title">Add Medicine</h1>
            <p className="add-subtitle">Schedule and manage your medications easily.</p>
          </div>

          <div className="feature-row">
            {features.map(({ icon, label }) => (
              <div key={label} className="feature-box">{icon} {label}</div>
            ))}
          </div>

          <div className="add-medicine-card">
            <form onSubmit={handleSubmit}>
              <div className="add-form">

                <div style={fieldWrap}>
                  <label style={labelStyle}>Medicine Name *</label>
                  <input name="name" type="text" placeholder="e.g. Paracetamol" value={form.name} onChange={handleChange} className="modern-input" />
                  {errMsg("name")}
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Time *</label>
                  <input name="time" type="time" value={form.time} onChange={handleChange} className="modern-input" />
                  {errMsg("time")}
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Start Date *</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className="modern-input" />
                  {errMsg("date")}
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Dosage</label>
                  <input name="dosage" type="text" placeholder="e.g. 500mg" value={form.dosage} onChange={handleChange} className="modern-input" />
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Frequency</label>
                  <select name="frequency" value={form.frequency} onChange={handleChange} className="modern-input">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>As needed</option>
                  </select>
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="modern-input">
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Syrup</option>
                    <option>Injection</option>
                    <option>Vitamin</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange} className="modern-input">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div />

                <div style={{ ...fieldWrap }} className="full-width">
                  <label style={labelStyle}>Notes</label>
                  <textarea name="notes" rows="4" placeholder="Any additional notes…" value={form.notes} onChange={handleChange} className="modern-input" style={{ resize: "vertical" }} />
                </div>

                <button type="submit" className="add-btn full-width" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Adding…" : "➕ Add Medicine"}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;
