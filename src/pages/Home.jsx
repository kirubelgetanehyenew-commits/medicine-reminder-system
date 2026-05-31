import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="p-8">
      <Navbar />

      <div className="mt-20 text-center">
        <h1 className="text-7xl font-black gradient-text">
          Welcome to MediTrack
        </h1>

        <p className="text-2xl mt-5 text-gray-300">
          Never miss your medicines again.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="glass p-8">
            <h2 className="text-3xl">
              💊 Reminders
            </h2>
          </div>

          <div className="glass p-8">
            <h2 className="text-3xl">
              📊 Analytics
            </h2>
          </div>

          <div className="glass p-8">
            <h2 className="text-3xl">
              📅 Calendar
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;