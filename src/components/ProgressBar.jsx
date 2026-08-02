function ProgressBar({ completed, total }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="glass" style={{ padding: "18px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-heading)", margin: 0 }}>
            Daily Progress
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "3px 0 0" }}>
            {completed} of {total} completed
          </p>
        </div>
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--blue)",
          }}
        >
          {pct}%
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--blue)",
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
