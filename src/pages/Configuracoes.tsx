import React, { useState, useEffect } from "react";

interface Empresa {
  logo: string;
  nome: string;
  descricao: string;
  responsavel: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

interface Usuario {
  nome: string;
  tipo: string;
  master: boolean;
  permissoes?: Permissoes;
}

interface Permissoes {
  dashboard: boolean;
  orcamentos: boolean;
  obras: boolean;
  fechamento: boolean;
  entradasSaidas: boolean;
  relatorios: boolean;
}

export default function Configuracoes() {
  const [empresa, setEmpresa] = useState<Empresa>({
    logo: "/brutos.png",
    nome: "BRUTO'S TERRAPLANAGEM",
    descricao: "Serviços de Terraplanagem e Escavação",
    responsavel: "Cleverson Palma",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { nome: "brutos", tipo: "Administrador", master: true },
  ]);

  const [novoUsuario, setNovoUsuario] = useState<{
    nome: string;
    senha: string;
    confirmaSenha: string;
    permissoes: Permissoes;
  }>({
    nome: "",
    senha: "",
    confirmaSenha: "",
    permissoes: {
      dashboard: true,
      orcamentos: true,
      obras: true,
      fechamento: true,
      entradasSaidas: true,
      relatorios: true,
    },
  });

  useEffect(() => {
    const dadosEmpresaSalvos = localStorage.getItem("dadosEmpresa");
    if (dadosEmpresaSalvos) setEmpresa(JSON.parse(dadosEmpresaSalvos));

    const usuariosSalvos = localStorage.getItem("usuarios");
    if (usuariosSalvos) setUsuarios(JSON.parse(usuariosSalvos));
  }, []);

  function handleChangeEmpresa(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setEmpresa((prev) => ({ ...prev, [name]: value }));
  }

  function salvarDadosEmpresa() {
    localStorage.setItem("dadosEmpresa", JSON.stringify(empresa));
    alert("Informações da empresa salvas com sucesso!");
  }

  function handleChangeUsuario(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  }

  function togglePermissao(chave: keyof Permissoes) {
    setNovoUsuario((prev) => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [chave]: !prev.permissoes[chave],
      },
    }));
  }

  function adicionarUsuario() {
    if (!novoUsuario.nome || !novoUsuario.senha || !novoUsuario.confirmaSenha) {
      alert("Preencha todos os campos do usuário.");
      return;
    }
    if (novoUsuario.senha !== novoUsuario.confirmaSenha) {
      alert("Senhas não conferem.");
      return;
    }
    if (usuarios.some((u) => u.nome === novoUsuario.nome)) {
      alert("Usuário já existe.");
      return;
    }

    const usuario: Usuario = {
      nome: novoUsuario.nome,
      tipo: "Usuário",
      permissoes: novoUsuario.permissoes,
      master: false,
    };

    const novosUsuarios = [...usuarios, usuario];
    setUsuarios(novosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(novosUsuarios));

    setNovoUsuario({
      nome: "",
      senha: "",
      confirmaSenha: "",
      permissoes: {
        dashboard: true,
        orcamentos: true,
        obras: true,
        fechamento: true,
        entradasSaidas: true,
        relatorios: true,
      },
    });

    alert("Usuário adicionado com sucesso!");
  }

  return (
    <div className="p-10 flex flex-wrap gap-10 bg-gray-100 min-h-screen">
      {/* Bloco 1 - Logo e Informações da Empresa */}
      <div className="bg-white rounded-lg shadow p-6 flex-grow min-w-[320px] max-w-xl">
        <h2 className="text-xl font-bold mb-6">
          Logo e Informações da Empresa
        </h2>

        <label className="block mb-2 font-semibold">Logo da Empresa</label>
        <div className="border border-dashed border-gray-400 rounded-md p-4 mb-4 flex justify-center items-center">
          <img src={empresa.logo} alt="Logo da Empresa" className="h-32" />
        </div>
        <input
          type="text"
          name="logo"
          value={empresa.logo}
          onChange={handleChangeEmpresa}
          placeholder="URL do logo"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
        />

        <label className="block mb-2 font-semibold">Nome da Empresa</label>
        <input
          type="text"
          name="nome"
          value={empresa.nome}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold">Descrição</label>
        <textarea
          name="descricao"
          value={empresa.descricao}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows={3}
        />

        <label className="block mb-2 font-semibold">Nome do Responsável</label>
        <input
          type="text"
          name="responsavel"
          value={empresa.responsavel}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold">CNPJ</label>
        <input
          type="text"
          name="cnpj"
          value={empresa.cnpj}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="00.000.000/0000-00"
        />

        <label className="block mb-2 font-semibold">Telefone</label>
        <input
          type="tel"
          name="telefone"
          value={empresa.telefone}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="(00) 00000-0000"
        />

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={empresa.email}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="email@exemplo.com"
        />

        <label className="block mb-2 font-semibold">Endereço</label>
        <input
          type="text"
          name="endereco"
          value={empresa.endereco}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold">Cidade</label>
        <input
          type="text"
          name="cidade"
          value={empresa.cidade}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold">Estado</label>
        <input
          type="text"
          name="estado"
          value={empresa.estado}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold">CEP</label>
        <input
          type="text"
          name="cep"
          value={empresa.cep}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          placeholder="00000-000"
        />

        <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>

        <label className="block mb-2 font-semibold">Facebook</label>
        <input
          type="text"
          name="facebook"
          value={empresa.facebook}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="https://facebook.com/suaempresa"
        />

        <label className="block mb-2 font-semibold">Instagram</label>
        <input
          type="text"
          name="instagram"
          value={empresa.instagram}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="https://instagram.com/suaempresa"
        />

        <label className="block mb-2 font-semibold">LinkedIn</label>
        <input
          type="text"
          name="linkedin"
          value={empresa.linkedin}
          onChange={handleChangeEmpresa}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          placeholder="https://linkedin.com/in/suaempresa"
        />

        <button
          onClick={salvarDadosEmpresa}
          className="bg-[#FF6600] text-white px-4 py-3 rounded w-full font-semibold hover:bg-[#e65500] transition"
        >
          Salvar Informações
        </button>
      </div>

      {/* Bloco 2 - Gerenciamento de Usuários */}
      <div className="bg-white rounded-lg shadow p-6 flex-grow min-w-[320px] max-w-xl">
        <h2 className="text-xl font-bold mb-6">Gerenciamento de Usuários</h2>

        <table className="w-full border-collapse mb-6 text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th className="p-2 border border-gray-300">Usuário</th>
              <th className="p-2 border border-gray-300">Tipo</th>
              <th className="p-2 border border-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr
                key={user.nome}
                className="border border-gray-300 hover:bg-gray-50 cursor-default"
              >
                <td className="p-2 border border-gray-300">{user.nome}</td>
                <td className="p-2 border border-gray-300">{user.tipo}</td>
                <td className="p-2 border border-gray-300 text-gray-400">
                  {user.master ? "Usuário Master" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-semibold mb-3">Adicionar Novo Usuário</h3>

        <input
          type="text"
          placeholder="Nome de Usuário"
          name="nome"
          value={novoUsuario.nome}
          onChange={handleChangeUsuario}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <input
          type="password"
          placeholder="Senha"
          name="senha"
          value={novoUsuario.senha}
          onChange={handleChangeUsuario}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <input
          type="password"
          placeholder="Confirmar Senha"
          name="confirmaSenha"
          value={novoUsuario.confirmaSenha}
          onChange={handleChangeUsuario}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <div className="mb-4">
          <p className="font-semibold mb-2">Permissões</p>
          <label className="flex items-center gap-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={novoUsuario.permissoes.dashboard}
              onChange={() => togglePermissao("dashboard")}
            />
            Dashboard
          </label>
          <label className="flex items-center gap-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={novoUsuario.permissoes.orcamentos}
              onChange={() => togglePermissao("orcamentos")}
            />
            Orçamentos
          </label>
          <label className="flex items-center gap-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={novoUsuario.permissoes.obras}
              onChange={() => togglePermissao("obras")}
            />
            Obras em Andamento
          </label>
          <label className="flex items-center gap-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={novoUsuario.permissoes.fechamento}
              onChange={() => togglePermissao("fechamento")}
            />
            Fechamento de Obra
          </label>
          <label className="flex items-center gap-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={novoUsuario.permissoes.entradasSaidas}
              onChange={() => togglePermissao("entradasSaidas")}
            />
            Entradas e Saídas
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={novoUsuario.permissoes.relatorios}
              onChange={() => togglePermissao("relatorios")}
            />
            Relatórios
          </label>
        </div>

        <button
          onClick={adicionarUsuario}
          className="bg-[#FF6600] text-white px-4 py-3 rounded w-full font-semibold hover:bg-[#e65500] transition"
        >
          Adicionar Usuário
        </button>
      </div>
    </div>
  );
}