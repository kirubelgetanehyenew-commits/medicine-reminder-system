import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-7xl font-black leading-tight">
          Your Smart
          <span className="block bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            Medicine Assistant
          </span>
        </h1>

        <p className="mt-8 text-xl text-gray-300 leading-relaxed">
          Track medicines, manage schedules,
          receive reminders, and stay healthy with
          a beautiful modern experience.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link
            to="/add"
            className="bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            Add Medicine
          </Link>

          <Link
            to="/reminders"
            className="border border-white/20 bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition"
          >
            View Reminders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;