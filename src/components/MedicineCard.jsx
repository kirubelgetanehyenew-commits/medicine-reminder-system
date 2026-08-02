import { FaCheck, FaTrash } from "react-icons/fa";

function MedicineCard({ medicine, deleteMedicine, toggleComplete }) {
  return (
    <div
      className="glass card-hover"
      style={{ padding: "18px 20px" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h2
          style={{
            fontSize: "0.98rem", fontWeight: 700,
            color: "var(--text-heading)", margin: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            maxWidth: "60%",
          }}
        >
          {medicine.name}
        </h2>
        <span className={`badge ${medicine.completed ? "badge-success" : "badge-danger"}`}>
          {medicine.completed ? "Done" : "Pending"}
        </span>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>⏰ {medicine.time}</p>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>💊 {medicine.category}</p>
        {medicine.notes && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)", margin: 0, fontStyle: "italic" }}>
            {medicine.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => toggleComplete(medicine.id)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 0",
            background: "var(--green-bg)", border: "1px solid var(--green-border)",
            color: "var(--green)", borderRadius: "var(--r-sm)",
            cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
            fontFamily: "inherit", transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--green-bg)"}
        >
          <FaCheck size={11} /> Done
        </button>
        <button
          onClick={() => deleteMedicine(medicine.id)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 14px",
            background: "var(--red-bg)", border: "1px solid var(--red-border)",
            color: "var(--red)", borderRadius: "var(--r-sm)",
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--red-bg)"}
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
}

export default MedicineCard;
