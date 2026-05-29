function ProgressBar({
  completed,
  total,
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">
          Daily Progress
        </h2>

        <span>{percentage}%</span>
      </div>

      <div className="w-full bg-black/20 h-5 rounded-full overflow-hidden">
        <div
          style={{
            width: `${percentage}%`,
          }}
          className="bg-gradient-to-r from-pink-500 to-violet-500 h-full rounded-full transition-all duration-500"
        />
      </div>
    </div>
  );
}

export default ProgressBar;