import { FaBell } from "react-icons/fa";
import { useState } from "react";

function NotificationBell() {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpen(!open)
        }
      >
        <FaBell size={22} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 glass p-4 w-72 z-50">
          <h3 className="font-bold mb-3">
            Notifications
          </h3>

          <p>
            💊 Vitamin D - 8:00 AM
          </p>

          <p>
            💊 Paracetamol - 1:00 PM
          </p>

          <p>
            💊 Calcium - 9:00 PM
          </p>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;