
"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { logoBase64 } from "@/lib/logoBase64";
import { Pencil, Trash2, FileText } from "lucide-react";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";

interface Cliente {
  id: number;
  nome: string;
}

interface Agendamento {
  id: number;
  cliente: string;
  endereco: string;
  data: string;
  hora: string;
  servico: string;
  observacoes: string;
  tecnico: string;
  status: string;
}

export default function AgendaPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [cliente, setCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [servico, setServico] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [status, setStatus] = useState("Agendado");
  const [filtroData, setFiltroData] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [dataSelecionada, setDataSelecionada] =
  useState<Date>(new Date());

  async function carregarClientes() {
    if (!supabase) return;

    const { data } = await supabase
      .from("clientes")
      .select("id,nome")
      .order("nome");

    setClientes(data || []);
  }

  async function carregarAgendamentos() {
    if (!supabase) return;

    const { data } = await supabase
      .from("agendamentos")
      .select("*")
      .order("id", { ascending: false });

    setAgendamentos(data || []);
  }

  async function salvarAgendamento() {
    if (!cliente || !data || !hora || !servico || !tecnico) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!supabase) return;

    if (editandoId) {
      const { error } = await supabase
        .from("agendamentos")
        .update({
  cliente,
  data,
  hora,
  endereco,
  servico,
  tecnico,
  status,
  observacoes,
})
        .eq("id", editandoId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("agendamentos")
       .insert([
  {
    cliente,
    data,
    hora,
    endereco,
    servico,
    tecnico,
    status,
    observacoes,
  },
])

      if (error) {
        alert(error.message);
        return;
      }
    }

    limparFormulario();
    carregarAgendamentos();
  }
function gerarPDF(item: Agendamento) {
  const pdf = new jsPDF();

  // Logo
 pdf.addImage(logoBase64, "JPEG", 20, 15, 55, 45);

pdf.setFontSize(22);
pdf.setTextColor(0, 102, 204);
pdf.setFont("helvetica", "bold");
pdf.text("AGENDAMENTO", 20, 75);

pdf.setDrawColor(0, 102, 204);
pdf.line(20, 82, 190, 82);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);

  // Cliente
  pdf.setFont("helvetica", "bold");
  pdf.text("Cliente:", 20, 105);
  let x = 20 + pdf.getTextWidth("Cliente:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(item.cliente, x, 105);

  // Endereço
  pdf.setFont("helvetica", "bold");
  pdf.text("Endereço:", 20, 120);
  x = 20 + pdf.getTextWidth("Endereço:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(item.endereco || "", x, 120);

  // Serviço
  pdf.setFont("helvetica", "bold");
  pdf.text("Serviço:", 20, 135);
  x = 20 + pdf.getTextWidth("Serviço:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(item.servico, x, 135);

  // Data
  pdf.setFont("helvetica", "bold");
  pdf.text("Data:", 20, 150);
  x = 20 + pdf.getTextWidth("Data:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(
    item.data.split("-").reverse().join("/"),
    x,
    150
  );

  // Hora
  pdf.setFont("helvetica", "bold");
  pdf.text("Hora:", 20, 165);
  x = 20 + pdf.getTextWidth("Hora:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(item.hora, x, 165);

  // Técnico
  pdf.setFont("helvetica", "bold");
  pdf.text("Técnico:", 20, 180);
  x = 20 + pdf.getTextWidth("Técnico:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(item.tecnico, x, 180);


  // Status
  pdf.setFont("helvetica", "bold");
  pdf.text("Status:", 20, 195);
  x = 20 + pdf.getTextWidth("Status:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(item.status, x, 195);

  pdf.setFont("helvetica", "bold");
pdf.text("Observações:", 20, 225);

pdf.setFont("helvetica", "normal");

pdf.text(
  item.observacoes || "Nenhuma observação",
  20,
  240,
  { maxWidth: 160 }
);

  // Data de emissão
  pdf.setFont("helvetica", "bold");
  pdf.text("Data de emissão:", 20, 210);
  x = 20 + pdf.getTextWidth("Data de emissão:") + 3;
  pdf.setFont("helvetica", "normal");
  pdf.text(
    new Date().toLocaleDateString("pt-BR"),
    x,
    210
  );

  pdf.save(`agendamento-${item.id}.pdf`);
}
  async function excluirAgendamento(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este agendamento?"
    );

    if (!confirmar) return;

    if (!supabase) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    carregarAgendamentos();
  }

  function editarAgendamento(item: Agendamento) {
    setEditandoId(item.id);

    setCliente(item.cliente);
    setEndereco(item.endereco);
    setData(item.data);
    setHora(item.hora);
    setServico(item.servico);
    setObservacoes(item.observacoes || "");
    setTecnico(item.tecnico);
    setStatus(item.status);

    setModalAberto(true);
  }

  function limparFormulario() {
    setEditandoId(null);

    setCliente("");
    setEndereco("");
    setData("");
    setHora("");
    setServico("");
    setObservacoes("");
    setTecnico("");
    setStatus("Agendado");

    setModalAberto(false);
  }

 function corStatus(status: string) {
  switch (status) {
    case "Agendado":
      return "bg-yellow-100 text-yellow-700";

    case "Em andamento":
      return "bg-blue-100 text-blue-700";

    case "Concluído":
      return "bg-green-100 text-green-700";

    case "Cancelado":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

  useEffect(() => {
    carregarClientes();
    carregarAgendamentos();
  }, []);

  return (
  <div className="p-8">

    {/* Cabeçalho */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold text-slate-900">
        Agenda
      </h1>

      <button
        onClick={() => {
          limparFormulario();
          setModalAberto(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
      >
        Novo Agendamento
      </button>
    </div>

    {/* Calendário */}
<div className="mb-6">

  <div className="bg-white rounded-3xl shadow-lg border p-6 mb-6 w-full">

    <div>
      <Calendar
        value={dataSelecionada}
        onChange={(value) =>
          setDataSelecionada(value as Date)
        }
tileContent={({ date }) => {
  const quantidade =
    agendamentos.filter((a) => {
      const dataAgenda = new Date(
        a.data + "T00:00:00"
      );

      return (
        dataAgenda.toDateString() ===
        date.toDateString()
      );
    }).length;

  if (!quantidade) return null;

  return (
    <div className="flex justify-center gap-1 mt-1">
      {Array.from({
        length: Math.min(quantidade, 3),
      }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
      ))}
    </div>
  );
}}
      />

      <button
        onClick={() => {
          const ano =
            dataSelecionada.getFullYear();

          const mes = String(
            dataSelecionada.getMonth() + 1
          ).padStart(2, "0");

          const dia = String(
            dataSelecionada.getDate()
          ).padStart(2, "0");

          setFiltroData(
            `${ano}-${mes}-${dia}`
          );
        }}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow"
      >
        Ver Agenda do Dia
      </button>
    </div>


  </div>
</div>

    {/* Filtros */}
   <div className="bg-white rounded-2xl shadow border p-6 mb-6">
  <div className="flex flex-wrap items-center gap-4">
      </div>

  

      <input
        type="date"
        value={filtroData}
        onChange={(e) => setFiltroData(e.target.value)}
        className="border rounded-xl p-3 text-black min-w-45"
      />

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={buscaCliente}
        onChange={(e) =>
          setBuscaCliente(e.target.value)
        }
        className="border rounded-xl p-3 text-black flex-1 min-w-45"
      />

      <button
        onClick={() => {
          setFiltroData("");
          setBuscaCliente("");
        }}
        className="bg-slate-200 hover:bg-slate-300 px-6 py-3 rounded-xl font-medium"
      >
        Limpar
      </button>

    </div>
<div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
  <p className="text-blue-700 font-semibold">
    Total de agendamentos: {agendamentos.length}
  </p>
</div>
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Hora</th>
              <th className="text-left p-4">Cliente</th>
              <th className="text-left p-4">Endereço</th>
              <th className="text-left p-4">Serviço</th>
              <th className="text-left p-4">Técnico</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {agendamentos
  .filter((item) => {
    const filtroDataOk =
      !filtroData || item.data === filtroData;

 const filtroClienteOk =
  !buscaCliente ||
  item.cliente
    .toLowerCase()
    .includes(buscaCliente.toLowerCase()) ||
  item.servico
    .toLowerCase()
    .includes(buscaCliente.toLowerCase());
    
    return (
      filtroDataOk &&
      filtroClienteOk
    );
  })
  .map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >
               <td className="p-4">
  {item.data.split("-").reverse().join("/")}
</td>
                <td className="p-4">{item.hora}</td>
                <td className="p-4">{item.cliente}</td>
                <td className="p-4">{item.endereco}</td>
                <td className="p-4">{item.servico}</td>
                <td className="p-4">{item.tecnico}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${corStatus(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">

  <button
    onClick={() => gerarPDF(item)}
    className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all"
    title="Gerar PDF"
  >
    <FileText size={18} />
  </button>
                    <button
                      onClick={() => editarAgendamento(item)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => excluirAgendamento(item.id)}
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
            ? "Editar Agendamento"
            : "Novo Agendamento"
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
  placeholder="Endereço"
  value={endereco}
  onChange={(e) => setEndereco(e.target.value)}
  className="border rounded-lg p-3 text-black"
/>

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

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
        </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="border rounded-xl p-3 text-black"
  >
    <option>Agendado</option>
    <option>Em andamento</option>
    <option>Concluído</option>
    <option>Cancelado</option>
  </select>

  <div></div>
</div>

<textarea
  placeholder="Observações"
  value={observacoes}
  onChange={(e) => setObservacoes(e.target.value)}
  className="w-full border rounded-xl p-3 h-32 text-black mt-4"
/>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={limparFormulario}
            className="px-5 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={salvarAgendamento}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            {editandoId ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </Modal>
    </div>

    
  );
}