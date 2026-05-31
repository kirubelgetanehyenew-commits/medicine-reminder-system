import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AddMedicine() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [category, setCategory] = useState("Tablet");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !time || !date) {
      alert("Please fill all required fields");
      return;
    }

    const medicines =
      JSON.parse(localStorage.getItem("medicines")) || [];

    const newMedicine = {
      id: Date.now(),
      name,
      time,
      date,
      frequency,
      category,
      dosage,
      notes,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    medicines.push(newMedicine);

    localStorage.setItem(
      "medicines",
      JSON.stringify(medicines)
    );

    alert("Medicine Added Successfully!");

    setName("");
    setTime("");
    setDate("");
    setFrequency("Daily");
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

        <div className="max-w-5xl mx-auto add-medicine-card">
          <div className="mb-8">
            <h1 className="add-title">
              Add Medicine
            </h1>

            <p className="add-subtitle">
              Schedule and manage your medications
              easily.
            </p>
          </div>

          <div className="feature-row">
            <div className="feature-box">
              💊 Medicine
            </div>

            <div className="feature-box">
              ⏰ Schedule
            </div>

            <div className="feature-box">
              📅 Calendar
            </div>

            <div className="feature-box">
              🔔 Reminder
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="add-form"
          >
            <input
              type="text"
              placeholder="Medicine Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="modern-input"
            />

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              className="modern-input"
            />

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="modern-input"
            />

            <input
              type="text"
              placeholder="Dosage (500mg)"
              value={dosage}
              onChange={(e) =>
                setDosage(e.target.value)
              }
              className="modern-input"
            />

            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value)
              }
              className="modern-input"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="modern-input"
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
              className="modern-input"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <div></div>

            <textarea
              rows="5"
              placeholder="Medicine Notes..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="modern-input full-width"
            />

            <button
              type="submit"
              className="add-btn full-width"
            >
              ➕ Add Medicine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;