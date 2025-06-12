import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

type Movimentacao = {
  id: number;
  tipo: "entrada" | "saida";
  categoria: string;
  valor: number;
  descricao: string;
  data: string;
};

const categoriasEntrada = [
  "Recebimentos 💰",
  "Venda",
  "Outros",
  "Recebimento de Obras",
  "Adiantamento de Cliente",
  "Venda de Materiais",
  "Aluguel de Equipamentos",
  "Serviços Complementares",
  "Reembolso de Despesas",
  "Recebimento de Subempreitada",
  "Investimento dos Sócios",
  "Outros Recebimentos",
];

const categoriasSaida = [
  "Combustível ⛽",
  "Manutenção 🛠️",
  "Salários 👷",
  "Materiais 🏗️",
  "Aluguel 🏢",
  "Energia Elétrica ⚡",
  "Água 💧",
  "Internet 🌐",
  "Telefonia 📞",
  "Impostos 🧾",
  "Seguros 🛡️",
  "Equipamentos 🔧",
  "Transporte 🚚",
  "Limpeza 🧹",
  "Treinamento 🎓",
  "Despesas Administrativas 🗂️",
  "Taxas Bancárias 💳",
  "Fretes e Logística 🚛",
  "Marketing e Publicidade 📢",
  "Assinaturas e Serviços 📄",
  "Outros",
];

export default function EntradasSaidas() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  // ------------------------------------------------------------------
  // ESTADOS DE FILTRO - declarados logo no topo do componente
  // (mantenha os três setters porque eles são usados nos <input>s)
  // ------------------------------------------------------------------
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">(
    "todos"
  );
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const [novo, setNovo] = useState<Partial<Movimentacao>>({
    tipo: "entrada",
    categoria: "",
    valor: 0,
    descricao: "",
    data: new Date().toISOString().slice(0, 10),
  });

  const tabelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dados = localStorage.getItem("entradasSaidas");
    if (dados) setMovimentacoes(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem("entradasSaidas", JSON.stringify(movimentacoes));
  }, [movimentacoes]);

  const movimentacoesFiltradas = movimentacoes.filter((m) => {
    if (filtroTipo !== "todos" && m.tipo !== filtroTipo) return false;
    if (filtroDataInicio && m.data < filtroDataInicio) return false;
    if (filtroDataFim && m.data > filtroDataFim) return false;
    return true;
  });

  const totalEntradas = movimentacoes
    .filter((m) => m.tipo === "entrada")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalSaidas = movimentacoes
    .filter((m) => m.tipo === "saida")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  function abrirModal(tipo: "entrada" | "saida") {
    setNovo({
      tipo,
      categoria: "",
      valor: 0,
      descricao: "",
      data: new Date().toISOString().slice(0, 10),
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setNovo((prev) => ({
      ...prev,
      [name]: name === "valor" ? Number(value) : value,
    }));
  }

  function salvarMovimentacao() {
    if (
      !novo.tipo ||
      !novo.categoria ||
      !novo.valor ||
      novo.valor <= 0 ||
      !novo.descricao
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    const novaMov = {
      id: Date.now(),
      tipo: novo.tipo,
      categoria: novo.categoria,
      valor: novo.valor,
      descricao: novo.descricao,
      data: novo.data,
    } as Movimentacao;

    setMovimentacoes((prev) => [novaMov, ...prev]);
    fecharModal();
  }

  function imprimirRelatorio() {
    window.print();
  }

  function baixarPDF() {
    if (!tabelaRef.current) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório Entradas e Saídas", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

    let y = 40;
    movimentacoesFiltradas.forEach((mov) => {
      const texto = `${mov.data} | ${mov.tipo.toUpperCase()} | ${
        mov.categoria
      } | R$ ${mov.valor.toFixed(2)} | ${mov.descricao}`;
      doc.text(texto, 14, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("relatorio-entradassaidas.pdf");
  }

  function compartilhar() {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copiado para a área de transferência!"))
        .catch(() => alert("Falha ao copiar o link."));
    } else {
      alert("Seu navegador não suporta copiar para área de transferência.");
    }
  }

  function formatarReal(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow relative">
      <h1 className="text-3xl font-bold mb-6 text-[#FF6600]">
        Entradas e Saídas 💰💸
      </h1>

      {/* Resumo */}
      <div className="flex gap-6 mb-6 flex-wrap">
        <div className="flex-1 min-w-[180px] p-4 bg-green-100 rounded shadow">
          <h2 className="text-lg font-semibold">Total Entradas</h2>
          <p className="text-green-700 text-xl font-bold">
            {formatarReal(totalEntradas)}
          </p>
        </div>
        <div className="flex-1 min-w-[180px] p-4 bg-red-100 rounded shadow">
          <h2 className="text-lg font-semibold">Total Saídas</h2>
          <p className="text-red-700 text-xl font-bold">
            {formatarReal(totalSaidas)}
          </p>
        </div>
        <div className="flex-1 min-w-[180px] p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-semibold">Saldo Atual</h2>
          <p
            className={`text-xl font-bold ${
              saldo >= 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            {formatarReal(saldo)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filtroTipo}
          onChange={(e) =>
            setFiltroTipo(e.target.value as "todos" | "entrada" | "saida")
          }
        >
          <option value="todos">Todos Tipos</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
        </select>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Data Início</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-40"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Data Fim</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-40"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
          />
        </div>

        <button
          onClick={() => {}}
          className="bg-[#FF6600] hover:bg-[#e65500] text-white px-5 py-2 rounded transition font-semibold"
          title="Filtrar"
        >
          🔍 Filtrar
        </button>

        <button
          onClick={() => abrirModal("entrada")}
          className="bg-[#FF6600] hover:bg-[#e65500] text-white px-5 py-2 rounded transition font-semibold"
          title="Nova Entrada"
        >
          +
        </button>

        <div className="ml-auto flex flex-wrap gap-3">
          <button
            onClick={imprimirRelatorio}
            className="bg-gray-700 hover:bg-gray-900 text-white px-5 py-2 rounded transition font-semibold"
            title="Imprimir relatório"
          >
            🖨️ Imprimir
          </button>

          <button
            onClick={baixarPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition font-semibold"
            title="Baixar PDF"
          >
            📥 Download PDF
          </button>

          <button
            onClick={compartilhar}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition font-semibold"
            title="Compartilhar link"
          >
            🔗 Compartilhar
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-xl font-semibold mb-4">
              Nova Movimentação -{" "}
              {novo.tipo === "entrada" ? "Entrada 💰" : "Saída 💸"}
            </h2>

            <label className="block mb-2 font-semibold">Tipo</label>
            <select
              name="tipo"
              value={novo.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="entrada">Entrada 💰</option>
              <option value="saida">Saída 💸</option>
            </select>

            <label className="block mb-2 font-semibold">Categoria</label>
            <select
              name="categoria"
              value={novo.categoria}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              {(novo.tipo === "entrada"
                ? categoriasEntrada
                : categoriasSaida
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Descrição</label>
            <textarea
              name="descricao"
              value={novo.descricao || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              rows={3}
              placeholder="Descrição da movimentação"
            />

            <label className="block mb-4 font-semibold">Data</label>
            <input
              type="date"
              name="data"
              value={novo.data || new Date().toISOString().slice(0, 10)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
            />

            <label className="block mb-2 font-semibold">Valor</label>
            <input
              type="number"
              min={0}
              step={0.01}
              name="valor"
              value={novo.valor || 0}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
              placeholder="0.00"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarMovimentacao}
                className="bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#e65500] transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div ref={tabelaRef} className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300">Data</th>
              <th className="p-2 border border-gray-300">Tipo</th>
              <th className="p-2 border border-gray-300">Categoria</th>
              <th className="p-2 border border-gray-300">Descrição</th>
              <th className="p-2 border border-gray-300">Valor</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoesFiltradas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            )}
            {movimentacoesFiltradas.map((mov) => (
              <tr
                key={mov.id}
                className="border border-gray-300 hover:bg-gray-50"
              >
                <td className="p-2 border border-gray-300">{mov.data}</td>
                <td className="p-2 border border-gray-300 capitalize">
                  {mov.tipo}
                </td>
                <td className="p-2 border border-gray-300">{mov.categoria}</td>
                <td className="p-2 border border-gray-300">{mov.descricao}</td>
                <td className="p-2 border border-gray-300">
                  {formatarReal(mov.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
