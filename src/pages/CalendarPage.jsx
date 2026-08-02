import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { medicinesAPI } from "../services/api";
import { FaPills } from "react-icons/fa";

function CalendarPage() {
  const [date,      setDate]      = useState(new Date());
  const [medicines, setMedicines] = useState([]);
  const [stats,     setStats]     = useState({ total: 0, completed: 0, pending: 0 });
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meds, s] = await Promise.all([
          medicinesAPI.getAll(),
          medicinesAPI.getStats(),
        ]);
        setMedicines(meds);
        setStats(s);
      } catch {
        // silently ignore — page still renders with empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Highlight dates that have medicines scheduled
  const tileClassName = ({ date: tileDate }) => {
    const tileStr = tileDate.toISOString().split("T")[0];
    const hasMed  = medicines.some((m) => m.date === tileStr);
    return hasMed ? "has-medicine" : null;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        <Navbar />

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>
            Medicine Calendar
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.95rem" }}>
            Browse your medications by date.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Loading…</div>
        ) : (
          <>
            {/* Main Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 24 }}>

              {/* Calendar */}
              <div className="glass" style={{ padding: "24px" }}>
                <h2 style={{ fontWeight: 700, fontSize: "0.82rem", margin: "0 0 18px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Pick a Date
                </h2>
                <Calendar onChange={setDate} value={date} tileClassName={tileClassName} />
              </div>

              {/* Day Panel */}
              <div className="glass" style={{ padding: "24px" }}>
                <h2 style={{ fontWeight: 700, fontSize: "0.82rem", margin: "0 0 6px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Selected Date
                </h2>
                <p style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 20, color: "var(--accent-light)" }}>
                  {date.toDateString()}
                </p>

                {/* Medicines scheduled on selected date */}
                {(() => {
                  const selected  = date.toISOString().split("T")[0];
                  const dayMeds   = medicines.filter((m) => m.date === selected);
                  return dayMeds.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
                      <FaPills size={24} style={{ marginBottom: 10, opacity: 0.3 }} />
                      <p style={{ margin: 0, fontSize: "0.88rem" }}>No medicines on this date.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {dayMeds.map((med) => (
                        <div key={med.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ fontWeight: 600, margin: 0, fontSize: "0.92rem" }}>{med.name}</p>
                            <p style={{ color: "var(--text-muted)", margin: "3px 0 0", fontSize: "0.78rem" }}>⏰ {med.time} · 💊 {med.category}</p>
                          </div>
                          <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                            {med.completed ? "Done" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <h3 style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-muted)", margin: "22px 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  All Medicines
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
                  {medicines.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>No medicines added yet.</p>
                  ) : medicines.map((med) => (
                    <div key={med.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontWeight: 600, margin: 0, fontSize: "0.88rem" }}>{med.name}</p>
                        <p style={{ color: "var(--text-muted)", margin: "2px 0 0", fontSize: "0.75rem" }}>⏰ {med.time}</p>
                      </div>
                      <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                        {med.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
              {[
                { label: "Total",     value: stats.total,     color: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.2)" },
                { label: "Completed", value: stats.completed, color: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.2)"  },
                { label: "Pending",   value: stats.pending,   color: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)" },
              ].map(({ label, value, color, border }) => (
                <div key={label} style={{ background: color, border: `1px solid ${border}`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.04em", margin: "6px 0 0" }}>{value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
