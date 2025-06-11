import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

type Orcamento = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  data: string;
  status: "Pendente" | "Aprovado" | "Recusado";
};

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const [novo, setNovo] = useState<Partial<Orcamento>>({
    cliente: "",
    descricao: "",
    valor: 0,
    data: new Date().toISOString().slice(0, 10),
    status: "Pendente",
  });

  const tabelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dados = localStorage.getItem("orcamentos");
    if (dados) setOrcamentos(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
  }, [orcamentos]);

  const orcamentosFiltrados = orcamentos.filter((o) => {
    if (filtroDataInicio && o.data < filtroDataInicio) return false;
    if (filtroDataFim && o.data > filtroDataFim) return false;
    return true;
  });

  // Totais e contagem
  const totalOrcamentos = orcamentosFiltrados.length;
  const totalPendentesValor = orcamentosFiltrados
    .filter((o) => o.status === "Pendente")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalPendentesQtd = orcamentosFiltrados.filter(
    (o) => o.status === "Pendente"
  ).length;
  const totalAprovadosValor = orcamentosFiltrados
    .filter((o) => o.status === "Aprovado")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalAprovadosQtd = orcamentosFiltrados.filter(
    (o) => o.status === "Aprovado"
  ).length;
  const totalRecusadosValor = orcamentosFiltrados
    .filter((o) => o.status === "Recusado")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalRecusadosQtd = orcamentosFiltrados.filter(
    (o) => o.status === "Recusado"
  ).length;

  function abrirModal() {
    setNovo({
      cliente: "",
      descricao: "",
      valor: 0,
      data: new Date().toISOString().slice(0, 10),
      status: "Pendente",
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

  function salvarOrcamento() {
    if (
      !novo.cliente ||
      !novo.descricao ||
      !novo.valor ||
      novo.valor <= 0 ||
      !novo.data ||
      !novo.status
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const novoOrc: Orcamento = {
      id: Date.now(),
      cliente: novo.cliente,
      descricao: novo.descricao,
      valor: novo.valor,
      data: novo.data,
      status: novo.status as "Pendente" | "Aprovado" | "Recusado",
    };

    setOrcamentos((prev) => [novoOrc, ...prev]);
    fecharModal();
  }

  function imprimirRelatorio() {
    window.print();
  }

  function baixarPDF() {
    if (!tabelaRef.current) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Orçamentos", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

    let y = 40;
    orcamentosFiltrados.forEach((orc) => {
      const texto = `${orc.data} | ${orc.cliente} | ${
        orc.status
      } | ${orc.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })} | ${orc.descricao}`;
      doc.text(texto, 14, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("relatorio-orcamentos.pdf");
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

  const boxStyleBase = "flex-1 min-w-[220px] p-4 rounded shadow";

  // Caixa estilizada igual ao seu print, parametrizando cores e texto
  function CaixaResumo({
    titulo,
    corBg,
    corTexto,
    valor,
    quantidade,
  }: {
    titulo: string;
    corBg: string;
    corTexto: string;
    valor: number;
    quantidade: number;
  }) {
    return (
      <div
        className={`flex flex-col justify-between ${boxStyleBase}`}
        style={{ backgroundColor: corBg, color: corTexto }}
      >
        <h2 className="text-center font-bold text-lg mb-2">{titulo}</h2>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-extrabold">
            {valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <span className="text-xl font-semibold">{quantidade}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow relative">
      <h1 className="text-3xl font-bold mb-6 text-[#FF6600]">Orçamentos 📝</h1>

      {/* Caixinhas resumo */}
      <div className="flex gap-6 mb-6 flex-wrap">
        <CaixaResumo
          titulo="Total Orçamentos"
          corBg="#E5E7EB" // cinza claro
          corTexto="#000000"
          valor={0}
          quantidade={totalOrcamentos}
        />
        <CaixaResumo
          titulo="Pendentes"
          corBg="#FEF9C3" // amarelo claro
          corTexto="#92400E"
          valor={totalPendentesValor}
          quantidade={totalPendentesQtd}
        />
        <CaixaResumo
          titulo="Aprovados"
          corBg="#D1FAE5" // verde claro
          corTexto="#065F46"
          valor={totalAprovadosValor}
          quantidade={totalAprovadosQtd}
        />
        <CaixaResumo
          titulo="Recusados"
          corBg="#FEE2E2" // vermelho claro
          corTexto="#991B1B"
          valor={totalRecusadosValor}
          quantidade={totalRecusadosQtd}
        />
      </div>

      {/* Filtros e botões */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
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
          className="bg-[#FF6600] hover:bg-[#e65500] text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          onClick={() => {}}
          title="Filtrar"
        >
          🔍 Filtrar
        </button>

        <button
          className="bg-[#FF6600] hover:bg-[#e65500] text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          onClick={abrirModal}
          title="Novo Orçamento"
        >
          + Novo Orçamento
        </button>

        <button
          onClick={imprimirRelatorio}
          className="bg-gray-700 hover:bg-gray-900 text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          title="Imprimir relatório"
        >
          🖨️ Imprimir
        </button>

        <button
          onClick={baixarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          title="Baixar PDF"
        >
          📥 Download PDF
        </button>

        <button
          onClick={compartilhar}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          title="Compartilhar link"
        >
          🔗 Compartilhar
        </button>
      </div>

      {/* Modal de Novo Orçamento */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Novo Orçamento</h2>

            <label className="block mb-2 font-semibold">Cliente</label>
            <input
              type="text"
              name="cliente"
              value={novo.cliente || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Nome do cliente"
            />

            <label className="block mb-2 font-semibold">Descrição</label>
            <textarea
              name="descricao"
              value={novo.descricao || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              rows={3}
              placeholder="Descrição do orçamento"
            />

            <label className="block mb-2 font-semibold">Valor</label>
            <input
              type="number"
              min={0}
              step={0.01}
              name="valor"
              value={novo.valor || 0}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="0.00"
            />

            <label className="block mb-2 font-semibold">Data</label>
            <input
              type="date"
              name="data"
              value={novo.data || new Date().toISOString().slice(0, 10)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <label className="block mb-4 font-semibold">Status</label>
            <select
              name="status"
              value={novo.status || "Pendente"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
            >
              <option value="Pendente">Pendente</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Recusado">Recusado</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvarOrcamento}
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
              <th className="p-2 border border-gray-300">Cliente</th>
              <th className="p-2 border border-gray-300">Descrição</th>
              <th className="p-2 border border-gray-300">Valor</th>
              <th className="p-2 border border-gray-300">Data</th>
              <th className="p-2 border border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {orcamentosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
            {orcamentosFiltrados.map((orc) => (
              <tr
                key={orc.id}
                className="border border-gray-300 hover:bg-gray-50"
              >
                <td className="p-2 border border-gray-300">{orc.cliente}</td>
                <td className="p-2 border border-gray-300">{orc.descricao}</td>
                <td className="p-2 border border-gray-300">
                  {orc.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="p-2 border border-gray-300">{orc.data}</td>
                <td
                  className={`p-2 border border-gray-300 font-semibold ${
                    orc.status === "Pendente"
                      ? "text-yellow-800"
                      : orc.status === "Aprovado"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {orc.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
