// src/Configuracoes.tsx
import React, { useState } from "react";

export default function Configuracoes() {
  // Mock dos campos de empresa
  const [nomeEmpresa, setNomeEmpresa] = useState("BRUTO'S TERRAPLANAGEM");
  const [descricao, setDescricao] = useState(
    "Serviços de Terraplanagem e Escavação"
  );
  const [responsavel, setResponsavel] = useState("Cleverson Palma");

  // Usuários cadastrados (mock)
  const [usuarios, setUsuarios] = useState([
    { usuario: "brutos", tipo: "Administrador", master: true },
  ]);
  const [novoUsuario, setNovoUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [permissoes, setPermissoes] = useState({
    dashboard: true,
    orcamentos: true,
    obras: true,
    fechamento: true,
    entradas: true,
    relatorios: true,
  });

  // Salvar informações da empresa
  const salvarInfo = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Informações salvas!");
    // Aqui vai o post pro backend no futuro
  };

  // Adicionar novo usuário
  const adicionarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmaSenha) {
      alert("As senhas não coincidem");
      return;
    }
    setUsuarios([
      ...usuarios,
      { usuario: novoUsuario, tipo: "Comum", master: false },
    ]);
    setNovoUsuario("");
    setNovaSenha("");
    setConfirmaSenha("");
    // Aqui salva no banco depois
  };

  return (
    <div className="min-h-screen bg-[#222] flex flex-col">
      {/* Sidebar simulada */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col gap-3 min-h-screen fixed">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-[#FF6600] rounded p-2 text-xl font-bold">n/z</div>
          <span className="font-bold text-lg">BRUTO'S</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Dashboard
          </a>
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Orçamentos
          </a>
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Obras em Andamento
          </a>
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Fechamento de Obra
          </a>
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Entradas e Saídas
          </a>
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Relatórios
          </a>
          <a className="bg-[#FF6600] rounded p-2 font-bold" href="#">
            Configurações
          </a>
          <a className="hover:bg-[#222] rounded p-2" href="#">
            Sair
          </a>
        </nav>
      </aside>
      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center pl-64">
        <div className="w-full max-w-5xl flex gap-8 mt-12">
          {/* Esquerda: Dados empresa */}
          <section className="bg-white rounded-xl shadow-lg p-8 flex-1">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-[#ff6600] p-4 rounded-lg mb-4">
                {/* Logo fictício */}
                <span className="text-white text-4xl font-bold">n/z</span>
              </div>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">
                  Logo e Informações da Empresa
                </h2>
              </div>
            </div>
            <form onSubmit={salvarInfo}>
              <div className="mb-4">
                <label className="block text-gray-700">Nome da Empresa</label>
                <input
                  className="w-full p-2 border rounded"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Descrição</label>
                <input
                  className="w-full p-2 border rounded"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Nome do Responsável
                </label>
                <input
                  className="w-full p-2 border rounded"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#ff6600] text-white py-2 rounded font-bold mt-2 hover:bg-orange-600"
              >
                Salvar Informações
              </button>
            </form>
          </section>
          {/* Direita: Gerenciamento de Usuários */}
          <section className="bg-white rounded-xl shadow-lg p-8 flex-1">
            <h2 className="text-lg font-bold mb-4">
              Gerenciamento de Usuários
            </h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Usuário</th>
                  <th className="text-left">Tipo</th>
                  <th className="text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td>{u.usuario}</td>
                    <td>{u.tipo}</td>
                    <td>
                      {u.master ? (
                        <span className="text-gray-500">Usuário Master</span>
                      ) : (
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            setUsuarios(usuarios.filter((_, i) => i !== idx));
                          }}
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={adicionarUsuario} className="flex flex-col gap-2">
              <input
                className="p-2 border rounded"
                placeholder="Nome de Usuário"
                value={novoUsuario}
                onChange={(e) => setNovoUsuario(e.target.value)}
                required
              />
              <input
                className="p-2 border rounded"
                placeholder="Senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                type="password"
                required
              />
              <input
                className="p-2 border rounded"
                placeholder="Confirmar Senha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                type="password"
                required
              />
              {/* Permissões mock */}
              <div className="mb-2">
                <div className="font-bold mb-1">Permissões</div>
                {Object.keys(permissoes).map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={permissoes[key as keyof typeof permissoes]}
                      onChange={() =>
                        setPermissoes({
                          ...permissoes,
                          [key]: !permissoes[key as keyof typeof permissoes],
                        })
                      }
                    />
                    {key.charAt(0).toUpperCase() +
                      key
                        .slice(1)
                        .replace("fechamento", "Fechamento de Obra")
                        .replace("entradas", "Entradas e Saídas")}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="bg-[#ff6600] text-white py-2 rounded font-bold hover:bg-orange-600 flex items-center justify-center gap-2 mt-2"
              >
                <span>Adicionar Usuário</span>
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
