import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AddMedicine() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Tablet");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !time) {
      alert("Please fill required fields");
      return;
    }

    const medicines =
      JSON.parse(localStorage.getItem("medicines")) || [];

    medicines.push({
      id: Date.now(),
      name,
      time,
      category,
      dosage,
      notes,
      priority,
      completed: false,
    });

    localStorage.setItem(
      "medicines",
      JSON.stringify(medicines)
    );

    alert("Medicine Added Successfully");

    setName("");
    setTime("");
    setCategory("Tablet");
    setDosage("");
    setNotes("");
    setPriority("Medium");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <div className="glass max-w-3xl mx-auto mt-8 p-8 rounded-3xl">
          <h1 className="text-4xl font-bold mb-8">
            Add Medicine
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              placeholder="Medicine Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full p-4 rounded-xl text-black"
            />

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              className="w-full p-4 rounded-xl text-black"
            />

            <input
              type="text"
              placeholder="Dosage (500mg)"
              value={dosage}
              onChange={(e) =>
                setDosage(e.target.value)
              }
              className="w-full p-4 rounded-xl text-black"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full p-4 rounded-xl text-black"
            >
              <option>Tablet</option>
              <option>Capsule</option>
              <option>Syrup</option>
              <option>Injection</option>
            </select>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="w-full p-4 rounded-xl text-black"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <textarea
              rows="4"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="w-full p-4 rounded-xl text-black"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 p-4 rounded-xl"
            >
              Add Medicine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;