import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

import {
  FaCheck,
  FaTrash,
  FaEdit,
  FaSearch,
  FaFilePdf,
} from "react-icons/fa";

import Confetti from "react-confetti";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

function Reminders() {
  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [editingMedicine, setEditingMedicine] =
    useState(null);

  const [showConfetti, setShowConfetti] =
    useState(false);

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

    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    toast.success("Medicine Completed");
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

    toast.success("All Medicines Deleted");
  };

  const exportPDF = async () => {
    const input =
      document.getElementById(
        "medicine-reminders"
      );

    const canvas =
      await html2canvas(input);

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      210,
      297
    );

    pdf.save("medicines.pdf");

    toast.success("PDF Exported");
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
    })
    .sort((a, b) =>
      a.time.localeCompare(b.time)
    );

  const completedCount = medicines.filter(
    (medicine) => medicine.completed
  ).length;

  const pendingCount =
    medicines.length - completedCount;

  const completionRate =
    medicines.length === 0
      ? 0
      : Math.round(
          (completedCount / medicines.length) *
            100
        );

  const currentHour =
    new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning ☀️"
      : currentHour < 18
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  return (
    <div
      id="medicine-reminders"
      className="min-h-screen px-6 py-10"
    >
      {showConfetti && <Confetti />}

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row justify-between gap-6 mb-10">
        <div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            Medicine Reminders
          </h1>

          <h2 className="text-2xl text-gray-300 mt-3">
            {greeting}
          </h2>

          <p className="text-gray-400 mt-2 text-lg">
            Stay healthy and never miss your
            medicines.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportPDF}
            className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            <FaFilePdf />

            Export PDF
          </button>

          <button
            onClick={clearAllMedicines}
            className="bg-red-500 hover:bg-red-600 transition px-6 py-4 rounded-2xl font-bold"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}

      <div className="grid lg:grid-cols-3 gap-5 mb-10">
        <div className="lg:col-span-2 relative">
          <FaSearch className="absolute left-5 top-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-14 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 outline-none"
          />
        </div>

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

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-7 rounded-[30px]">
          <p className="text-gray-300">
            Total Medicines
          </p>

          <h1 className="text-5xl font-black mt-3">
            {medicines.length}
          </h1>
        </div>

        <div className="bg-green-500/20 border border-green-500/20 p-7 rounded-[30px]">
          <p className="text-green-300">
            Completed
          </p>

          <h1 className="text-5xl font-black mt-3">
            {completedCount}
          </h1>
        </div>

        <div className="bg-red-500/20 border border-red-500/20 p-7 rounded-[30px]">
          <p className="text-red-300">
            Pending
          </p>

          <h1 className="text-5xl font-black mt-3">
            {pendingCount}
          </h1>
        </div>

        <div className="bg-cyan-500/20 border border-cyan-500/20 p-7 rounded-[30px]">
          <p className="text-cyan-300">
            Completion Rate
          </p>

          <h1 className="text-5xl font-black mt-3">
            {completionRate}%
          </h1>
        </div>
      </div>

      {/* EMPTY STATE */}

      {filteredMedicines.length === 0 ? (
        <div className="text-center mt-28">
          <h1 className="text-8xl">
            💊
          </h1>

          <h2 className="text-5xl font-black mt-6">
            No Medicines Found
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Add medicines to start tracking your
            health.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {filteredMedicines.map((medicine) => (
            <motion.div
              key={medicine.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                scale: 1.03,
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[35px] p-7 shadow-2xl"
            >
              {/* TOP */}

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

              {/* BADGES */}

              <div className="flex flex-wrap gap-3 mt-5">
                <span className="bg-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm">
                  {medicine.category ||
                    "General"}
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-sm ${
                    medicine.priority === "High"
                      ? "bg-red-500/20 text-red-300"
                      : medicine.priority ===
                        "Medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {medicine.priority ||
                    "Medium"}{" "}
                  Priority
                </span>
              </div>

              {/* DETAILS */}

              <div className="space-y-4 mt-7">
                <div className="bg-black/20 p-5 rounded-2xl">
                  <p className="text-gray-400 text-sm">
                    Reminder Time
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    ⏰ {medicine.time}
                  </h3>
                </div>

                <div className="bg-black/20 p-5 rounded-2xl">
                  <p className="text-gray-400 text-sm">
                    Notes
                  </p>

                  <p className="mt-2 text-gray-200">
                    {medicine.notes ||
                      "No additional notes"}
                  </p>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-3 gap-4 mt-8">
                <button
                  onClick={() =>
                    toggleComplete(medicine.id)
                  }
                  className="bg-green-500 hover:bg-green-600 transition p-4 rounded-2xl flex items-center justify-center"
                >
                  <FaCheck />
                </button>

                <button
                  onClick={() =>
                    editMedicine(medicine)
                  }
                  className="bg-blue-500 hover:bg-blue-600 transition p-4 rounded-2xl flex items-center justify-center"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() =>
                    deleteMedicine(medicine.id)
                  }
                  className="bg-red-500 hover:bg-red-600 transition p-4 rounded-2xl flex items-center justify-center"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}

      {editingMedicine && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-5">
          <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[35px] p-8">
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

              <input
                type="text"
                value={
                  editingMedicine.category
                }
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    category: e.target.value,
                  })
                }
                placeholder="Category"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
              />

              <select
                value={
                  editingMedicine.priority
                }
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    priority: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
              >
                <option value="Low">
                  Low Priority
                </option>

                <option value="Medium">
                  Medium Priority
                </option>

                <option value="High">
                  High Priority
                </option>
              </select>

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

              <div className="grid grid-cols-2 gap-5 pt-3">
                <button
                  onClick={saveEdit}
                  className="bg-green-500 hover:bg-green-600 transition p-4 rounded-2xl font-bold"
                >
                  Save Changes
                </button>

                <button
                  onClick={() =>
                    setEditingMedicine(null)
                  }
                  className="bg-red-500 hover:bg-red-600 transition p-4 rounded-2xl font-bold"
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