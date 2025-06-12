import { Routes, Route, Navigate } from "react-router-dom";
// logo após os outros imports
import type { ReactNode } from "react"; // ← adicione isto

import Login from "./Login"; // ajuste os caminhos se necessário
import MainDashboard from "./MainDashboard";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  return loggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* rota pública de login */}
      <Route path="/" element={<Login />} />

      {/* qualquer outra rota → protegida */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
