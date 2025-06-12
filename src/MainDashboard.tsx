import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar"; // sem extensão, deixa o bundler resolver

import Dashboard from "./pages/Dashboard";
import Orcamentos from "./pages/Orcamentos";
import Obras from "./pages/Obras";
import Fechamento from "./pages/Fechamento";
import EntradasSaidas from "./pages/EntradasSaidas";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";

export default function MainDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Menu lateral fixo */}
      <Sidebar />

      {/* Conteúdo principal da dashboard */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orcamentos" element={<Orcamentos />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/fechamento" element={<Fechamento />} />
          <Route path="/entradassaidas" element={<EntradasSaidas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />

          {/* Redireciona qualquer rota desconhecida para dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
