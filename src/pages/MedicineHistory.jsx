import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { medicinesAPI } from "../services/api";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

function MedicineHistory() {
  const [medicines, setMedicines] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("All");
  const [sort,      setSort]      = useState("newest");

  useEffect(() => {
    (async () => {
      try {
        const all = await medicinesAPI.getAll();
        setMedicines(all);
      } catch { toast.error("Failed to load history."); }
      finally  { setLoading(false); }
    })();
  }, []);

  const filtered = medicines
    .filter(m => {
      if (filter === "Completed") return m.completed;
      if (filter === "Pending")   return !m.completed;
      return true;
    })
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "name")   return a.name.localeCompare(b.name);
      return 0;
    });

  const completed = medicines.filter(m => m.completed).length;
  const pending   = medicines.length - completed;
  const rate      = medicines.length ? Math.round((completed / medicines.length) * 100) : 0;

  /* ── CSV export ── */
  const exportCSV = () => {
    const rows = [
      ["Name", "Category", "Dosage", "Time", "Date", "Frequency", "Priority", "Status", "Added On"],
      ...filtered.map(m => [
        m.name, m.category, m.dosage || "", m.time, m.date,
        m.frequency, m.priority, m.completed ? "Completed" : "Pending",
        new Date(m.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "medicine-history.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const priorityColor = (p) =>
    p === "High" ? "var(--red)" : p === "Medium" ? "var(--amber)" : "var(--green)";

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", margin: 0 }}>
            Medicine History
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>
            Full log of all your tracked medicines.
          </p>
        </div>
        <button onClick={exportCSV} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 16px", borderRadius: "var(--r-sm)",
          border: "1px solid var(--border)", background: "var(--bg-surface)",
          color: "var(--text-muted)", cursor: "pointer", fontWeight: 600,
          fontSize: "0.82rem", fontFamily: "inherit",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-subtle)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-surface)"}
        >
          <FaDownload size={11} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",        value: medicines.length, bg: "var(--bg-surface)",  border: "var(--border)",       vc: "var(--text-heading)" },
          { label: "Completed",    value: completed,        bg: "var(--green-bg)",     border: "var(--green-border)", vc: "var(--green)"        },
          { label: "Pending",      value: pending,          bg: "var(--amber-bg)",     border: "var(--amber-border)", vc: "var(--amber)"        },
          { label: "Success Rate", value: `${rate}%`,       bg: "var(--blue-muted)",   border: "var(--blue-light)",   vc: "var(--blue)"         },
        ].map(({ label, value, bg, border, vc }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--r-lg)", padding: "16px 18px", boxShadow: "var(--shadow-xs)" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 6px" }}>{label}</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: vc }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none", fontSize: "0.8rem" }} />
          <input type="text" placeholder="Search medicines…" value={search} onChange={e => setSearch(e.target.value)} className="modern-input" style={{ paddingLeft: 36 }} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="modern-input" style={{ width: "auto", minWidth: 130 }}>
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="modern-input" style={{ width: "auto", minWidth: 140 }}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="glass" style={{ textAlign: "center", padding: "52px 24px", color: "var(--text-muted)" }}>
          <p style={{ margin: 0, fontWeight: 600, color: "var(--text-heading)" }}>No medicines found.</p>
        </div>
      ) : (
        <div className="glass" style={{ overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
            padding: "11px 20px",
            background: "var(--bg-subtle)",
            borderBottom: "1px solid var(--border)",
            fontSize: "0.7rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.07em",
            color: "var(--text-muted)",
          }}>
            <span>Medicine</span>
            <span>Time</span>
            <span>Category</span>
            <span>Dosage</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Added</span>
          </div>

          {/* Rows */}
          {filtered.map((med, i) => (
            <div
              key={med.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
                padding: "13px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-subtle)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-heading)", margin: 0 }}>{med.name}</p>
                {med.notes && <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", margin: "2px 0 0", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{med.notes}</p>}
              </div>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{med.time}</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{med.category}</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{med.dosage || "—"}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: priorityColor(med.priority) }}>{med.priority}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {med.completed
                  ? <><FaCheckCircle style={{ color: "var(--green)" }} size={12} /><span className="badge badge-success">Done</span></>
                  : <><FaTimesCircle style={{ color: "var(--red)" }}   size={12} /><span className="badge badge-danger">Pending</span></>
                }
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                {new Date(med.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: 14, textAlign: "right" }}>
        Showing {filtered.length} of {medicines.length} medicines
      </p>
    </AppLayout>
  );
}

export default MedicineHistory;
