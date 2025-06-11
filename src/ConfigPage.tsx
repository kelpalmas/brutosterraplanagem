// src/pages/ConfigPage.tsx
import { useState } from "react";

export default function ConfigPage() {
  // States dos campos
  const [logo, setLogo] = useState<string | null>(null);
  const [nome, setNome] = useState("BRUTO'S TERRAPLANAGEM");
  const [descricao, setDescricao] = useState(
    "Serviços de Terraplanagem e Escavação"
  );
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");

  // Função pra subir logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="text-2xl font-bold p-6">Configurações</div>
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-16">
        {/* Esquerda: Dados empresa */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6 mb-6">
          <div className="font-semibold text-lg mb-3">
            Logo e Informações da Empresa
          </div>
          <div className="flex flex-col items-center border border-dashed border-gray-300 rounded-xl py-4 mb-3">
            {logo ? (
              <img src={logo} alt="Logo" className="h-28 mb-2 object-contain" />
            ) : (
              <span className="text-gray-400">Sem logo</span>
            )}
            <label className="cursor-pointer bg-gray-800 text-white px-6 py-2 rounded-xl mt-2 hover:bg-black">
              Alterar Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="font-semibold">Nome da Empresa</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Descrição</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">CNPJ</label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Endereço</label>
            <input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Telefone</label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Site</label>
            <input
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full border rounded py-2 px-3 mt-1 mb-2"
            />
          </div>
          <button className="bg-[#ff6600] text-white rounded-xl py-3 mt-2 w-full font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition">
            <span>Salvar Informações</span>
          </button>
        </div>

        {/* Direita: Gerenciamento de usuários */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6 mb-6">
          <div className="font-semibold text-lg mb-3">
            Gerenciamento de Usuários
          </div>
          {/* Aqui vai o código do CRUD de usuários, já já mando ele separado! */}
        </div>
      </div>
    </div>
  );
}
