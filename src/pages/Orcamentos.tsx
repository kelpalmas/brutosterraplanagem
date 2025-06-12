import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

type Orcamento = {
  id: number;
  cliente: string;
  cpfCnpj: string;
  telefone: string;
  endereco: string;
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
  const [selecionados, setSelecionados] = useState<number[]>([]); // IDs selecionados

  const [novo, setNovo] = useState<Partial<Orcamento>>({
    cliente: "",
    cpfCnpj: "",
    telefone: "",
    endereco: "",
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

  function atualizarObrasEmAndamento(novoOrc: Orcamento) {
    const obrasJSON = localStorage.getItem("obrasEmAndamento");
    const obras = obrasJSON ? JSON.parse(obrasJSON) : [];

    const indice = obras.findIndex((o: Orcamento) => o.id === novoOrc.id);

    if (novoOrc.status === "Aprovado") {
      if (indice >= 0) {
        obras[indice] = novoOrc;
      } else {
        obras.push(novoOrc);
      }
    } else {
      if (indice >= 0) obras.splice(indice, 1);
    }

    localStorage.setItem("obrasEmAndamento", JSON.stringify(obras));
  }

  const orcamentosFiltrados = orcamentos.filter((o) => {
    if (filtroDataInicio && o.data < filtroDataInicio) return false;
    if (filtroDataFim && o.data > filtroDataFim) return false;
    return true;
  });

  // Totais e contagem (mantive)
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
      cpfCnpj: "",
      telefone: "",
      endereco: "",
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
      !novo.cpfCnpj ||
      !novo.telefone ||
      !novo.endereco ||
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
      cpfCnpj: novo.cpfCnpj,
      telefone: novo.telefone,
      endereco: novo.endereco,
      descricao: novo.descricao,
      valor: novo.valor,
      data: novo.data,
      status: novo.status as "Pendente" | "Aprovado" | "Recusado",
    };

    setOrcamentos((prev) => [novoOrc, ...prev]);
    fecharModal();
  }

  // Alternar seleção de orçamento
  function toggleSelecionado(id: number) {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((sid) => sid !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  }

  // Selecionar/desselecionar todos da lista filtrada
  function toggleSelecionarTodos() {
    if (selecionados.length === orcamentosFiltrados.length) {
      setSelecionados([]);
    } else {
      setSelecionados(orcamentosFiltrados.map((o) => o.id));
    }
  }

  // Imprimir somente os selecionados
  function imprimirSelecionados() {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um orçamento para imprimir.");
      return;
    }

    const orcsParaImprimir = orcamentos.filter((o) =>
      selecionados.includes(o.id)
    );

    const html = `
      <html>
        <head>
          <title>Orçamentos Selecionados</title>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              font-family: Arial, sans-serif;
              box-sizing: border-box;
            }
            body {
              position: relative;
              padding: 40px 50px 100px 50px;
              min-height: 100vh;
            }
            .topo {
              display: flex;
              gap: 20px;
              align-items: flex-start;
              margin-bottom: 30px;
            }
            .logo {
              width: 180px;
              height: auto;
            }
            .contato {
              color: #b58300;
              font-weight: bold;
              font-size: 14px;
              line-height: 1.4;
            }
            .dados-cliente {
              border: 2px solid #d9534f;
              padding: 15px;
              flex: 1;
              font-size: 14px;
              color: #333;
              font-weight: bold;
            }
            .descricao {
              margin-top: 20px;
              font-size: 13px;
              color: #222;
              white-space: pre-wrap;
            }
            .valor {
              position: absolute;
              bottom: 100px;
              right: 50px;
              font-weight: bold;
              font-size: 18px;
              color: #b58300;
            }
            .rodape {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 80px;
              background: #b58300;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="topo">
            <img src="${
              window.location.origin
            }/brutos.png" alt="Logo Bruto's" class="logo" />
            <div class="contato">
              BRUTO'S TERRA PLANAGEM<br/>
              (44) 99707-0812<br/>
              Cleverson Palma (Kel)
            </div>
            <div class="dados-cliente">
              ${orcsParaImprimir
                .map(
                  (orc) => `
                    <p>CLIENTE: ${orc.cliente}</p>
                    <p>CPF/CNPJ: ${orc.cpfCnpj}</p>
                    <p>FONE: ${orc.telefone}</p>
                    <p>ENDEREÇO: ${orc.endereco}</p>
                  `
                )
                .join("")}
            </div>
          </div>
  
          <div class="descricao">
            ${orcsParaImprimir.map((orc) => orc.descricao).join("<hr/>")}
          </div>
  
          <div class="valor">
            VALOR: ${orcsParaImprimir
              .map((orc) =>
                orc.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              )
              .join(", ")}
          </div>
  
          <div class="rodape">
            www.terraplanagembrutos.com.br
          </div>
        </body>
      </html>
    `;

    const janela = window.open("", "_blank", "width=900,height=700");
    if (!janela) return;

    janela.document.write(html);
    janela.document.close();
    janela.focus();
    janela.print();
  }
  // Baixar PDF dos selecionados
  function baixarPDF() {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um orçamento para baixar o PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Orçamentos Selecionados", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

    let y = 40;

    orcamentos
      .filter((o) => selecionados.includes(o.id))
      .forEach((orc) => {
        const texto = `
  Cliente: ${orc.cliente}
  CPF/CNPJ: ${orc.cpfCnpj}
  Telefone: ${orc.telefone}
  Endereço: ${orc.endereco}
  Descrição: ${orc.descricao}
  Valor: ${orc.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
  Data: ${orc.data}
  Status: ${orc.status}
        `;

        texto
          .trim()
          .split("\n")
          .forEach((linha) => {
            doc.text(linha.trim(), 14, y);
            y += 8;
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
          });

        y += 10;
      });

    doc.save("orcamentos_selecionados.pdf");
  }

  // Compartilhar link
  function compartilhar() {
    if (selecionados.length === 0) {
      alert("Selecione pelo menos um orçamento para compartilhar.");
      return;
    }

    const orcsParaCompartilhar = orcamentos.filter((o) =>
      selecionados.includes(o.id)
    );

    const textoCompartilhar = orcsParaCompartilhar
      .map(
        (orc) =>
          `Cliente: ${orc.cliente}\nCPF/CNPJ: ${orc.cpfCnpj}\nTelefone: ${
            orc.telefone
          }\nEndereço: ${orc.endereco}\nDescrição: ${
            orc.descricao
          }\nValor: ${orc.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}\nData: ${orc.data}\nStatus: ${orc.status}\n---`
      )
      .join("\n");

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textoCompartilhar)
        .then(() =>
          alert(
            "Orçamentos selecionados copiados para a área de transferência!"
          )
        )
        .catch(() => alert("Falha ao copiar os orçamentos."));
    } else {
      alert("Seu navegador não suporta copiar para área de transferência.");
    }
  }
  const boxStyleBase = "flex-1 min-w-[220px] p-4 rounded shadow";

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

      <div className="flex gap-6 mb-6 flex-wrap">
        <CaixaResumo
          titulo="Total Orçamentos"
          corBg="#E5E7EB"
          corTexto="#000000"
          valor={0}
          quantidade={totalOrcamentos}
        />
        <CaixaResumo
          titulo="Pendentes"
          corBg="#FEF9C3"
          corTexto="#92400E"
          valor={totalPendentesValor}
          quantidade={totalPendentesQtd}
        />
        <CaixaResumo
          titulo="Aprovados"
          corBg="#D1FAE5"
          corTexto="#065F46"
          valor={totalAprovadosValor}
          quantidade={totalAprovadosQtd}
        />
        <CaixaResumo
          titulo="Recusados"
          corBg="#FEE2E2"
          corTexto="#991B1B"
          valor={totalRecusadosValor}
          quantidade={totalRecusadosQtd}
        />
      </div>

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
          onClick={imprimirSelecionados}
          className="bg-gray-700 hover:bg-gray-900 text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          title="Imprimir orçamentos selecionados"
        >
          🖨️ Imprimir Selecionados
        </button>

        <button
          onClick={baixarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition font-semibold flex items-center gap-2"
          title="Baixar PDF dos selecionados"
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

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative overflow-auto max-h-[90vh]">
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

            <label className="block mb-2 font-semibold">CPF/CNPJ</label>
            <input
              type="text"
              name="cpfCnpj"
              value={novo.cpfCnpj || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="CPF ou CNPJ"
            />

            <label className="block mb-2 font-semibold">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={novo.telefone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Telefone"
            />

            <label className="block mb-2 font-semibold">Endereço</label>
            <textarea
              name="endereco"
              value={novo.endereco || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              rows={3}
              placeholder="Endereço completo"
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
              onChange={(e) =>
                setNovo((prev) => ({ ...prev, data: e.target.value }))
              }
              className="border px-3 py-2 rounded w-40 mb-6"
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

      <div ref={tabelaRef} className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300">
                <input
                  type="checkbox"
                  checked={
                    selecionados.length === orcamentosFiltrados.length &&
                    orcamentosFiltrados.length > 0
                  }
                  onChange={toggleSelecionarTodos}
                />
              </th>
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
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
            {orcamentosFiltrados.map((orc) => (
              <tr
                key={orc.id}
                className="border border-gray-300 hover:bg-gray-50"
              >
                <td className="p-2 border border-gray-300 text-center">
                  <input
                    type="checkbox"
                    checked={selecionados.includes(orc.id)}
                    onChange={() => toggleSelecionado(orc.id)}
                  />
                </td>
                <td className="p-2 border border-gray-300">{orc.cliente}</td>
                <td className="p-2 border border-gray-300">{orc.descricao}</td>
                <td className="p-2 border border-gray-300">
                  {orc.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="p-2 border border-gray-300">{orc.data}</td>
                <td className="p-2 border border-gray-300 font-semibold">
                  <span
                    className={
                      orc.status === "Pendente"
                        ? "text-yellow-800"
                        : orc.status === "Aprovado"
                        ? "text-green-800"
                        : "text-red-800"
                    }
                  >
                    {orc.status}
                  </span>

                  <select
                    value={orc.status}
                    onChange={(e) => {
                      const novoStatus = e.target.value as
                        | "Pendente"
                        | "Aprovado"
                        | "Recusado";
                      const novoOrcamento = { ...orc, status: novoStatus };
                      setOrcamentos((prev) =>
                        prev.map((o) => (o.id === orc.id ? novoOrcamento : o))
                      );
                      atualizarObrasEmAndamento(novoOrcamento);
                    }}
                    className="ml-3 border rounded px-2 py-1 text-sm"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Recusado">Recusado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
