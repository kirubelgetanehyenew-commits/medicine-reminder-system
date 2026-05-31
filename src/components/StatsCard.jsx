function StatsCard({ title, value }) {
  return (
    <div className="glass p-6">
      <p className="text-gray-400">
        {title}
      </p>

      <h1 className="text-5xl font-black mt-3">
        {value}
      </h1>
    </div>
  );
}

export default StatsCard;