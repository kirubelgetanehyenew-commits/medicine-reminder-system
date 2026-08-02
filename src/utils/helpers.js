/**
 * Format a time string (HH:MM) to 12-hour format.
 * e.g. "14:30" → "2:30 PM"
 */
export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Return a human-readable relative date string.
 * e.g. "Today", "Tomorrow", "Aug 5"
 */
export function friendlyDate(dateStr) {
  if (!dateStr) return "";
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const d = new Date(dateStr + "T00:00:00");
  if (d.toDateString() === today.toDateString())    return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Get a priority color for badges/icons.
 */
export function priorityColor(priority) {
  return priority === "High" ? "#f87171"
       : priority === "Medium" ? "#fbbf24"
       : "#4ade80";
}

/**
 * Truncate a string to a given length.
 */
export function truncate(str, max = 60) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}
