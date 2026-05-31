import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reminders from "./pages/Reminders";
import AddMedicine from "./pages/AddMedicine";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/reminders"
          element={<Reminders />}
        />

        <Route
          path="/add"
          element={<AddMedicine />}
        />

        <Route
          path="/calendar"
          element={<CalendarPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;