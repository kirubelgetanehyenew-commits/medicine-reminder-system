const quotes = [
  { text: "Health is wealth.",           emoji: "💜" },
  { text: "Never skip your medicine.",   emoji: "💊" },
  { text: "Stay strong and healthy.",    emoji: "🚀" },
  { text: "Your health matters.",        emoji: "✨" },
  { text: "Consistency is the key.",     emoji: "🔑" },
];

function QuoteCard() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(99,102,241,0.18))",
        border: "1px solid rgba(20,184,166,0.2)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          fontSize: "2.2rem",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.25)",
          borderRadius: "var(--radius-sm)",
          flexShrink: 0,
        }}
      >
        {q.emoji}
      </div>
      <div>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>
          Daily Motivation
        </p>
        <p style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
          {q.text}
        </p>
      </div>
    </div>
  );
}

export default QuoteCard;
