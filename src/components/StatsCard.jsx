function StatsCard({ title, value, icon, accent = "var(--blue)" }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p className="stat-label">{title}</p>
        {icon && (
          <div
            style={{
              width: 34, height: 34, borderRadius: "var(--r-sm)",
              background: "var(--bg-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: accent, fontSize: "1rem",
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="stat-value">{value}</p>
    </div>
  );
}

export default StatsCard;
