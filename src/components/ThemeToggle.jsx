import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-3 rounded-lg bg-purple-600 text-white"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;