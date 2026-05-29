import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("medicines")) || [];

    setMedicines(data);
  }, []);

  const completed = medicines.filter(
    (medicine) => medicine.completed
  ).length;

  const pending = medicines.length - completed;

  const chartData = {
    labels: ["Completed", "Pending"],

    datasets: [
      {
        data: [completed, pending],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-5xl font-black mb-10">
        Dashboard
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-8">
          <h2 className="text-2xl font-bold mb-6">
            Statistics
          </h2>

          <div className="space-y-4 text-lg">
            <p>
              Total Medicines:
              <span className="font-black ml-2">
                {medicines.length}
              </span>
            </p>

            <p>
              Completed:
              <span className="font-black ml-2 text-green-400">
                {completed}
              </span>
            </p>

            <p>
              Pending:
              <span className="font-black ml-2 text-red-400">
                {pending}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-8 flex justify-center">
          <div className="w-72">
            <Doughnut data={chartData} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-8">
          <h2 className="text-2xl font-bold mb-6">
            Schedule Calendar
          </h2>

          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;