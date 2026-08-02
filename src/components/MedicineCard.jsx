import { FaCheck, FaTrash } from "react-icons/fa";

function MedicineCard({ medicine, deleteMedicine, toggleComplete }) {
  return (
    <div className="glass card-hover" style={{ padding: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{medicine.name}</h2>
        <span className={`badge ${medicine.completed ? "badge-success" : "badge-danger"}`}>
          {medicine.completed ? "Done" : "Pending"}
        </span>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 4px" }}>⏰ {medicine.time}</p>
      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 4px" }}>💊 {medicine.category}</p>
      {medicine.notes && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontStyle: "italic", margin: "4px 0 0" }}>
          {medicine.notes}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          onClick={() => toggleComplete(medicine.id)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
            color: "#4ade80", borderRadius: "var(--radius-sm)", padding: "9px 0",
            cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(34,197,94,0.12)"}
        >
          <FaCheck /> Done
        </button>
        <button
          onClick={() => deleteMedicine(medicine.id)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171", borderRadius: "var(--radius-sm)", padding: "9px 16px",
            cursor: "pointer", transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default MedicineCard;
