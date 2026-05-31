import { useState } from "react";

function ReminderForm({ addMedicine }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Tablet");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !time) {
      alert("Please enter medicine name and time");
      return;
    }

    addMedicine({
      id: Date.now(),
      name,
      time,
      notes,
      category,
      completed: false,
    });

    setName("");
    setTime("");
    setNotes("");
    setCategory("Tablet");
  };

  return (
    <div className="glass p-8 mt-6">
      <h2 className="text-3xl font-bold mb-6">
        Add Medicine Reminder
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Medicine Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="p-4 rounded-xl bg-white/10 text-white outline-none"
          />

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
            className="p-4 rounded-xl bg-white/10 text-white outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full mt-4 p-4 rounded-xl bg-white/10 text-white outline-none"
        >
          <option value="Tablet">Tablet</option>
          <option value="Syrup">Syrup</option>
          <option value="Injection">Injection</option>
          <option value="Vitamin">Vitamin</option>
        </select>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="w-full mt-4 p-4 rounded-xl bg-white/10 text-white outline-none"
          rows="4"
        />

        <button
          type="submit"
          className="primary-btn mt-5"
        >
          Add Reminder
        </button>
      </form>
    </div>
  );
}

export default ReminderForm;