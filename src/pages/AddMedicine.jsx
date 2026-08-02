import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { medicinesAPI } from "../services/api";
import toast from "react-hot-toast";
import { FaBell, FaCalendarAlt, FaClock, FaPills } from "react-icons/fa";

const chips = [
  { icon: <FaPills size={13} />,       label: "Medicine"  },
  { icon: <FaClock size={13} />,       label: "Schedule"  },
  { icon: <FaCalendarAlt size={13} />, label: "Calendar"  },
  { icon: <FaBell size={13} />,        label: "Reminder"  },
];

const labelStyle = {
  display: "block", fontSize: "0.75rem", fontWeight: 600,
  color: "var(--text-muted)", textTransform: "uppercase",
  letterSpacing: "0.06em", marginBottom: 6,
};

function AddMedicine() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", time: "", date: "", frequency: "Daily",
    category: "Tablet", dosage: "", notes: "", priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.time)        e.time = "Required";
    if (!form.date)        e.date = "Required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await medicinesAPI.create(form);
      toast.success("Medicine added!");
      navigate("/reminders");
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to add.");
    } finally { setLoading(false); }
  };

  const errMsg = (k) => errors[k]
    ? <p style={{ color: "var(--red)", fontSize: "0.73rem", margin: "4px 0 0" }}>{errors[k]}</p>
    : null;

  const field = (label, node, key) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {node}
      {key && errMsg(key)}
    </div>
  );

  return (
    <AppLayout>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-heading)", margin: 0 }}>
              Add Medicine
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>
              Schedule a new medication and we'll send you timely reminders.
            </p>
          </div>

          {/* Feature chips */}
          <div className="feature-row">
            {chips.map(({ icon, label }) => (
              <span key={label} className="feature-box" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {icon} {label}
              </span>
            ))}
          </div>

          {/* Form card */}
          <div className="add-medicine-card">
            <form onSubmit={handleSubmit}>
              <div className="add-form">

                {field("Medicine Name *",
                  <input name="name" type="text" placeholder="e.g. Paracetamol" value={form.name} onChange={set("name")} className="modern-input" />,
                  "name")}

                {field("Time *",
                  <input name="time" type="time" value={form.time} onChange={set("time")} className="modern-input" />,
                  "time")}

                {field("Start Date *",
                  <input name="date" type="date" value={form.date} onChange={set("date")} className="modern-input" />,
                  "date")}

                {field("Dosage",
                  <input name="dosage" type="text" placeholder="e.g. 500mg" value={form.dosage} onChange={set("dosage")} className="modern-input" />)}

                {field("Frequency",
                  <select value={form.frequency} onChange={set("frequency")} className="modern-input">
                    <option>Daily</option><option>Weekly</option><option>Monthly</option><option>As needed</option>
                  </select>)}

                {field("Category",
                  <select value={form.category} onChange={set("category")} className="modern-input">
                    <option>Tablet</option><option>Capsule</option><option>Syrup</option>
                    <option>Injection</option><option>Vitamin</option><option>Other</option>
                  </select>)}

                {field("Priority",
                  <select value={form.priority} onChange={set("priority")} className="modern-input">
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>)}

                <div />

                <div style={{ display: "flex", flexDirection: "column" }} className="full-width">
                  <label style={labelStyle}>Notes</label>
                  <textarea rows="4" placeholder="Any additional instructions or notes…" value={form.notes} onChange={set("notes")} className="modern-input" style={{ resize: "vertical", fontFamily: "inherit" }} />
                </div>

                <button type="submit" className="add-btn full-width" disabled={loading}>
                  {loading ? "Adding medicine…" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
    </AppLayout>
  );
}

export default AddMedicine;
