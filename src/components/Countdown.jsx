function Countdown({ medicineTime }) {
  return (
    <div
      style={{
        background: "rgba(99,102,241,0.1)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "var(--radius-sm)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ fontSize: "1.3rem" }}>⏳</span>
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
          Upcoming Reminder
        </p>
        <p style={{ fontWeight: 700, fontSize: "1rem", margin: "3px 0 0", color: "#a5b4fc" }}>
          {medicineTime}
        </p>
      </div>
    </div>
  );
}

export default Countdown;
