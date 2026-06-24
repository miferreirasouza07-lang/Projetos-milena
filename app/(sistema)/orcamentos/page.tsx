"use client";

import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Wrench,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";
import { logoBase64 } from "@/lib/logoBase64";

interface Cliente {
  id: number;
  nome: string;
}

interface Orcamento {
  id: number;
  cliente: string;
  servico: string;
  descricao: string;
  valor: string;
  validade: string;
  status: string;

  os_gerada: number | null;
}

export default function OrcamentosPage() {
    const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [validade, setValidade] = useState("");
const [busca, setBusca] = useState("");
const [status, setStatus] = useState("Pendente");

  function gerarPDF(orcamento: Orcamento) {
 const pdf = new jsPDF();

 pdf.addImage(logoBase64, "JPEG", 20, 15, 55, 45);

pdf.setFontSize(24);
pdf.setTextColor(34, 197, 94);
pdf.setFont("helvetica", "bold");
pdf.text("ORÇAMENTO", 20, 75);

pdf.setDrawColor(34, 197, 94);
pdf.line(20, 82, 190, 82);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);

 // Cliente
pdf.setFont("helvetica", "bold");
pdf.text("Cliente:", 20, 95);
let x = 20 + pdf.getTextWidth("Cliente:") + 4;

pdf.setFont("helvetica", "normal");
pdf.text(orcamento.cliente, x, 95);

// Serviço
pdf.setFont("helvetica", "bold");
pdf.text("Serviço:", 20, 110);
x = 20 + pdf.getTextWidth("Serviço:") + 4;

pdf.setFont("helvetica", "normal");
pdf.text(orcamento.servico, x, 110);

// Descrição
pdf.setFont("helvetica", "bold");
pdf.text("Descrição:", 20, 125);

x = 20 + pdf.getTextWidth("Descrição:") + 4;

pdf.setFont("helvetica", "normal");

const descricao = pdf.splitTextToSize(
  orcamento.descricao || "-",
  100
);

pdf.text(descricao, x, 125);

// Calcula onde termina a descrição
const fimDescricao = 125 + (descricao.length * 7);

// Deixa pelo menos 20 de espaço após a descrição
const yValor = fimDescricao + 15;

// Valor
pdf.setFont("helvetica", "bold");
pdf.text("Valor:", 20, yValor);

x = 20 + pdf.getTextWidth("Valor:") + 4;

pdf.setFont("helvetica", "normal");
pdf.text(`R$ ${orcamento.valor}`, x, yValor);
const yAssinatura = yValor + 35;

if (yAssinatura > 250) {
  pdf.addPage();

  pdf.setDrawColor(180);
  pdf.line(20, 40, 90, 40);

  pdf.setFont("helvetica", "italic");
  pdf.text("Atenciosamente,", 20, 55);

  pdf.setFont("helvetica", "bold");
  pdf.text("RF Ar Condicionado", 20, 70);
} else {
  pdf.setDrawColor(180);
  pdf.line(20, yAssinatura, 90, yAssinatura);

  pdf.setFont("helvetica", "italic");
  pdf.text("Atenciosamente,", 20, yAssinatura + 12);

  pdf.setFont("helvetica", "bold");
  pdf.text("RF Ar Condicionado", 20, yAssinatura + 25);
}

pdf.save(`orcamento-${orcamento.id}.pdf`);
  }

  async function carregarClientes() {
    if (!supabase) return;

    const { data } = await supabase
      .from("clientes")
      .select("id,nome")
      .order("nome");

    setClientes(data || []);
  }

  async function carregarOrcamentos() {
    if (!supabase) return;

    const { data } = await supabase
      .from("orcamentos")
      .select("*")
      .order("id", { ascending: false });

    setOrcamentos(data || []);
  }

  async function salvarOrcamento() {
    if (!cliente || !servico || !valor || !validade) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!supabase) return;

    if (editandoId) {
      const { error } = await supabase
        .from("orcamentos")
       .update({
  cliente,
  servico,
  descricao,
  valor,
  validade,
  status,
})
        .eq("id", editandoId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("orcamentos")
        .insert([
  {
    cliente,
    servico,
    descricao,
    valor,
    validade,
    status,
  },
]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    limparFormulario();
    carregarOrcamentos();
  }

async function gerarOS(orcamento: Orcamento){
  function gerarPDF(orcamento: Orcamento) {
  const pdf = new jsPDF();

  pdf.setFontSize(20);
  pdf.text("RF Ar Condicionado", 20, 20);

  pdf.setFontSize(14);
  pdf.text("ORÇAMENTO", 20, 35);

  pdf.setFontSize(12);

  pdf.text(
    `Cliente: ${orcamento.cliente}`,
    20,
    55
  );

  pdf.text(
    `Serviço: ${orcamento.servico}`,
    20,
    70
  );

  pdf.text(
    `Valor: R$ ${orcamento.valor}`,
    20,
    85
  );

  pdf.text(
    `Validade: ${orcamento.validade}`,
    20,
    100
  );

  pdf.text(
    `Status: ${orcamento.status}`,
    20,
    115
  );

  pdf.text(
    `Data de emissão: ${new Date().toLocaleDateString()}`,
    20,
    130
  );

  pdf.line(20, 200, 120, 200);

pdf.text(
  "Atenciosamente,",
  20,
  215
);

pdf.text(
  "RF Ar Condicionado",
  20,
  225
);

  pdf.save(
    `orcamento-${orcamento.id}.pdf`
  );
}
  if (!supabase) return;

  const numero = `OS-${Date.now()}`;

const { data: novaOS, error: erroOS } = await supabase
  .from("ordens_servico")
  .insert([
    {
      cliente: orcamento.cliente,
      servico: orcamento.servico,
      descricao: orcamento.descricao,
      valor: orcamento.valor,
      validade: orcamento.validade,
      tecnico: "",
      observacoes: "",
      status: "Aberta",
    },
  ])
  .select()
  .single();



  if (erroOS) {
    alert(erroOS.message);
    return;
  }

  await supabase
  .from("orcamentos")
  .update({
    os_gerada: novaOS.id,
    status: "Convertido em OS",
  })
  .eq("id", orcamento.id);
  

 
  alert("Ordem de Serviço gerada com sucesso!");

  carregarOrcamentos();
}

async function excluirOrcamento(id: number) {
  const confirmar = confirm(
    "Deseja realmente excluir este orçamento?"
  );

  if (!confirmar) return;

  if (!supabase) return;

  const { error } = await supabase
    .from("orcamentos")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  carregarOrcamentos();
}

  function editarOrcamento(orcamento: Orcamento) {
    setEditandoId(orcamento.id);

    setCliente(orcamento.cliente);
    setServico(orcamento.servico);
    setValor(orcamento.valor);
    setValidade(orcamento.validade);
    setDescricao(orcamento.descricao);
    setStatus(orcamento.status);
    setModalAberto(true);
  }

  function limparFormulario() {
    setEditandoId(null);

    setCliente("");
    setServico("");
    setValor("");
    setValidade("");
    setDescricao("");
    setStatus("Pendente");

    setModalAberto(false);
  }

  function corStatus(status: string) {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-700";

      case "Recusado":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  useEffect(() => {
    carregarClientes();
    carregarOrcamentos();
  }, []);

  return (
    
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Orçamentos
        </h1>

          <div className="flex-1 flex justify-center">
    <input
      type="text"
      placeholder="Buscar orçamento..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
     className="w-150 border rounded-xl p-3 text-black shadow-sm"
    />
  </div>

        <button
          onClick={() => {
            limparFormulario();
            setModalAberto(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Novo Orçamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Cliente</th>
              <th className="text-left p-4">Serviço</th>
              <th className="text-left p-4">Valor</th>
              <th className="text-left p-4">Validade</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">OS</th>
              <th className="text-left p-4">Ações</th>
              
            </tr>
          </thead>

          <tbody>
            {orcamentos
  .filter((orcamento) =>
    orcamento.cliente?.toLowerCase().includes(busca.toLowerCase()) ||
    orcamento.servico?.toLowerCase().includes(busca.toLowerCase()) ||
    orcamento.status?.toLowerCase().includes(busca.toLowerCase())
  )

              .map((orcamento) => (
                <tr
                  key={orcamento.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4">{orcamento.cliente}</td>

                <td className="p-4">
                  {orcamento.servico}
                </td>

                <td className="p-4 font-semibold text-green-700">
                  R$ {orcamento.valor}
                </td>

                <td className="p-4">
                  {orcamento.validade}
                </td>

                <td className="p-4">
                 <span
  className={`px-3 py-1 rounded-full text-sm font-semibold ${
    orcamento.status === "Aprovado"
      ? "bg-green-100 text-green-700"
      : orcamento.status === "Recusado"
      ? "bg-red-100 text-red-700"
      : orcamento.status === "Convertido em OS"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {orcamento.status}

  
</span>
                </td>

<td className="p-4">
  {orcamento.os_gerada ? (
    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
      OS-{String(orcamento .os_gerada).padStart(3, "0")}
    </span>
  ) : (
    "-"
  )}
</td>

                <td className="p-4">
  <div className="flex items-center gap-2">

    <button
      onClick={() => gerarPDF(orcamento)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all"
      title="Gerar PDF"
    >
      <FileText size={18} />
    </button>
{!orcamento.os_gerada && (
  <button
    onClick={() => gerarOS(orcamento)}
    className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
    title="Gerar Ordem de Serviço"
  >
    <Wrench size={18} />
  </button>
)}

    <button
      onClick={() => editarOrcamento(orcamento)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
    >
      <Pencil size={18} />
    </button>

    <button
      onClick={() => excluirOrcamento(orcamento.id)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
    >
      <Trash2 size={18} />
    </button>

  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        aberto={modalAberto}
        fechar={limparFormulario}
        titulo={
          editandoId
            ? "Editar Orçamento"
            : "Novo Orçamento"
        }
        
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="border rounded-lg p-3 text-black"
          >
            <option value="">
              Selecione um cliente
            </option>

            {clientes.map((c) => (
              <option
                key={c.id}
                value={c.nome}
              >
                {c.nome}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Serviço"
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

      
<textarea
  placeholder="Descrição do orçamento"
  value={descricao}
  onChange={(e) => setDescricao(e.target.value)}
  className="border rounded-lg p-3 text-black md:col-span-2"
  rows={4}
/>

          <input
            type="text"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="text"
            placeholder="Validade"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border rounded-lg p-3 text-black"
>
  <option value="Pendente">Pendente</option>
  <option value="Aprovado">Aprovado</option>
  <option value="Recusado">Recusado</option>
  <option value="Convertido em OS">
    Convertido em OS
  </option>
</select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={limparFormulario}
            className="px-5 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={salvarOrcamento}
            className="px-5 py-2 bg-green-600 text-white rounded-lg"
          >
            {editandoId ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}