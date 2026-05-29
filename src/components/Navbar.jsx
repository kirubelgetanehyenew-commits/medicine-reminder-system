import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="backdrop-blur-xl bg-black/20 border-b border-white/10 px-8 py-5 flex flex-wrap gap-5 justify-between items-center sticky top-0 z-50">
      <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
        MedTracker Pro
      </h1>

      <div className="flex flex-wrap gap-6 font-semibold text-gray-200">
        <Link to="/">Home</Link>

        <Link to="/add">Add</Link>

        <Link to="/reminders">Reminders</Link>

        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;