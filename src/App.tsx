import { useState } from "react";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [erro, setErro] = useState("");
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "admin" && senha === "brutos1597534682") {
      setIsAuth(true);
      setErro("");
    } else {
      setErro("Usuário ou senha inválidos");
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#232323]">
        <form
          className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center"
          onSubmit={handleLogin}
        >
          {/* Logo fictício */}
          <div className="bg-black rounded-md p-2 mb-5">
            {/* Substitua pelo seu logo real se quiser */}
            <svg width="60" height="60" viewBox="0 0 60 60">
              <rect width="60" height="60" rx="10" fill="#FF6600" />
              <rect x="8" y="28" width="44" height="8" rx="3" fill="#111" />
              <rect x="15" y="16" width="8" height="28" rx="3" fill="#111" />
              <rect x="37" y="20" width="8" height="24" rx="3" fill="#111" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-center">
            BRUTO'S
            <br />
            TERRAPLANAGEM
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Sistema Administrativo
          </p>

          <div className="w-full mb-2">
            <label className="block text-sm mb-1" htmlFor="user">
              Usuário
            </label>
            <input
              id="user"
              className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoFocus
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-sm mb-1" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {erro && <div className="text-red-600 text-sm mb-2">{erro}</div>}
          <button
            type="submit"
            className="w-full bg-[#FF6600] text-white rounded py-2 font-bold shadow hover:bg-orange-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Próxima tela: Cadastro de novos usuários
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#232323]">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6 text-[#FF6600]">
          Cadastro de Novo Usuário
        </h2>
        {/* Coloque aqui seu formulário de cadastro */}
        <div className="mb-4 w-full">
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100 mb-3"
            placeholder="Novo usuário"
          />
          <input
            className="w-full border rounded px-3 py-2 bg-gray-100 mb-3"
            placeholder="Senha"
            type="password"
          />
          <button className="w-full bg-[#FF6600] text-white rounded py-2 font-bold shadow hover:bg-orange-700 transition">
            Salvar
          </button>
        </div>
        <div className="text-gray-400 text-sm">
          * Apenas para administradores
        </div>
      </div>
    </div>
  );
}
