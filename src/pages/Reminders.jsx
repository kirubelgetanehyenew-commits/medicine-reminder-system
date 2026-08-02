import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import { medicinesAPI } from "../services/api";
import { FaCheck, FaTrash, FaEdit, FaSave, FaPills, FaSearch, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

function Reminders() {
  const [medicines, setMedicines] = useState([]);
  const [stats,     setStats]     = useState({ total: 0, completed: 0, successRate: 0 });
  const [loading,   setLoading]   = useState(true);

  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [editName,  setEditName]  = useState("");
  const [editTime,  setEditTime]  = useState("");
  const [saving,    setSaving]    = useState(false);

  const load = useCallback(async () => {
    try {
      const params = {};
      if (filter === "Completed") params.completed = true;
      if (filter === "Pending")   params.completed = false;
      if (search) params.search = search;

      const [meds, s] = await Promise.all([
        medicinesAPI.getAll(params),
        medicinesAPI.getStats(),
      ]);
      setMedicines(meds);
      setStats(s);
    } catch {
      toast.error("Failed to load medicines.");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const delay = setTimeout(load, 300);
    return () => clearTimeout(delay);
  }, [load]);

  const handleToggleComplete = async (id) => {
    try {
      const updated = await medicinesAPI.toggleComplete(id);
      setMedicines((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setStats((s) => {
        const wasComplete = !updated.completed;
        return {
          ...s,
          completed:   wasComplete ? s.completed - 1 : s.completed + 1,
          successRate: s.total === 0 ? 0 : Math.round(((wasComplete ? s.completed - 1 : s.completed + 1) / s.total) * 100),
        };
      });
      toast.success(updated.completed ? "Marked as done!" : "Marked as pending.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await medicinesAPI.remove(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      toast.success("Medicine deleted.");
      load();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const startEdit = (med) => {
    setEditingId(med.id);
    setEditName(med.name);
    setEditTime(med.time);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editName.trim()) return toast.error("Name cannot be empty.");
    setSaving(true);
    try {
      const updated = await medicinesAPI.update(editingId, { name: editName, time: editTime });
      setMedicines((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      setEditingId(null);
      toast.success("Medicine updated.");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        <Navbar />

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>
            Medicine Reminders
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.95rem" }}>
            Manage, edit, and track all your medications.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Total",        value: stats.total,       color: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.2)" },
            { label: "Completed",    value: stats.completed,   color: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.2)"  },
            { label: "Success Rate", value: `${stats.successRate}%`, color: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.2)" },
          ].map(({ label, value, color, border }) => (
            <div key={label} style={{ background: color, border: `1px solid ${border}`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
              <p style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.04em", margin: "6px 0 0" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="glass" style={{ padding: "16px 20px", marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
            <span style={{ fontWeight: 600 }}>Completion Progress</span>
            <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>{stats.successRate}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.successRate}%` }} />
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search medicine…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="modern-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="modern-input" style={{ width: "auto", minWidth: 140 }}>
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>Loading…</div>
        ) : medicines.length === 0 ? (
          <div className="glass" style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" }}>
            <FaPills size={36} style={{ marginBottom: 14, opacity: 0.35 }} />
            <p style={{ margin: 0 }}>No medicines found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {medicines.map((med) => (
              <div key={med.id} className="glass card-hover" style={{ padding: "22px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  {editingId === med.id ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="modern-input" style={{ fontSize: "1rem", fontWeight: 700, padding: "8px 12px", flex: 1, marginRight: 10 }} />
                  ) : (
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{med.name}</h2>
                  )}
                  <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                    {med.completed ? "Done" : "Pending"}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                  {editingId === med.id ? (
                    <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="modern-input" style={{ padding: "8px 12px" }} />
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>⏰ {med.time}</p>
                  )}
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>💊 {med.category}</p>
                  {med.dosage && <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>💉 {med.dosage}</p>}
                  {med.notes  && <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>{med.notes}</p>}
                </div>

                {/* Priority */}
                {med.priority && (
                  <span className={`badge ${med.priority === "High" ? "badge-danger" : med.priority === "Medium" ? "badge-warning" : "badge-success"}`} style={{ marginBottom: 14, display: "inline-flex" }}>
                    {med.priority} Priority
                  </span>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  {!med.completed && (
                    <button onClick={() => handleToggleComplete(med.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", borderRadius: "var(--radius-sm)", padding: "9px 0", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                      <FaCheck /> Done
                    </button>
                  )}

                  {editingId === med.id ? (
                    <>
                      <button onClick={saveEdit} disabled={saving} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.25)", color: "var(--accent-light)", borderRadius: "var(--radius-sm)", padding: "9px 0", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                        <FaSave /> {saving ? "…" : "Save"}
                      </button>
                      <button onClick={cancelEdit} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: "var(--radius-sm)", padding: "9px 12px", cursor: "pointer" }}>
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(med)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#a5b4fc", borderRadius: "var(--radius-sm)", padding: "9px 0", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                      <FaEdit /> Edit
                    </button>
                  )}

                  <button onClick={() => handleDelete(med.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171", borderRadius: "var(--radius-sm)", padding: "9px 14px", cursor: "pointer" }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reminders;
