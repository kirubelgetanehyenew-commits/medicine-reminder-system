const cron = require("node-cron");
const db   = require("./db");
const { sendMedicineReminder } = require("./services/notificationService");

/**
 * Runs every minute.
 * Checks all medicines whose time matches HH:MM (current minute),
 * whose frequency matches today, and haven't been notified yet today.
 */

function getTodayStr() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getCurrentHHMM() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, "0");
  const m   = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function getDayOfWeek() {
  // 0=Sun, 1=Mon … 6=Sat
  return new Date().getDay();
}

function shouldFireToday(medicine) {
  const today    = getTodayStr();
  const freq     = (medicine.frequency || "Daily").toLowerCase();
  const medDate  = medicine.date; // YYYY-MM-DD start date

  // Don't notify for medicines whose start date is in the future
  if (medDate && medDate > today) return false;

  // Don't notify for already-completed medicines
  if (medicine.completed) return false;

  if (freq === "daily")     return true;
  if (freq === "as needed") return false; // user-triggered only

  if (freq === "weekly") {
    // Fire on the same weekday as the medicine start date
    const startDay = new Date(medDate + "T00:00:00").getDay();
    return getDayOfWeek() === startDay;
  }

  if (freq === "monthly") {
    // Fire on the same day-of-month as the start date
    const startDOM = new Date(medDate + "T00:00:00").getDate();
    return new Date().getDate() === startDOM;
  }

  return true;
}

async function checkAndNotify() {
  const currentTime = getCurrentHHMM();
  const today       = getTodayStr();

  const allMedicines = db.getAllMedicines();

  // Filter to medicines whose scheduled time matches right now
  const due = allMedicines.filter(
    (m) => m.time === currentTime && shouldFireToday(m)
  );

  if (due.length === 0) return;

  console.log(`[Scheduler] ${currentTime} — ${due.length} medicine(s) due.`);

  for (const medicine of due) {
    // Skip if already notified today
    if (db.wasNotified(medicine.id, today)) {
      console.log(`[Scheduler] Already notified for ${medicine.name} (${medicine.id}) today.`);
      continue;
    }

    const user = db.findUserById(medicine.userId);
    if (!user) {
      console.warn(`[Scheduler] No user found for medicine ${medicine.id}`);
      continue;
    }

    console.log(`[Scheduler] Sending reminder → ${user.email} | ${medicine.name}`);

    const result = await sendMedicineReminder({ user, medicine });

    // Log so we don't resend this minute
    db.markNotified(medicine.id, today, {
      email: result.email.success,
      sms:   result.sms.success,
    });

    console.log(
      `[Scheduler] Result for ${medicine.name}: ` +
      `email=${result.email.success} sms=${result.sms.success}`
    );
  }
}

function startScheduler() {
  console.log("[Scheduler] Starting — checking every minute for due medicines.");

  // Run every minute at second :00
  cron.schedule("* * * * *", () => {
    checkAndNotify().catch((err) =>
      console.error("[Scheduler] Unexpected error:", err.message)
    );
  });
}

module.exports = { startScheduler };
