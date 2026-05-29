import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Reminders() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingMedicine, setEditingMedicine] =
    useState(null);

  useEffect(() => {
    const storedMedicines =
      JSON.parse(localStorage.getItem("medicines")) || [];

    setMedicines(storedMedicines);
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem(
      "medicines",
      JSON.stringify(data)
    );
  };

  const deleteMedicine = (id) => {
    const updated = medicines.filter(
      (medicine) => medicine.id !== id
    );

    setMedicines(updated);

    saveToLocalStorage(updated);

    toast.success("Medicine Deleted");
  };

  const toggleComplete = (id) => {
    const updated = medicines.map((medicine) => {
      if (medicine.id === id) {
        return {
          ...medicine,
          completed: !medicine.completed,
        };
      }

      return medicine;
    });

    setMedicines(updated);

    saveToLocalStorage(updated);

    toast.success("Status Updated");
  };

  const editMedicine = (medicine) => {
    setEditingMedicine(medicine);
  };

  const saveEdit = () => {
    const updated = medicines.map((medicine) =>
      medicine.id === editingMedicine.id
        ? editingMedicine
        : medicine
    );

    setMedicines(updated);

    saveToLocalStorage(updated);

    setEditingMedicine(null);

    toast.success("Medicine Updated");
  };

  const clearAllMedicines = () => {
    const confirmDelete = window.confirm(
      "Delete all reminders?"
    );

    if (!confirmDelete) return;

    setMedicines([]);

    saveToLocalStorage([]);

    toast.success("All Reminders Deleted");
  };

  const filteredMedicines = medicines
    .filter((medicine) =>
      medicine.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((medicine) => {
      if (filter === "completed") {
        return medicine.completed;
      }

      if (filter === "pending") {
        return !medicine.completed;
      }

      return true;
    });

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">
        <div>
          <h1 className="text-5xl font-black">
            Medicine Reminders
          </h1>

          <p className="text-gray-300 mt-2">
            Manage your medicine schedules easily
          </p>
        </div>

        <button
          onClick={clearAllMedicines}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-bold transition"
        >
          Clear All
        </button>
      </div>

      {/* Search & Filter */}

      <div className="flex flex-col lg:flex-row gap-5 mb-10">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl outline-none"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl outline-none"
        >
          <option value="all">
            All Medicines
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="pending">
            Pending
          </option>
        </select>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[30px]">
          <h3 className="text-gray-300">
            Total Medicines
          </h3>

          <h1 className="text-5xl font-black mt-3">
            {medicines.length}
          </h1>
        </div>

        <div className="bg-green-500/20 border border-green-500/20 p-6 rounded-[30px]">
          <h3 className="text-green-300">
            Completed
          </h3>

          <h1 className="text-5xl font-black mt-3">
            {
              medicines.filter(
                (medicine) =>
                  medicine.completed
              ).length
            }
          </h1>
        </div>

        <div className="bg-red-500/20 border border-red-500/20 p-6 rounded-[30px]">
          <h3 className="text-red-300">
            Pending
          </h3>

          <h1 className="text-5xl font-black mt-3">
            {
              medicines.filter(
                (medicine) =>
                  !medicine.completed
              ).length
            }
          </h1>
        </div>
      </div>

      {/* Medicine Cards */}

      {filteredMedicines.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-300">
            No Medicines Found
          </h2>

          <p className="text-gray-400 mt-3">
            Add new medicines to begin tracking.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredMedicines.map((medicine) => (
            <motion.div
              key={medicine.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[35px] p-7 shadow-2xl"
            >
              {/* Top */}

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black">
                    {medicine.name}
                  </h2>

                  <p className="text-pink-300 mt-2">
                    {medicine.dosage}
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    medicine.completed
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {medicine.completed
                    ? "Completed"
                    : "Pending"}
                </div>
              </div>

              {/* Details */}

              <div className="mt-8 space-y-4">
                <div className="bg-black/20 p-4 rounded-2xl">
                  <p className="text-gray-400 text-sm">
                    Reminder Time
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    ⏰ {medicine.time}
                  </h3>
                </div>

                <div className="bg-black/20 p-4 rounded-2xl">
                  <p className="text-gray-400 text-sm">
                    Notes
                  </p>

                  <p className="mt-2">
                    {medicine.notes ||
                      "No additional notes"}
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div className="grid grid-cols-3 gap-3 mt-8">
                <button
                  onClick={() =>
                    toggleComplete(medicine.id)
                  }
                  className="bg-green-500 hover:bg-green-600 p-3 rounded-2xl font-bold transition"
                >
                  Done
                </button>

                <button
                  onClick={() =>
                    editMedicine(medicine)
                  }
                  className="bg-blue-500 hover:bg-blue-600 p-3 rounded-2xl font-bold transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteMedicine(medicine.id)
                  }
                  className="bg-red-500 hover:bg-red-600 p-3 rounded-2xl font-bold transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}

      {editingMedicine && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-5">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[35px] p-8">
            <h2 className="text-4xl font-black mb-8">
              Edit Medicine
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                value={editingMedicine.name}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    name: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
              />

              <input
                type="text"
                value={editingMedicine.dosage}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    dosage: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
              />

              <input
                type="time"
                value={editingMedicine.time}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    time: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
              />

              <textarea
                value={editingMedicine.notes}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    notes: e.target.value,
                  })
                }
                className="w-full h-32 p-4 rounded-2xl bg-black/20 border border-white/10 outline-none resize-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={saveEdit}
                  className="bg-green-500 hover:bg-green-600 p-4 rounded-2xl font-bold transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={() =>
                    setEditingMedicine(null)
                  }
                  className="bg-red-500 hover:bg-red-600 p-4 rounded-2xl font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminders;