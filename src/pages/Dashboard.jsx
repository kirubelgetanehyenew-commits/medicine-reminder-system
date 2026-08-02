import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import AnalyticsChart from "../components/AnalyticsChart";
import { medicinesAPI, getUser, clearSession } from "../services/api";
import { FaPills, FaCheckCircle, FaClock, FaPercent, FaSignOutAlt } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [medicines, setMedicines] = useState([]);
  const [stats,     setStats]     = useState({ total: 0, completed: 0, pending: 0, successRate: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

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
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const statCards = [
    { label: "Total",     value: stats.total,       icon: <FaPills />,       color: "#6366f1", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.2)"  },
    { label: "Completed", value: stats.completed,   icon: <FaCheckCircle />, color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.2)"   },
    { label: "Pending",   value: stats.pending,     icon: <FaClock />,       color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.2)"  },
    { label: "Success",   value: `${stats.successRate}%`, icon: <FaPercent />, color: "#14b8a6", bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.2)"  },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        <Navbar />

        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.95rem" }}>
              Welcome back, <strong>{user?.name || "there"}</strong> 👋
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171", borderRadius: "var(--radius-sm)", padding: "8px 14px",
              cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 24, color: "#f87171", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Loading…</div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
              {statCards.map(({ label, value, icon, color, bg, border }) => (
                <div key={label} className="card-hover" style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--radius-lg)", padding: "22px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em", margin: "8px 0 0" }}>{value}</p>
                    </div>
                    <div style={{ color, fontSize: "1.3rem", opacity: 0.9 }}>{icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="glass" style={{ padding: "20px 24px", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Overall Progress</span>
                <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>{stats.successRate}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${stats.successRate}%` }} />
              </div>
            </div>

            {/* Chart */}
            <div className="glass" style={{ padding: "24px 28px", marginBottom: 28 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 20px" }}>Weekly Analytics</h2>
              <AnalyticsChart />
            </div>

            {/* Recent Medicines */}
            <div className="glass" style={{ padding: "24px 28px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 20px" }}>Recent Medicines</h2>

              {medicines.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>
                  <FaPills size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{ margin: 0 }}>No medicines added yet.</p>
                </div>
              ) : (
                medicines.slice(0, 5).map((med) => (
                  <div key={med.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontWeight: 600, margin: 0, fontSize: "0.95rem" }}>{med.name}</p>
                      <p style={{ color: "var(--text-muted)", margin: "3px 0 0", fontSize: "0.82rem" }}>
                        ⏰ {med.time} &nbsp;·&nbsp; 💊 {med.category}
                      </p>
                    </div>
                    <span className={`badge ${med.completed ? "badge-success" : "badge-danger"}`}>
                      {med.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <Link to="/add" className="fab">+</Link>
      </div>
    </div>
  );
}

export default Dashboard;
