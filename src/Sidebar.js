// src/components/Sidebar.jsx
import { FaChartBar, FaFileInvoice, FaHardHat, FaTruckMoving, FaUserCog, FaSignOutAlt, FaMoneyBillWave } from "react-icons/fa";

const menu = [
  { icon: <FaChartBar />, label: "Dashboard" },
  { icon: <FaFileInvoice />, label: "Orçamentos" },
  { icon: <FaHardHat />, label: "Obras em Andamento" },
  { icon: <FaMoneyBillWave />, label: "Fechamento de Obra" },
  { icon: <FaTruckMoving />, label: "Entradas e Saídas" },
  { icon: <FaChartBar />, label: "Relatórios" },
  { icon: <FaUserCog />, label: "Configurações" },
];

export default function Sidebar({ onSelect, selected }) {
  return (
    <aside className="bg-black text-white w-60 min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 h-20 border-b border-gray-800">
        <img src="/logo-brutos.png" className="h-10" alt="Logo Brutos" />
        <span className="font-bold text-lg">BRUTO'S</span>
      </div>
      <nav className="flex-1 flex flex-col">
        {menu.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-4 px-6 py-3 text-base hover:bg-[#FF6600] hover:text-black transition font-medium ${selected === item.label ? "bg-[#FF6600] text-black" : ""}`}
            onClick={() => onSelect(item.label)}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <div className="mt-auto px-6 mb-8">
          <button className="flex items-center gap-3 text-white hover:text-[#FF6600]">
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </nav>
    </aside>
  );
}