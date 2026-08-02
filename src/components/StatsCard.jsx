function StatsCard({ title, value, icon, color = "rgba(20,184,166,0.12)", border = "rgba(20,184,166,0.2)" }) {
  return (
    <div
      className="card-hover"
      style={{
        background: color,
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-lg)",
        padding: "22px 20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em", margin: "8px 0 0", color: "var(--text-primary)" }}>
            {value}
          </p>
        </div>
        {icon && (
          <div style={{ fontSize: "1.4rem", opacity: 0.8 }}>{icon}</div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
