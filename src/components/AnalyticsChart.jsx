import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    day: "Mon",
    taken: 4,
  },
  {
    day: "Tue",
    taken: 6,
  },
  {
    day: "Wed",
    taken: 5,
  },
  {
    day: "Thu",
    taken: 7,
  },
  {
    day: "Fri",
    taken: 3,
  },
];

function AnalyticsChart() {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="taken" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsChart;