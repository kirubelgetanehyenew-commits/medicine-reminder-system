import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function CalendarPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <h1 className="text-5xl font-bold">
          Calendar Page
        </h1>

        <p className="mt-4">
          Calendar will be added here.
        </p>
      </div>
    </div>
  );
}

export default CalendarPage;