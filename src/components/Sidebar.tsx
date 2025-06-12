import React from "react";
import {
  FaChartBar,
  FaFileInvoice,
  FaHardHat,
  FaTruckMoving,
  FaUserCog,
  FaSignOutAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menu = [
  { icon: <FaChartBar />, label: "Dashboard", path: "/dashboard" },
  { icon: <FaFileInvoice />, label: "Orçamentos", path: "/orcamentos" },
  { icon: <FaHardHat />, label: "Obras em Andamento", path: "/obras" },
  {
    icon: <FaMoneyBillWave />,
    label: "Fechamento de Obra",
    path: "/fechamento",
  },
  {
    icon: <FaTruckMoving />,
    label: "Entradas e Saídas",
    path: "/entradassaidas",
  },
  { icon: <FaChartBar />, label: "Relatórios", path: "/relatorios" },
  { icon: <FaUserCog />, label: "Configurações", path: "/configuracoes" },
];

export default function Sidebar() {
  return (
    <aside className="bg-[#FFA500] text-white w-60 min-h-screen flex flex-col">
      {/* Logo fixada em cima */}
      <div className="flex items-center justify-center h-40 border-b border-gray-800">
        <img
          src="/brutos.png"
          alt="Logo Brutos"
          className="h-24 filter drop-shadow-lg"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col">
        {menu.map(({ icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 text-base font-medium ${
                isActive
                  ? "bg-white text-[#FFA500]"
                  : "text-white hover:bg-[#e69500]"
              } rounded`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}

        {/* Botão Sair */}
        <div className="mt-auto px-6 mb-8">
          <button
            type="button"
            className="flex items-center gap-3 text-white hover:text-[#FF6600] transition-colors"
            onClick={() => {
              localStorage.removeItem("loggedIn");
              window.location.reload();
            }}
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </nav>
    </aside>
  );
}
