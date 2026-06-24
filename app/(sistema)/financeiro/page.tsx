"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";
import { Pencil, Trash2 } from "lucide-react";

interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  vencimento: string;
  status: string;
}

export default function FinanceiroPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Receita");
  const [vencimento, setVencimento] = useState("");
  const [editandoId, setEditandoId] =
  useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("Pendente");

  async function carregarLancamentos() {
    if (!supabase) return;

    const { data } = await supabase
      .from("financeiro")
      .select("*")
      .order("id", { ascending: false });

    setLancamentos(data || []);
  }

 async function salvarLancamento() {
  if (!descricao || !valor || !vencimento) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!supabase) return;

  if (editandoId) {
    const { error } = await supabase
      .from("financeiro")
      .update({
        descricao,
        valor: Number(valor),
        tipo,
        vencimento,
        status,
      })
      .eq("id", editandoId);

    if (error) {
      alert(error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from("financeiro")
      .insert([
        {
          descricao,
          valor: Number(valor),
          tipo,
          vencimento,
          status,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }
  }

  setDescricao("");
  setValor("");
  setTipo("Receita");
  setVencimento("");
  setEditandoId(null);

  setModalAberto(false);

  carregarLancamentos();
}

function editarLancamento(item: any) {
  setEditandoId(item.id);

  setDescricao(item.descricao);
  setValor(String(item.valor));
  setTipo(item.tipo);
  setVencimento(item.vencimento);
  setStatus(item.status);

  setModalAberto(true);
}

async function excluirLancamento(id: number) {
  const confirmar = confirm(
    "Deseja realmente excluir este lançamento?"
  );

  if (!confirmar) return;

  if (!supabase) return;

  const { error } = await supabase
    .from("financeiro")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  carregarLancamentos();
}

  useEffect(() => {
    carregarLancamentos();
  }, []);

  const totalReceitas = lancamentos
    .filter((l) => l.tipo === "Receita")
    .reduce((acc, item) => acc + Number(item.valor), 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === "Despesa")
    .reduce((acc, item) => acc + Number(item.valor), 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Financeiro
          </h1>

    
        </div>

        <div className="flex-1 flex justify-center">
  <input
    type="text"
    placeholder="Buscar lançamento..."
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="w-96 border rounded-xl p-3 text-black shadow-sm"
  />
</div>

        <button
          onClick={() => setModalAberto(true)}
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-slate-600">Receitas</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            R$ {totalReceitas.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-slate-600">Despesas</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            R$ {totalDespesas.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-slate-600">Saldo</p>
          <h2
            className={`text-3xl font-bold mt-2 ${
              saldo >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            R$ {saldo.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Descrição</th>
              <th className="text-left p-4">Tipo</th>
              <th className="text-left p-4">Valor</th>
              <th className="text-left p-4">Vencimento</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {lancamentos
  .filter((item) =>
    item.descricao
      ?.toLowerCase()
      .includes(busca.toLowerCase()) ||
    item.tipo
      ?.toLowerCase()
      .includes(busca.toLowerCase()) ||
    item.status
      ?.toLowerCase()
      .includes(busca.toLowerCase())
  )
  .map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">{item.descricao}</td>

                <td className="p-4">
                  {item.tipo}
                </td>

                <td className="p-4 font-semibold">
                  R$ {Number(item.valor).toFixed(2)}
                </td>

               <td className="p-4">
  {item.vencimento
    ?.split("-")
    .reverse()
    .join("/")}
</td>

                <td className="p-4">
                  <span
  className={`px-3 py-1 rounded-full text-sm font-semibold ${
    item.status === "Pago"
      ? "bg-green-100 text-green-700"
      : item.status === "Vencido"
      ? "bg-red-100 text-red-700"
      : item.status === "Cancelado"
      ? "bg-slate-200 text-slate-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {item.status}
</span>
                </td>
                
<td className="p-4">
  <div className="flex items-center gap-2">

    <button
      onClick={() => editarLancamento(item)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
      title="Editar"
    >
      <Pencil size={18} />
    </button>

    <button
      onClick={() => excluirLancamento(item.id)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
      title="Excluir"
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
        fechar={() => setModalAberto(false)}
        titulo={
  editandoId
    ? "Editar Lançamento"
    : "Novo Lançamento"
}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded-lg p-3 text-black"
          >
            <option>Receita</option>
            <option>Despesa</option>
          </select>

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="date"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />
        </div>

<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border rounded-lg p-3 text-black"
>
  <option value="Pendente">Pendente</option>
  <option value="Pago">Pago</option>
  <option value="Vencido">Vencido</option>
  <option value="Cancelado">Cancelado</option>
</select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setModalAberto(false)}
            className="px-5 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={salvarLancamento}
            style={{
              backgroundColor: "#16a34a",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "700",
            }}
          >
            {editandoId ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}