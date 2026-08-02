import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import { medicinesAPI } from "../services/api";
import { FaCheck, FaTrash, FaEdit, FaSave, FaTimes, FaSearch, FaPills } from "react-icons/fa";
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
      const [meds, s] = await Promise.all([medicinesAPI.getAll(params), medicinesAPI.getStats()]);
      setMedicines(meds); setStats(s);
    } catch { toast.error("Failed to load medicines."); }
    finally  { setLoading(false); }
  }, [filter, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleComplete = async (id) => {
    try {
      const updated = await medicinesAPI.toggleComplete(id);
      setMedicines(p => p.map(m => m.id === id ? updated : m));
      toast.success(updated.completed ? "Marked as done!" : "Marked as pending.");
      medicinesAPI.getStats().then(setStats).catch(() => {});
    } catch { toast.error("Failed to update."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await medicinesAPI.remove(id);
      setMedicines(p => p.filter(m => m.id !== id));
      toast.success("Deleted.");
      medicinesAPI.getStats().then(setStats).catch(() => {});
    } catch { toast.error("Failed to delete."); }
  };

  const saveEdit = async () => {
    if (!editName.trim()) { toast.error("Name cannot be empty."); return; }
    setSaving(true);
    try {
      const updated = await medicinesAPI.update(editingId, { name: editName, time: editTime });
      setMedicines(p => p.map(m => m.id === editingId ? updated : m));
      setEditingId(null);
      toast.success("Updated.");
    } catch { toast.error("Failed to save."); }
    finally  { setSaving(false); }
  };

  const priorityBadge = (p) =>
    p === "High"   ? "badge-danger"  :
    p === "Medium" ? "badge-warning" : "badge-success";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-page)" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto", minWidth: 0 }}>
        <Navbar />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-heading)", margin: 0 }}>
              Reminders
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>
              Manage, edit, and track all your medications.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Total",        value: stats.total,       bg: "var(--bg-surface)",   border: "var(--border)" },
            { label: "Completed",    value: stats.completed,   bg: "var(--green-bg)",      border: "var(--green-border)", vc: "var(--green)" },
            { label: "Success Rate", value: `${stats.successRate}%`, bg: "var(--blue-muted)", border: "var(--blue-light)", vc: "var(--blue)" },
          ].map(({ label, value, bg, border, vc }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--r-lg)", padding: "16px 18px", boxShadow: "var(--shadow-xs)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 6px" }}>{label}</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: vc || "var(--text-heading)" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="glass" style={{ padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", margin: 0 }}>Completion Progress</p>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--blue)" }}>{stats.successRate}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.successRate}%` }} />
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none", fontSize: "0.8rem" }} />
            <input type="text" placeholder="Search medicines…" value={search} onChange={e => setSearch(e.target.value)} className="modern-input" style={{ paddingLeft: 36 }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="modern-input" style={{ width: "auto", minWidth: 130 }}>
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Medicine Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading…</div>
        ) : medicines.length === 0 ? (
          <div className="glass" style={{ textAlign: "center", padding: "52px 24px", color: "var(--text-muted)" }}>
            <FaPills size={32} style={{ marginBottom: 12, opacity: 0.25 }} />
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.92rem", color: "var(--text-heading)" }}>No medicines found</p>
            <p style={{ margin: 0, fontSize: "0.82rem" }}>Try a different search or filter.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
            {medicines.map(med => (
              <div
                key={med.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-lg)",
                  padding: "18px 20px",
                  boxShadow: "var(--shadow-xs)",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-xs)"}
              >
                {/* Card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 8 }}>
                  {editingId === med.id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="modern-input" style={{ padding: "7px 10px", fontSize: "0.9rem", fontWeight: 600, flex: 1 }} />
                  ) : (
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-heading)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {med.name}
                    </p>
                  )}
                  <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`} style={{ flexShrink: 0 }}>
                    {med.completed ? "Done" : "Pending"}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                  {editingId === med.id ? (
                    <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="modern-input" style={{ padding: "7px 10px" }} />
                  ) : (
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>⏰ {med.time}</p>
                  )}
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>💊 {med.category}</p>
                  {med.dosage && <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>💉 {med.dosage}</p>}
                </div>

                {/* Priority */}
                {med.priority && (
                  <span className={`badge ${priorityBadge(med.priority)}`} style={{ marginBottom: 14, display: "inline-flex" }}>
                    {med.priority}
                  </span>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  {!med.completed && (
                    <button onClick={() => handleComplete(med.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 0", background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)", borderRadius: "var(--r-sm)", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", fontFamily: "inherit", transition: "background 0.15s" }}>
                      <FaCheck size={10} /> Done
                    </button>
                  )}
                  {editingId === med.id ? (
                    <>
                      <button onClick={saveEdit} disabled={saving} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 0", background: "var(--blue-muted)", border: "1px solid var(--blue-light)", color: "var(--blue)", borderRadius: "var(--r-sm)", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", fontFamily: "inherit" }}>
                        <FaSave size={10} /> {saving ? "…" : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "7px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: "var(--r-sm)", cursor: "pointer" }}>
                        <FaTimes size={11} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { setEditingId(med.id); setEditName(med.name); setEditTime(med.time); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 0", background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: "var(--r-sm)", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", fontFamily: "inherit", transition: "background 0.15s" }}>
                      <FaEdit size={10} /> Edit
                    </button>
                  )}
                  <button onClick={() => handleDelete(med.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "7px 12px", background: "var(--red-bg)", border: "1px solid var(--red-border)", color: "var(--red)", borderRadius: "var(--r-sm)", cursor: "pointer", transition: "background 0.15s" }}>
                    <FaTrash size={11} />
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
