function ProgressBar({ completed, total }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="glass" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <p style={{ fontWeight: 700, margin: 0, fontSize: "0.95rem" }}>Daily Progress</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "2px 0 0" }}>
            {completed} of {total} completed
          </p>
        </div>
        <span
          style={{
            fontSize: "1.6rem",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: percentage >= 80 ? "#4ade80" : percentage >= 50 ? "#fbbf24" : "var(--accent-light)",
          }}
        >
          {percentage}%
        </span>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
