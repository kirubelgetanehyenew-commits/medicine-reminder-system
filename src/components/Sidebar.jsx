import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 glass min-h-screen p-6">
      <h1 className="text-4xl font-black gradient-text mb-10">
        💊 MediTrack
      </h1>

      <div className="flex flex-col gap-5 text-lg">
        <Link to="/">
          🏠 Home
        </Link>

        <Link to="/dashboard">
          📊 Dashboard
        </Link>

        <Link to="/reminders">
          ⏰ Reminders
        </Link>

        <Link to="/calendar">
          📅 Calendar
        </Link>

        <Link to="/add">
          ➕ Add Medicine
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;