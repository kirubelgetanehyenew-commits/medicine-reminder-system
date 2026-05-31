import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

function Navbar() {
  return (
    <div className="glass p-5 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-black gradient-text">
          MediTrack Pro
        </h1>

        <p className="text-gray-400">
          Smart Medicine Reminder
        </p>
      </div>

      <div className="flex gap-8 items-center">
        <Link to="/">
          Home
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/reminders">
          Reminders
        </Link>

        <Link to="/calendar">
          Calendar
        </Link>

        <Link to="/add">
          Add
        </Link>

        <ThemeToggle />

        <NotificationBell />
      </div>
    </div>
  );
}

export default Navbar;