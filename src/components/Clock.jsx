import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(
    new Date()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 text-center">
      <h2 className="text-gray-300">
        Current Time
      </h2>

      <h1 className="text-5xl font-black mt-3">
        {time.toLocaleTimeString()}
      </h1>
    </div>
  );
}

export default Clock;