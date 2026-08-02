import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import AnalyticsChart from "../components/AnalyticsChart";
import { medicinesAPI, getUser } from "../services/api";
import { FaPills, FaCheckCircle, FaClock, FaTrophy } from "react-icons/fa";

const col = (bg, border) => ({ background: bg, border: `1px solid ${border}` });

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();  const [medicines, setMedicines] = useState([]);
  const [stats,     setStats]     = useState({ total: 0, completed: 0, pending: 0, successRate: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [meds, s] = await Promise.all([medicinesAPI.getAll(), medicinesAPI.getStats()]);
        setMedicines(meds); setStats(s);
      } catch { setError("Failed to load data. Is the backend running?"); }
      finally  { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: "Total Medicines", value: stats.total,       icon: <FaPills />,       ...col("var(--bg-surface)",          "var(--border)") },
    { label: "Completed",       value: stats.completed,   icon: <FaCheckCircle />, ...col("var(--green-bg)",             "var(--green-border)"),  valueColor: "var(--green)" },
    { label: "Pending",         value: stats.pending,     icon: <FaClock />,       ...col("var(--amber-bg)",             "var(--amber-border)"),  valueColor: "var(--amber)" },
    { label: "Success Rate",    value: `${stats.successRate}%`, icon: <FaTrophy />, ...col("var(--blue-muted)",          "var(--blue-light)"),    valueColor: "var(--blue)"  },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-heading)", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>
          Good to see you, <strong style={{ color: "var(--text-heading)" }}>{user?.name || "there"}</strong>. Here's your health overview.
        </p>
      </div>

        {error && (
          <div style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "var(--r-md)", padding: "12px 16px", marginBottom: 24, color: "var(--red)", fontSize: "0.85rem" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Loading your data…
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 14, marginBottom: 24 }}>
              {cards.map(({ label, value, icon, background, border, valueColor }) => (
                <div
                  key={label}
                  className="card-hover"
                  style={{ background, border, borderRadius: "var(--r-lg)", padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ fontSize: "0.73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: 0 }}>
                      {label}
                    </p>
                    <div style={{ color: valueColor || "var(--text-muted)", fontSize: "0.9rem", opacity: 0.8 }}>{icon}</div>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: valueColor || "var(--text-heading)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="glass" style={{ padding: "18px 22px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-heading)", margin: 0 }}>Overall Completion</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "3px 0 0" }}>
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

            {/* Two-column lower grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {/* Chart */}
              <div className="glass" style={{ padding: "22px 24px" }}>
                <div className="section-header">
                  <p className="section-title">Weekly Analytics</p>
                  <span className="badge badge-blue">This week</span>
                </div>
                <AnalyticsChart />
              </div>

              {/* Recent */}
              <div className="glass" style={{ padding: "22px 24px" }}>
                <div className="section-header">
                  <p className="section-title">Recent Medicines</p>
                  <Link to="/reminders" style={{ fontSize: "0.78rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                    View all →
                  </Link>
                </div>

                {medicines.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)" }}>
                    <FaPills size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: "0.85rem" }}>No medicines yet.</p>
                    <Link to="/add" style={{ display: "inline-block", marginTop: 12, fontSize: "0.82rem", color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                      + Add your first medicine
                    </Link>
                  </div>
                ) : (
                  medicines.slice(0, 5).map((med) => (
                    <div key={med.id} className="table-row">
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-heading)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {med.name}
                        </p>
                        <p style={{ color: "var(--text-muted)", margin: "2px 0 0", fontSize: "0.75rem" }}>
                          {med.time} · {med.category}
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
          </>
        )}

        <Link to="/add" className="fab">+</Link>
    </AppLayout>
  );
}

export default Dashboard;
