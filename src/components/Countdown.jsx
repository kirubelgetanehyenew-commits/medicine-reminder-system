function Countdown({
  medicineTime,
}) {
  return (
    <div className="bg-black/20 p-4 rounded-2xl mt-4">
      <p className="text-gray-400">
        Upcoming Reminder
      </p>

      <h3 className="text-2xl font-bold mt-2">
        ⏳ {medicineTime}
      </h3>
    </div>
  );
}

export default Countdown;