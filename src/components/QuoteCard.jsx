const quotes = [
  "Consistency in medication is the foundation of good health.",
  "Small daily habits build long-term wellness.",
  "Your health is your most valuable asset.",
  "A dose of discipline keeps illness at bay.",
  "Stay consistent — your future self will thank you.",
];

function QuoteCard() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div
      style={{
        background: "var(--blue-muted)",
        border: "1px solid var(--blue-light)",
        borderRadius: "var(--r-lg)",
        padding: "18px 22px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <span
        style={{
          fontSize: "1.1rem",
          marginTop: 2,
          flexShrink: 0,
          opacity: 0.7,
        }}
      >
        💡
      </span>
      <div>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--blue)",
            margin: "0 0 5px",
          }}
        >
          Daily Tip
        </p>
        <p
          style={{
            fontSize: "0.88rem",
            fontWeight: 500,
            color: "var(--text-heading)",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {q}
        </p>
      </div>
    </div>
  );
}

export default QuoteCard;
