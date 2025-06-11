import React from "react";

// Simulação de Sidebar, você pode deixar em um componente separado se quiser
const Sidebar = () => (
  <aside className="bg-black text-white w-64 min-h-screen flex flex-col px-4 py-8 fixed left-0 top-0">
    <div className="mb-10 flex items-center gap-3">
      <div className="bg-[#FF6600] p-3 rounded-lg text-2xl font-bold">B</div>
      <span className="font-bold text-xl">BRUTO'S</span>
    </div>
    <nav className="flex flex-col gap-2">
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Dashboard
      </a>
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Orçamentos
      </a>
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Obras em Andamento
      </a>
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Fechamento de Obra
      </a>
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Entradas e Saídas
      </a>
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Relatórios
      </a>
      <a href="#" className="bg-[#FF6600] rounded px-2 py-2 font-bold">
        Configurações
      </a>
      <a href="#" className="hover:bg-[#222] rounded px-2 py-2">
        Sair
      </a>
    </nav>
  </aside>
);

export default function MainDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 bg-[#222] min-h-screen p-12">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#FF6600] mb-4">
            Bem-vindo ao sistema administrativo!
          </h1>
          {/* Aqui você vai colocando o conteúdo do dashboard */}
        </div>
      </main>
    </div>
  );
}
