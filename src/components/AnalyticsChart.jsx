import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const data = [
  { day: "Mon", taken: 4 },
  { day: "Tue", taken: 6 },
  { day: "Wed", taken: 5 },
  { day: "Thu", taken: 7 },
  { day: "Fri", taken: 3 },
  { day: "Sat", taken: 5 },
  { day: "Sun", taken: 4 },
];

const COLORS = ["#14b8a6", "#6366f1", "#14b8a6", "#6366f1", "#14b8a6", "#6366f1", "#14b8a6"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: 700, color: "var(--text-primary)" }}>{label}</p>
        <p style={{ margin: "4px 0 0", color: "var(--accent-light)" }}>
          {payload[0].value} medicines taken
        </p>
      </div>
    );
  }
  return null;
};

function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="taken" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsChart;
