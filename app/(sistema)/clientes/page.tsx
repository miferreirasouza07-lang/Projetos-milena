"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [busca, setBusca] = useState("");

  async function carregarClientes() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setClientes(data || []);
  }

  async function salvarCliente() {
    if (!nome || !telefone || !endereco) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!supabase) return;

    if (editandoId) {
      const { error } = await supabase
        .from("clientes")
       .update({
  nome,
  telefone,
  endereco,
})
        .eq("id", editandoId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("clientes")
        .insert([
  {
    nome,
    telefone,
    endereco,
  },
])

      if (error) {
        alert(error.message);
        return;
      }
    }

    limparFormulario();
    carregarClientes();
  }

  async function excluirCliente(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) return;

    if (!supabase) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    carregarClientes();
  }

  function editarCliente(cliente: Cliente) {
    setEditandoId(cliente.id);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEndereco(cliente.endereco);
    setModalAberto(true);
  }

  function limparFormulario() {
    setEditandoId(null);
    setNome("");
    setTelefone("");
    setEndereco("");
    setModalAberto(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="p-8">
     <div className="flex items-center justify-between mb-8">

  <h1 className="text-5xl font-bold text-slate-900 w-64">
    Clientes
  </h1>

  <div className="flex-1 flex justify-center">
    <input
      type="text"
      placeholder="Buscar cliente..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
     className="w-150 border rounded-xl p-3 text-black shadow-sm"
    />
  </div>

  <div className="w-64 flex justify-end">
    <button
      onClick={() => setModalAberto(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
    >
      Novo Cliente
    </button>
  </div>

</div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Nome</th>
              <th className="text-left p-4">Telefone</th>
              <th className="text-left p-4">Endereço</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
           {clientes
  .filter((cliente) =>
    cliente.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase()) ||

    cliente.telefone
      ?.toLowerCase()
      .includes(busca.toLowerCase()) ||

    cliente.endereco
      ?.toLowerCase()
      .includes(busca.toLowerCase())
  )
  .map((cliente) => (
              <tr
                key={cliente.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">{cliente.id}</td>
                <td className="p-4">{cliente.nome}</td>
                <td className="p-4">{cliente.telefone}</td>
                <td className="p-4">{cliente.endereco}</td>

                <td className="p-4">
  <div className="flex items-center gap-2">

    <button
      onClick={() => editarCliente(cliente)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
      title="Editar Cliente"
    >
      <Pencil size={18} />
    </button>

    <button
      onClick={() => excluirCliente(cliente.id)}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
      title="Excluir Cliente"
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
            ? "Editar Cliente"
            : "Novo Cliente"
        }
      >


        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={limparFormulario}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>

          <button
            onClick={salvarCliente}
            style={{
              backgroundColor: "#16a34a",
              color: "#fff",
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