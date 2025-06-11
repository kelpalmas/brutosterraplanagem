import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    // Usuário e senha padrão (mude depois para backend!): admin/brutos1597534682
    if (usuario === "admin" && senha === "brutos1597534682") {
      localStorage.setItem("loggedIn", "true");
      navigate("/dashboard");
    } else {
      setErro("Usuário ou senha incorretos!");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#222] items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-xl p-8 flex flex-col w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-[#ff6600]">
          BRUTO'S TERRAPLANAGEM
        </h1>
        <p className="text-center text-gray-400 mb-6">Sistema Administrativo</p>
        <label className="text-sm mb-1 font-semibold text-gray-600">
          Usuário
        </label>
        <input
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuário"
          className="border rounded mb-4 px-3 py-2 bg-gray-100"
        />
        <label className="text-sm mb-1 font-semibold text-gray-600">
          Senha
        </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          className="border rounded mb-4 px-3 py-2 bg-gray-100"
        />
        <button
          type="submit"
          className="bg-[#ff6600] text-white rounded py-2 font-semibold hover:bg-orange-600 transition mb-2"
        >
          Entrar
        </button>
        {erro && <div className="text-red-500 text-center">{erro}</div>}
      </form>
    </div>
  );
}
