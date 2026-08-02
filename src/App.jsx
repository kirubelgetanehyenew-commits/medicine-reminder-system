import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import Reminders       from "./pages/Reminders";
import AddMedicine     from "./pages/AddMedicine";
import CalendarPage    from "./pages/CalendarPage";
import Profile         from "./pages/Profile";
import MedicineHistory from "./pages/MedicineHistory";
import ProtectedRoute  from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />}     />
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/add"       element={<ProtectedRoute><AddMedicine /></ProtectedRoute>} />
        <Route path="/calendar"  element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/history"   element={<ProtectedRoute><MedicineHistory /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
