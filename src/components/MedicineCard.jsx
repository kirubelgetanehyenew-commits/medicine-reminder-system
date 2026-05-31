import { FaCheck, FaTrash } from "react-icons/fa";

function MedicineCard({
  medicine,
  deleteMedicine,
  toggleComplete,
}) {
  return (
    <div className="glass p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {medicine.name}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
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

      <p className="mt-4 text-xl">
        ⏰ {medicine.time}
      </p>

      <p className="mt-3 text-gray-300">
        {medicine.notes}
      </p>

      <p className="mt-2 text-purple-300">
        💊 {medicine.category}
      </p>

      <div className="flex gap-3 mt-5">
        <button
          onClick={() =>
            toggleComplete(
              medicine.id
            )
          }
          className="bg-green-500 px-4 py-3 rounded-xl"
        >
          <FaCheck />
        </button>

        <button
          onClick={() =>
            deleteMedicine(
              medicine.id
            )
          }
          className="bg-red-500 px-4 py-3 rounded-xl"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default MedicineCard;