import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AnalyticsChart from "../components/AnalyticsChart";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const [medicines, setMedicines] =
    useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "medicines"
        )
      ) || [];

    setMedicines(saved);
  }, []);

  const total =
    medicines.length;

  const completed =
    medicines.filter(
      (m) => m.completed
    ).length;

  const pending =
    total - completed;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) *
            100
        );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <div className="mb-10">
          <h1 className="text-5xl font-black">
            Dashboard
          </h1>

          <p className="text-gray-400">
            Welcome Back 👋
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-3xl">
            <h2>Total</h2>

            <h1 className="text-5xl font-bold">
              {total}
            </h1>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h2>Completed</h2>

            <h1 className="text-5xl font-bold">
              {completed}
            </h1>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h2>Pending</h2>

            <h1 className="text-5xl font-bold">
              {pending}
            </h1>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h2>Success</h2>

            <h1 className="text-5xl font-bold">
              {percentage}%
            </h1>
          </div>
        </div>

        <div className="mt-10 glass p-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Weekly Analytics
          </h2>

          <AnalyticsChart />
        </div>

        <div className="mt-10 glass p-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Recent Medicines
          </h2>

          {medicines
            .slice(-5)
            .reverse()
            .map((medicine) => (
              <div
                key={medicine.id}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  border-white/10
                  py-4
                "
              >
                <div>
                  <h3 className="text-xl">
                    {medicine.name}
                  </h3>

                  <p>
                    {medicine.time}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full ${
                    medicine.completed
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {medicine.completed
                    ? "Done"
                    : "Pending"}
                </span>
              </div>
            ))}
        </div>

        <Link
          to="/add"
          className="
            fixed
            bottom-8
            right-8
            bg-purple-600
            w-16
            h-16
            rounded-full
            flex
            items-center
            justify-center
            text-4xl
            shadow-lg
          "
        >
          +
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;