import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import MainDashboard from "./MainDashboard";

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  return loggedIn ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}