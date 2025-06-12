import React, { useState, useEffect } from "react";

type Orcamento = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  data: string;
  status: "Pendente" | "Aprovado" | "Recusado" | "Concluido";
};

export default function ObrasEmAndamento() {
  /** estado principal -------------------------------------------------- */
  const [obras, setObras] = useState<Orcamento[]>([]);

  /** carrega do localStorage só uma vez -------------------------------- */
  useEffect(() => {
    const obrasJSON = localStorage.getItem("obrasEmAndamento");
    if (obrasJSON) {
      // 👇 dizemos explicitamente ao TS que o parse resulta em Orcamento[]
      setObras(JSON.parse(obrasJSON) as Orcamento[]);
    }
  }, []);

  /** helper central para gravar e atualizar tela ----------------------- */
  function atualizarLocalStorage(novasObras: Orcamento[]) {
    setObras(novasObras);
    localStorage.setItem("obrasEmAndamento", JSON.stringify(novasObras));
  }

  /** ações -------------------------------------------------------------- */
  function marcarConcluida(id: number) {
    const novasObras: Orcamento[] = obras.map((obra) =>
      obra.id === id ? { ...obra, status: "Concluido" } : obra
    );
    atualizarLocalStorage(novasObras);
  }

  function voltarParaOrcamento(id: number) {
    const obrasAtualizadas: Orcamento[] = obras.map((obra) =>
      obra.id === id ? { ...obra, status: "Pendente" } : obra
    );
    atualizarLocalStorage(obrasAtualizadas);

    // mantém consistência com lista de orçamentos
    const orcJSON = localStorage.getItem("orcamentos");
    const orcamentos: Orcamento[] = orcJSON ? JSON.parse(orcJSON) : [];
    const orcamentosAtualizados = orcamentos.map((orc) =>
      orc.id === id ? { ...orc, status: "Pendente" } : orc
    );
    localStorage.setItem("orcamentos", JSON.stringify(orcamentosAtualizados));
  }

  function abortarObra(id: number) {
    const novasObras: Orcamento[] = obras.map((obra) =>
      obra.id === id ? { ...obra, status: "Recusado" } : obra
    );
    atualizarLocalStorage(novasObras);
  }

  /** somente obras ativas (status Aprovado) ---------------------------- */
  const obrasAtivas = obras.filter((obra) => obra.status === "Aprovado");

  /** render ------------------------------------------------------------- */
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-[#FF6600]">
        Obras em Andamento 🚧
      </h1>

      {obrasAtivas.length === 0 ? (
        <p className="text-gray-600 text-center">Nenhuma obra em andamento.</p>
      ) : (
        <ul className="space-y-4">
          {obrasAtivas.map((obra) => (
            <li
              key={obra.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <strong>{obra.cliente}:</strong> {obra.descricao} —{" "}
                {obra.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => marcarConcluida(obra.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  title="Marcar como Concluída"
                >
                  ✅ Concluída
                </button>

                <button
                  onClick={() => voltarParaOrcamento(obra.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  title="Voltar para Orçamento"
                >
                  ↩️ Orçamento
                </button>

                <button
                  onClick={() => abortarObra(obra.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  title="Abortar Obra"
                >
                  ❌ Abortada
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
