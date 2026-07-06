"use client";

import jsPDF from "jspdf";
import { useEffect, useState, } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";
import { logoBase64 } from "@/lib/logoBase64";

interface Cliente {
  id: number;
  nome: string;
}

type OrdemServico = {
  id: number;
  numero: string;
  cliente: string;
  servico: string;
  tecnico: string;
  status: string;
  observacoes: string;
  valor: number;
};

export default function OrdensServicoPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);

  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [valor, setValor] = useState("");
  const [busca, setBusca] = useState("");
const [status, setStatus] = useState("Aberta");

  async function carregarClientes() {
    if (!supabase) return;

    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("nome");

    setClientes(data || []);
  }

  async function carregarOrdens() {
    if (!supabase) return;

    const { data } = await supabase
      .from("ordens_servico")
      .select("*")
      .order("id", { ascending: false });

    setOrdens(data || []);
  }
async function salvarOS() {

  console.log({
  cliente,
  servico,
  tecnico,
  observacoes,
  valor: Number(valor),
});

  if (!cliente || !servico || !tecnico) {
    alert("Preencha os campos obrigatórios.");
    return;
  } 
  
  if (!supabase) return;

  if (editandoId) {
    const { error } = await supabase
      .from("ordens_servico")
.update({
  cliente,
  servico,
  tecnico,
  status,
  observacoes,
  valor: Number(valor),
})
.eq("id", editandoId);

  if (error) {
      alert(error.message);
      return;
    }

const { data: ordem } = await supabase
  .from("ordens_servico")
  .select("*")
  .eq("id", editandoId)
  .single();

  if (
  ordem &&
  ordem.status === "Finalizada" &&
  !ordem.financeiro_gerado
) {
  await supabase
    .from("financeiro")
    .insert([
      {
        descricao: `OS-${String(ordem.id).padStart(3, "0")} - ${ordem.servico}`,
        valor: Number(ordem.valor),
        tipo: "Receita",
        vencimento: new Date()
          .toISOString()
          .split("T")[0],
        status: "Pendente",
      },
    ]);

  await supabase
    .from("ordens_servico")
    .update({
      financeiro_gerado: true,
    })
    .eq("id", ordem.id);
}

  } else {

const { error } = await supabase
  .from("ordens_servico")
  .insert([
    {
      cliente,
      servico,
      tecnico,
      status,
      observacoes,
      valor: Number(valor),
    },
  ]);

  



if (error) {
  console.log(error);
  alert(error.message);
  return;
}

alert("SALVOU COM SUCESSO");
  }

 await carregarOrdens();
limparFormulario();
}

function gerarPDF(os: OrdemServico) {
  const pdf = new jsPDF();

  // Logo
  pdf.addImage(logoBase64, "PNG", 20, 10, 55, 35);

  pdf.setFontSize(10);
pdf.setTextColor(80);

pdf.text(
  "(19) 99273-7769",
  140,
  20
);

pdf.text(
  "rf_atendimento@outlook.com",
  140,
  28
);

pdf.text(
  "Valinhos - SP",
  140,
  36
);

  // Título
  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("ORDEM DE SERVIÇO", 20, 55);

  // Linha
  pdf.setDrawColor(37, 99, 235);
  pdf.line(20, 62, 190, 62);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);

  let y = 80;

  // Número
  pdf.setFont("helvetica", "bold");
  pdf.text("Número:", 20, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(`OS-${String(os.id).padStart(3, "0")}`, 50, y);

  y += 15;

  // Cliente
  pdf.setFont("helvetica", "bold");
  pdf.text("Cliente:", 20, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(os.cliente, 50, y);

  y += 15;

  // Serviço
  pdf.setFont("helvetica", "bold");
  pdf.text("Serviço:", 20, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(os.servico, 50, y);

  y += 15;

  // Técnico
  pdf.setFont("helvetica", "bold");
  pdf.text("Técnico:", 20, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(os.tecnico, 50, y);

  y += 15;

  // Status
  pdf.setFont("helvetica", "bold");
  pdf.text("Status:", 20, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(os.status, 50, y);

  y += 15;

   // Valor

 pdf.setFont("helvetica", "bold");  
pdf.text("Valor:", 20, y);
pdf.setFont("helvetica", "normal");
pdf.text(
  `R$ ${Number(os.valor).toFixed(2)}`,
  50,
  y
);
y += 15;

  // Observações
  pdf.setFont("helvetica", "bold");
  pdf.text("Observações:", 20, y);

  pdf.setFont("helvetica", "normal");

  const observacoes = pdf.splitTextToSize(
    os.observacoes || "Nenhuma observação",
    150
  );

 pdf.roundedRect(
  20,
  y + 5,
  170,
  observacoes.length * 6 + 10,
  2,
  2
);

pdf.text(
  observacoes,
  25,
  y + 15
);

  // Calcula posição da assinatura
  const assinaturaY = y + 20 + observacoes.length * 7;

  // Se faltar espaço cria nova página
  if (assinaturaY > 250) {
    pdf.addPage();
    
    pdf.line(20, 40, 90, 40);

    pdf.setFont("helvetica", "italic");
    pdf.text("Atenciosamente,", 20, 55);

    pdf.setFont("helvetica", "bold");
    pdf.text("RF Ar Condicionado", 20, 70);
  } else {
   // Declaração
pdf.setFont("helvetica", "normal");

pdf.text(
  "Declaro que o serviço acima descrito foi realizado conforme solicitado,",
  105,
  assinaturaY + 10,
  { align: "center" }
);

pdf.text(
  "estando ciente e de acordo com os serviços executados.",
  105,
  assinaturaY + 18,
  { align: "center" }
);

// Assinaturas
pdf.line(20, assinaturaY + 50, 90, assinaturaY + 50);
pdf.line(120, assinaturaY + 50, 190, assinaturaY + 50);

pdf.setFont("helvetica", "bold");

pdf.text(
  "ASSINATURA DA EMPRESA",
  22,
  assinaturaY + 60
);

pdf.text(
  "ASSINATURA DO CLIENTE",
  122,
  assinaturaY + 60
);
  }

  pdf.save(`OS-${String(os.id).padStart(3, "0")}.pdf`);
}
  function corStatus(status: string) {
    switch (status) {
      case "Aberta":
        return "bg-yellow-100 text-yellow-700";

      case "Em andamento":
        return "bg-blue-100 text-blue-700";

      case "Finalizada":
        return "bg-green-100 text-green-700";

      case "Cancelada":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }
async function excluirOS(id: number) {
  const confirmar = confirm(
    "Deseja realmente excluir esta ordem de serviço?"
  );

  if (!confirmar) return;

  if (!supabase) return;

  const { error } = await supabase
    .from("ordens_servico")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  carregarOrdens();
}
  

function editarOS(os: OrdemServico) {
  setEditandoId(os.id);

  setCliente(os.cliente);
  setServico(os.servico);
  setTecnico(os.tecnico);
  setStatus(os.status);
  setValor(String(os.valor));

  setObservacoes(os.observacoes);



  setModalAberto(true);
}

function limparFormulario() {
  setEditandoId(null);

  setCliente("");
  setServico("");
  setTecnico("");
  setStatus("Aberta");
  setValor("");

  setObservacoes("");

  setModalAberto(false);
}

  useEffect(() => {
    carregarClientes();
    carregarOrdens();
  }, []);

  return (
    <div className="p-8">

<div className="flex items-start justify-between mb-8">

  <h1 className="text-4xl font-bold text-slate-900">
    Ordens de Serviço
  </h1>

  <div className="flex-1 flex justify-center">
    <input
      type="text"
      placeholder="Buscar ordem de serviço..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="w-96 border rounded-xl p-3 text-black shadow-sm"
    />
  </div>

  <button
    onClick={() => {
      limparFormulario();
      setModalAberto(true);
    }}
    style={{
      backgroundColor: "#ea580c",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "8px",
      fontWeight: "700",
      border: "none",
      cursor: "pointer",
    }}
  >
    Nova OS
  </button>

</div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
  <tr>
    <th className="p-4 text-left">Número</th>
    <th className="p-4 text-left">Cliente</th>
    <th className="p-4 text-left">Serviço</th>
    <th className="p-4 text-left">Técnico</th>
    <th className="p-4 text-left">Status</th>
    <th className="p-4 text-left">Ações</th>
  </tr>
</thead>

         <tbody>
 {ordens
  .filter(
    (os) =>
      os.cliente
        ?.toLowerCase()
        .includes(busca.toLowerCase()) ||
      os.servico
        ?.toLowerCase()
        .includes(busca.toLowerCase()) ||
      os.tecnico
        ?.toLowerCase()
        .includes(busca.toLowerCase()) ||
      `OS-${String(os.id).padStart(3, "0")}`
  .toLowerCase()
  .includes(busca.toLowerCase())
  )
  .map((os) => (
    <tr
      key={os.id}
      className="border-t hover:bg-slate-50"
    >
      <td className="p-4 font-semibold text-blue-600">
        OS-{String(os.id).padStart(3, "0")}
      </td>

      <td className="p-4">
        {os.cliente}
      </td>

      <td className="p-4">
        {os.servico}
      </td>

      <td className="p-4">
        {os.tecnico}
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${corStatus(
            os.status
          )}`}
        >
          {os.status}
        </span>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => gerarPDF(os)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
            title="PDF"
          >
            <FileText size={18} />
          </button>

          <button
            onClick={() => editarOS(os)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => excluirOS(os.id)}
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
    ? "Editar Ordem de Serviço"
    : "Nova Ordem de Serviço"
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
              <option key={c.id} value={c.nome}>
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

          <input
            type="text"
            placeholder="Técnico"
            value={tecnico}
            onChange={(e) => setTecnico(e.target.value)}
            className="border rounded-lg p-3 text-black md:col-span-2"
          />

          <input
  type="number"
  step="0.01"
  placeholder="Valor do serviço"
  value={valor}
  onChange={(e) => setValor(e.target.value)}
  className="border rounded-lg p-3 text-black"
/>

          <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border rounded-lg p-3 text-black"
>
  <option value="Aberta">Aberta</option>
  <option value="Em andamento">Em andamento</option>
  <option value="Finalizada">Finalizada</option>
  <option value="Cancelada">Cancelada</option>
</select>

          <textarea
            placeholder="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="border rounded-lg p-3 text-black md:col-span-2"
            rows={4}
          />


        </div>

       <div className="flex justify-end gap-3 mt-6">
  <button
    onClick={limparFormulario}
    style={{
      padding: "10px 20px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      backgroundColor: "#ffffff",
      color: "#111827",
      cursor: "pointer",
    }}
  >
    Cancelar
  </button>

  <button
    onClick={salvarOS}
    style={{
      backgroundColor: "#ea580c",
      color: "#ffffff",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    {editandoId ? "Atualizar" : "Salvar"}
  </button>
</div>
           </Modal>

    </div>
  );
}