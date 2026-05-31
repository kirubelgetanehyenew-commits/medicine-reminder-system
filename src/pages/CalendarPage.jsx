import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function CalendarPage() {
  const [date, setDate] = useState(new Date());

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

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <h1 className="text-5xl font-bold mb-8">
          Medicine Calendar
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}

          <div className="glass p-6 rounded-3xl">
            <Calendar
              onChange={setDate}
              value={date}
            />
          </div>

          {/* Selected Day */}

          <div className="glass p-6 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Selected Date
            </h2>

            <p className="text-xl">
              {date.toDateString()}
            </p>

            <div className="mt-8">
              <h3 className="text-2xl mb-4">
                Medicines
              </h3>

              {medicines.length === 0 ? (
                <p>
                  No medicines available
                </p>
              ) : (
                medicines.map(
                  (medicine) => (
                    <div
                      key={medicine.id}
                      className="
                        bg-white/10
                        p-4
                        rounded-xl
                        mb-3
                      "
                    >
                      <h4 className="font-bold">
                        {medicine.name}
                      </h4>

                      <p>
                        ⏰{" "}
                        {medicine.time}
                      </p>

                      <p>
                        💊{" "}
                        {
                          medicine.category
                        }
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="glass p-6 rounded-3xl">
            <h3>Total Medicines</h3>

            <h1 className="text-5xl font-bold mt-3">
              {medicines.length}
            </h1>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3>Completed</h3>

            <h1 className="text-5xl font-bold mt-3">
              {
                medicines.filter(
                  (m) =>
                    m.completed
                ).length
              }
            </h1>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3>Pending</h3>

            <h1 className="text-5xl font-bold mt-3">
              {
                medicines.filter(
                  (m) =>
                    !m.completed
                ).length
              }
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;