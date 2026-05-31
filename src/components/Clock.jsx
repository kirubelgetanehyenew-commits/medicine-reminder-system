import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(
    new Date()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass px-6 py-4">
      <h2 className="text-2xl font-bold">
        {time.toLocaleTimeString()}
      </h2>
    </div>
  );
}

export default Clock;