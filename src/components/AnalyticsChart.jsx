import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-md)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.82rem",
      }}
    >
      <p style={{ fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{label}</p>
      <p style={{ color: "var(--blue)", margin: "4px 0 0", fontWeight: 600 }}>
        {payload[0].value} medicines taken
      </p>
    </div>
  );
};

function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="40%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-subtle)", radius: 6 }} />
        <Bar dataKey="taken" radius={[5, 5, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.taken === Math.max(...data.map(d => d.taken)) ? "#2563eb" : "#bfdbfe"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsChart;
