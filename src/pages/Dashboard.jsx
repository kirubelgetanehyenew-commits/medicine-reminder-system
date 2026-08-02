import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import AnalyticsChart from "../components/AnalyticsChart";
import { medicinesAPI, getUser } from "../services/api";
import {
  FaPills, FaCheckCircle, FaClock, FaTrophy,
  FaExclamationTriangle, FaPlus, FaStickyNote,
  FaHistory, FaCalendarCheck, FaFlask, FaBell,
} from "react-icons/fa";
import toast from "react-hot-toast";

/* ── helper ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TODAY = new Date().toISOString().split("T")[0];

function Dashboard() {
  const user = getUser();

  const [medicines,   setMedicines]   = useState([]);
  const [stats,       setStats]       = useState({ total: 0, completed: 0, pending: 0, successRate: 0 });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [takingDose,  setTakingDose]  = useState(null); // medicine id being processed

  useEffect(() => {
    (async () => {
      try {
        const [meds, s] = await Promise.all([medicinesAPI.getAll(), medicinesAPI.getStats()]);
        setMedicines(meds);
        setStats(s);
      } catch {
        setError("Failed to load data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Record a dose (mark done + decrement pill count) ── */
  const handleRecordDose = async (id) => {
    setTakingDose(id);
    try {
      const updated = await medicinesAPI.recordDose(id);
      setMedicines(p => p.map(m => m.id === id ? updated : m));
      const s = await medicinesAPI.getStats();
      setStats(s);
      toast.success("✅ Dose recorded!");
    } catch {
      toast.error("Failed to record dose.");
    } finally {
      setTakingDose(null);
    }
  };

  /* ── Derived data ── */
  const todayMeds     = medicines.filter(m => m.date <= TODAY && !m.completed);
  const lowStock      = medicines.filter(m => m.pillsRemaining != null && m.pillsRemaining <= (m.refillAt ?? 5));
  const completedToday = medicines.filter(m => m.completed && m.completedAt?.startsWith(TODAY));

  const statCards = [
    { label: "Total",        value: stats.total,             icon: <FaPills />,       bg: "var(--bg-surface)",  border: "var(--border)",           vc: "var(--text-heading)" },
    { label: "Completed",    value: stats.completed,         icon: <FaCheckCircle />, bg: "var(--green-bg)",    border: "var(--green-border)",     vc: "var(--green)"        },
    { label: "Pending",      value: stats.pending,           icon: <FaClock />,       bg: "var(--amber-bg)",    border: "var(--amber-border)",     vc: "var(--amber)"        },
    { label: "Success Rate", value: `${stats.successRate}%`, icon: <FaTrophy />,      bg: "var(--blue-muted)",  border: "var(--blue-light)",       vc: "var(--blue)"         },
  ];

  const quickActions = [
    { label: "Add Medicine",  to: "/add",       icon: <FaPlus size={14} />,         bg: "var(--blue)",    shadow: "rgba(37,99,235,0.3)"  },
    { label: "Health Notes",  to: "/notes",     icon: <FaStickyNote size={14} />,   bg: "#7c3aed",        shadow: "rgba(124,58,237,0.3)" },
    { label: "History",       to: "/history",   icon: <FaHistory size={14} />,      bg: "#0891b2",        shadow: "rgba(8,145,178,0.3)"  },
    { label: "Calendar",      to: "/calendar",  icon: <FaCalendarCheck size={14}/>, bg: "var(--green)",   shadow: "rgba(22,163,74,0.3)"  },
    { label: "Reminders",     to: "/reminders", icon: <FaBell size={14} />,         bg: "var(--amber)",   shadow: "rgba(217,119,6,0.3)"  },
    { label: "Profile",       to: "/profile",   icon: <FaFlask size={14} />,        bg: "#64748b",        shadow: "rgba(100,116,139,0.3)"},
  ];

  return (
    <AppLayout>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 4px" }}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", margin: 0 }}>
          {getGreeting()}, <span style={{ color: "var(--blue)" }}>{user?.name?.split(" ")[0] || "there"}</span> 👋
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.875rem" }}>
          Here's your health overview for today.
        </p>
      </div>

      {error && (
        <div style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "var(--r-md)", padding: "12px 16px", marginBottom: 20, color: "var(--red)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
          <FaExclamationTriangle size={13} /> {error}
        </div>
      )}

      {/* ── Low Stock Alert Banner ── */}
      {!loading && lowStock.length > 0 && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 14,
          background: "var(--amber-bg)", border: "1px solid var(--amber-border)",
          borderRadius: "var(--r-md)", padding: "14px 18px", marginBottom: 20,
        }}>
          <FaExclamationTriangle style={{ color: "var(--amber)", flexShrink: 0, marginTop: 2 }} size={15} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--amber)", margin: "0 0 4px" }}>
              Low stock warning — {lowStock.length} medicine{lowStock.length > 1 ? "s" : ""} running low
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              {lowStock.map(m => `${m.name} (${m.pillsRemaining} left)`).join(" · ")}
            </p>
          </div>
          <Link to="/reminders" style={{ fontSize: "0.78rem", color: "var(--amber)", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
            View →
          </Link>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Loading your data…
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
            {statCards.map(({ label, value, icon, bg, border, vc }) => (
              <div key={label} className="card-hover" style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--r-lg)", padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: 0 }}>{label}</p>
                  <span style={{ color: vc, fontSize: "0.9rem", opacity: 0.85 }}>{icon}</span>
                </div>
                <p style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: vc }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Progress bar ── */}
          <div className="glass" style={{ padding: "16px 22px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0 }}>Overall Completion</p>
                <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
                  {stats.completed} of {stats.total} medicines completed
                </p>
              </div>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--blue)" }}>
                {stats.successRate}%
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${stats.successRate}%` }} />
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="glass" style={{ padding: "20px 22px", marginBottom: 20 }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-heading)", margin: "0 0 14px" }}>
              Quick Actions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
              {quickActions.map(({ label, to, icon, bg, shadow }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 8, padding: "14px 10px",
                    background: "var(--bg-subtle)", border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)", textDecoration: "none",
                    color: "var(--text-heading)", fontSize: "0.78rem", fontWeight: 600,
                    transition: "all 0.15s", textAlign: "center",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = bg;
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = `0 4px 16px ${shadow}`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "var(--bg-subtle)";
                    e.currentTarget.style.color = "var(--text-heading)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Three-column grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* Chart */}
            <div className="glass" style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0 }}>Weekly Analytics</p>
                <span className="badge badge-blue">This week</span>
              </div>
              <AnalyticsChart />
            </div>

            {/* Recent medicines */}
            <div className="glass" style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0 }}>Recent Medicines</p>
                <Link to="/reminders" style={{ fontSize: "0.78rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                  View all →
                </Link>
              </div>

              {medicines.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)" }}>
                  <FaPills size={28} style={{ marginBottom: 10, opacity: 0.25 }} />
                  <p style={{ margin: "0 0 12px", fontSize: "0.85rem" }}>No medicines yet.</p>
                  <Link to="/add" style={{ fontSize: "0.82rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                    + Add your first medicine
                  </Link>
                </div>
              ) : (
                medicines.slice(0, 5).map(med => (
                  <div key={med.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {med.name}
                      </p>
                      <p style={{ color: "var(--text-muted)", margin: "2px 0 0", fontSize: "0.73rem" }}>
                        {med.time} · {med.category}
                        {med.pillsRemaining != null && (
                          <span style={{ color: med.pillsRemaining <= (med.refillAt ?? 5) ? "var(--red)" : "var(--text-subtle)", marginLeft: 6 }}>
                            · {med.pillsRemaining} pills left
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                      {med.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Today's Dose Tracker ── */}
          {todayMeds.length > 0 && (
            <div className="glass" style={{ padding: "22px 24px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0 }}>
                    Today's Dose Tracker
                  </p>
                  <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
                    {todayMeds.length} pending · {completedToday.length} done today
                  </p>
                </div>
                <span className="badge badge-danger">{todayMeds.length} pending</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                {todayMeds.map(med => (
                  <div
                    key={med.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 12, padding: "12px 14px",
                      background: "var(--bg-subtle)", border: "1px solid var(--border)",
                      borderRadius: "var(--r-md)",
                    }}
                  >
                    {/* Left info */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "var(--r-sm)",
                        background: "var(--blue-muted)", border: "1px solid var(--blue-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", flexShrink: 0,
                      }}>
                        💊
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {med.name}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
                          ⏰ {med.time}
                          {med.dosage && ` · ${med.dosage}`}
                          {med.pillsRemaining != null && (
                            <span style={{ color: med.pillsRemaining <= (med.refillAt ?? 5) ? "var(--red)" : "var(--text-subtle)", marginLeft: 4 }}>
                              · {med.pillsRemaining} left
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Take button */}
                    <button
                      onClick={() => handleRecordDose(med.id)}
                      disabled={takingDose === med.id}
                      style={{
                        flexShrink: 0,
                        padding: "7px 14px", borderRadius: "var(--r-sm)",
                        background: takingDose === med.id ? "var(--bg-subtle)" : "var(--blue)",
                        border: "none", color: "white",
                        fontWeight: 600, fontSize: "0.78rem",
                        cursor: takingDose === med.id ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        opacity: takingDose === med.id ? 0.6 : 1,
                        transition: "all 0.15s",
                        boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
                      }}
                    >
                      {takingDose === med.id ? "…" : "Take"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Refill Tracker ── */}
          <div className="glass" style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0 }}>
                  Refill Tracker
                </p>
                <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
                  Medicines with pill stock tracking enabled.
                </p>
              </div>
              <Link to="/add" style={{ fontSize: "0.78rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                + Add medicine with stock →
              </Link>
            </div>

            {medicines.filter(m => m.pillsRemaining != null).length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
                <p style={{ margin: "0 0 6px", fontSize: "0.875rem", color: "var(--text-heading)", fontWeight: 600 }}>
                  No stock tracking set up yet
                </p>
                <p style={{ margin: 0, fontSize: "0.82rem" }}>
                  When you add a medicine with a "Pills Remaining" count, it appears here.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {medicines
                  .filter(m => m.pillsRemaining != null)
                  .sort((a, b) => a.pillsRemaining - b.pillsRemaining)
                  .map(med => {
                    const pct       = Math.min(100, Math.round((med.pillsRemaining / 30) * 100));
                    const isLow     = med.pillsRemaining <= (med.refillAt ?? 5);
                    const isOut     = med.pillsRemaining === 0;
                    const barColor  = isOut ? "var(--red)" : isLow ? "var(--amber)" : "var(--blue)";

                    return (
                      <div
                        key={med.id}
                        style={{
                          padding: "14px 16px",
                          background: isOut ? "var(--red-bg)" : isLow ? "var(--amber-bg)" : "var(--bg-subtle)",
                          border: `1px solid ${isOut ? "var(--red-border)" : isLow ? "var(--amber-border)" : "var(--border)"}`,
                          borderRadius: "var(--r-md)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {(isLow || isOut) && (
                              <FaExclamationTriangle size={12} style={{ color: isOut ? "var(--red)" : "var(--amber)", flexShrink: 0 }} />
                            )}
                            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-heading)", margin: 0 }}>
                              {med.name}
                            </p>
                            {isOut && <span className="badge badge-danger">Out of stock</span>}
                            {isLow && !isOut && <span className="badge badge-warning">Refill soon</span>}
                          </div>
                          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: barColor, margin: 0 }}>
                            {med.pillsRemaining} pills left
                          </p>
                        </div>

                        {/* Stock bar */}
                        <div style={{ width: "100%", height: 6, background: "rgba(0,0,0,0.08)", borderRadius: "var(--r-full)", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: "var(--r-full)", transition: "width 0.4s ease" }} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                          <p style={{ fontSize: "0.7rem", color: "var(--text-subtle)", margin: 0 }}>
                            Refill alert at {med.refillAt ?? 5} pills · {med.dosage || med.category}
                          </p>
                          <Link
                            to="/reminders"
                            style={{ fontSize: "0.7rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}
                          >
                            Manage →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}

      {/* FAB */}
      <Link to="/add" className="fab">+</Link>
    </AppLayout>
  );
}

export default Dashboard;
