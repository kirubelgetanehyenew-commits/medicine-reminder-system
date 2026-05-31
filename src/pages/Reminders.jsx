import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Reminders() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTime, setEditTime] = useState("");

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem("medicines")
      ) || [];

    setMedicines(saved);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem(
      "medicines",
      JSON.stringify(data)
    );
  };

  const deleteMedicine = (id) => {
    if (
      !window.confirm(
        "Delete this medicine?"
      )
    )
      return;

    const updated = medicines.filter(
      (m) => m.id !== id
    );

    setMedicines(updated);
    saveToStorage(updated);
  };

  const completeMedicine = (id) => {
    const updated = medicines.map((m) =>
      m.id === id
        ? {
            ...m,
            completed: true,
          }
        : m
    );

    setMedicines(updated);
    saveToStorage(updated);
  };

  const startEdit = (medicine) => {
    setEditingId(medicine.id);
    setEditName(medicine.name);
    setEditTime(medicine.time);
  };

  const saveEdit = () => {
    const updated = medicines.map((m) =>
      m.id === editingId
        ? {
            ...m,
            name: editName,
            time: editTime,
          }
        : m
    );

    setMedicines(updated);
    saveToStorage(updated);

    setEditingId(null);
  };

  const filtered = medicines
    .filter((m) =>
      m.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )
    .filter((m) => {
      if (filter === "Completed")
        return m.completed;

      if (filter === "Pending")
        return !m.completed;

      return true;
    });

  const total = medicines.length;

  const completed =
    medicines.filter(
      (m) => m.completed
    ).length;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <h1 className="text-5xl font-bold mb-8">
          Medicine Reminders
        </h1>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass p-5 rounded-3xl">
            <h3>Total Medicines</h3>
            <h1 className="text-4xl font-bold">
              {total}
            </h1>
          </div>

          <div className="glass p-5 rounded-3xl">
            <h3>Completed</h3>
            <h1 className="text-4xl font-bold">
              {completed}
            </h1>
          </div>

          <div className="glass p-5 rounded-3xl">
            <h3>Success Rate</h3>
            <h1 className="text-4xl font-bold">
              {percentage}%
            </h1>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-8">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search Medicine..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 p-4 rounded-xl text-black"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="p-4 rounded-xl text-black"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((medicine) => (
            <div
              key={medicine.id}
              className="glass p-6 rounded-3xl"
            >
              <div className="flex justify-between items-center">
                {editingId ===
                medicine.id ? (
                  <input
                    value={editName}
                    onChange={(e) =>
                      setEditName(
                        e.target.value
                      )
                    }
                    className="text-black p-2 rounded-lg"
                  />
                ) : (
                  <h2 className="text-3xl font-bold">
                    {medicine.name}
                  </h2>
                )}

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

              <div className="mt-4">
                {editingId ===
                medicine.id ? (
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) =>
                      setEditTime(
                        e.target.value
                      )
                    }
                    className="text-black p-2 rounded-lg"
                  />
                ) : (
                  <p>
                    ⏰ {medicine.time}
                  </p>
                )}

                <p>
                  💊 {medicine.category}
                </p>

                <p>
                  💉{" "}
                  {medicine.dosage ||
                    "Not Set"}
                </p>

                <p>
                  ⚡{" "}
                  {medicine.priority ||
                    "Medium"}
                </p>

                <p>
                  📝{" "}
                  {medicine.notes ||
                    "No Notes"}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() =>
                    completeMedicine(
                      medicine.id
                    )
                  }
                  className="flex-1 bg-green-500 p-3 rounded-xl"
                >
                  Complete
                </button>

                <button
                  onClick={() =>
                    startEdit(
                      medicine
                    )
                  }
                  className="flex-1 bg-blue-500 p-3 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteMedicine(
                      medicine.id
                    )
                  }
                  className="flex-1 bg-red-500 p-3 rounded-xl"
                >
                  Delete
                </button>
              </div>

              {editingId ===
                medicine.id && (
                <button
                  onClick={saveEdit}
                  className="
                    mt-4
                    w-full
                    bg-yellow-500
                    p-3
                    rounded-xl
                  "
                >
                  Save Changes
                </button>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-3xl">
              No Medicines Found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reminders;