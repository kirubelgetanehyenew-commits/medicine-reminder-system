import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AppLayout from "../components/AppLayout";
import { medicinesAPI } from "../services/api";
import { FaPills } from "react-icons/fa";

function CalendarPage() {
  const [date,      setDate]      = useState(new Date());
  const [medicines, setMedicines] = useState([]);
  const [stats,     setStats]     = useState({ total: 0, completed: 0, pending: 0 });
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [meds, s] = await Promise.all([medicinesAPI.getAll(), medicinesAPI.getStats()]);
        setMedicines(meds); setStats(s);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const tileClassName = ({ date: d }) => {
    const str = d.toISOString().split("T")[0];
    return medicines.some(m => m.date === str) ? "has-medicine" : null;
  };

  const selectedStr  = date.toISOString().split("T")[0];
  const selectedMeds = medicines.filter(m => m.date === selectedStr);

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-heading)", margin: 0 }}>
          Calendar
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>
          Browse your medications by date. Dots indicate scheduled medicines.
        </p>
      </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading…</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, marginBottom: 24, alignItems: "start" }}>

              {/* Calendar */}
              <div className="glass" style={{ padding: "20px 22px", width: 320 }}>
                <p style={{ fontSize: "0.73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 14px" }}>
                  Pick a Date
                </p>
                <Calendar onChange={setDate} value={date} tileClassName={tileClassName} />
              </div>

              {/* Day Panel */}
              <div className="glass" style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: "0.73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 4px" }}>
                      Selected
                    </p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                      {date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <span className="badge badge-blue">{selectedMeds.length} scheduled</span>
                </div>

                {selectedMeds.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)", background: "var(--bg-subtle)", borderRadius: "var(--r-md)" }}>
                    <FaPills size={24} style={{ marginBottom: 8, opacity: 0.25 }} />
                    <p style={{ margin: 0, fontSize: "0.85rem" }}>No medicines scheduled on this date.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedMeds.map(med => (
                      <div key={med.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
                        <div>
                          <p style={{ fontWeight: 600, margin: 0, fontSize: "0.9rem", color: "var(--text-heading)" }}>{med.name}</p>
                          <p style={{ color: "var(--text-muted)", margin: "2px 0 0", fontSize: "0.76rem" }}>⏰ {med.time} · 💊 {med.category}</p>
                        </div>
                        <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                          {med.completed ? "Done" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* All medicines scroll list */}
                <div style={{ marginTop: 22 }}>
                  <p style={{ fontSize: "0.73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 10px" }}>
                    All Medicines
                  </p>
                  {medicines.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>No medicines added yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                      {medicines.map(med => (
                        <div key={med.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--bg-subtle)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
                          <div>
                            <p style={{ fontWeight: 600, margin: 0, fontSize: "0.84rem", color: "var(--text-heading)" }}>{med.name}</p>
                            <p style={{ color: "var(--text-muted)", margin: "1px 0 0", fontSize: "0.72rem" }}>⏰ {med.time}</p>
                          </div>
                          <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                            {med.completed ? "Done" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { label: "Total Medicines", value: stats.total,     bg: "var(--bg-surface)",   border: "var(--border)" },
                { label: "Completed",       value: stats.completed, bg: "var(--green-bg)",      border: "var(--green-border)", vc: "var(--green)" },
                { label: "Pending",         value: stats.pending,   bg: "var(--amber-bg)",      border: "var(--amber-border)", vc: "var(--amber)" },
              ].map(({ label, value, bg, border, vc }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--r-lg)", padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: "0 0 6px" }}>{label}</p>
                  <p style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: vc || "var(--text-heading)" }}>{value}</p>
                </div>
              ))}
            </div>
          </>
        )}
    </AppLayout>
  );
}

export default CalendarPage;
