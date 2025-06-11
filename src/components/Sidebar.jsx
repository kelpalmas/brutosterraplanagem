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
      <div className="flex items-center gap-100 px-16 h-40 border-b border-gray-800">
        <div className="flex justify-end items-end h-200 px-1 border-b border-gray-800">
          <img
            src="/brutos.png"
            className="h-24 filter drop-shadow-lg"
            alt="Logo Brutos"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col">
        {menu.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className="flex items-center gap-4 px-6 py-3 text-base font-medium text-white"
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        {/* Botão Sair */}
        <div className="mt-auto px-6 mb-8">
          <button className="flex items-center gap-3 text-white hover:text-[#FF6600]">
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </nav>
    </aside>
  );
}
