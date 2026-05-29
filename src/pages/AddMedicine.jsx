import { useState } from "react";
import toast from "react-hot-toast";

function AddMedicine() {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    time: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const medicine = {
      id: Date.now(),
      ...formData,
      completed: false,
    };

    const existingMedicines =
      JSON.parse(localStorage.getItem("medicines")) || [];

    existingMedicines.push(medicine);

    localStorage.setItem(
      "medicines",
      JSON.stringify(existingMedicines)
    );

    toast.success("Medicine Added Successfully");

    setFormData({
      name: "",
      dosage: "",
      time: "",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg backdrop-blur-xl bg-white/10 border border-white/10 rounded-[30px] p-10 shadow-2xl"
      >
        <h1 className="text-4xl font-black mb-8 text-center">
          Add Medicine
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Medicine Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
            required
          />

          <input
            type="text"
            name="dosage"
            placeholder="Dosage (e.g. 2 pills)"
            value={formData.dosage}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none"
            required
          />

          <textarea
            name="notes"
            placeholder="Extra Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none h-32 resize-none"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 p-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition"
          >
            Save Reminder
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMedicine;