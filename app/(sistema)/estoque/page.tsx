"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";
import {
  Pencil,
  Trash2,
  Package
} from "lucide-react";

interface Produto {
  id: number;
  produto: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  valor: number;
}

export default function EstoquePage() {
  const [modalAberto, setModalAberto] = useState(false);

  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [produto, setProduto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [minimo, setMinimo] = useState("");
  const [valor, setValor] = useState("");
  const [editandoId, setEditandoId] =
  useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [modalMovimento, setModalMovimento] =
  useState(false);

const [produtoMovimento, setProdutoMovimento] =
  useState<Produto | null>(null);

const [tipoMovimento, setTipoMovimento] =
  useState("Entrada");

const [quantidadeMovimento, setQuantidadeMovimento] =
  useState("");

  async function carregarProdutos() {
    if (!supabase) return;

    const { data } = await supabase
      .from("estoque")
      .select("*")
      .order("id", { ascending: false });

    setProdutos(data || []);
  }

 async function salvarProduto() {


  if (
    !produto ||
    !categoria ||
    !quantidade ||
    !minimo ||
    !valor
  ) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!supabase) return;

  if (editandoId) {
    const { error } = await supabase
      .from("estoque")
      .update({
        produto,
        categoria,
        quantidade,
        minimo,
        valor,
      })
      .eq("id", editandoId);

    if (error) {
      alert(error.message);
      return;
    }
  } else {
    const { error } = await supabase
      .from("estoque")
      .insert([
        {
          produto,
          categoria,
          quantidade,
          minimo,
          valor,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }
  }

  setProduto("");
  setCategoria("");
  setQuantidade("");
  setMinimo("");
  setValor("");
  setEditandoId(null);

  setModalAberto(false);

  carregarProdutos();
}

async function excluirProduto(id: number) {


  const confirmar = confirm(
    "Deseja realmente excluir este produto?"
  );

  if (!confirmar) return;

  if (!supabase)return;
  

const { error } = await supabase
  .from("estoque")
  .delete()
  .eq("id", id);


if (error) {
  alert(error.message);
  return;
}

  carregarProdutos();
}

  useEffect(() => {
    carregarProdutos();
  }, []);

  const valorTotal = produtos.reduce(
    (acc, item) =>
      acc + Number(item.valor) * Number(item.quantidade),
    0
  );

  function movimentarProduto(item: Produto) {
  setProdutoMovimento(item);
  setTipoMovimento("Entrada");
  setQuantidadeMovimento("");

  setModalMovimento(true);
}

async function confirmarMovimento() {
  if (!produtoMovimento) return;

  const qtd = Number(quantidadeMovimento);

  if (!qtd || qtd <= 0) {
    alert("Informe uma quantidade válida.");
    return;
  }

  let novaQuantidade =
    tipoMovimento === "Entrada"
      ? produtoMovimento.quantidade + qtd
      : produtoMovimento.quantidade - qtd;

  if (novaQuantidade < 0) {
    alert("Estoque insuficiente.");
    return;
  }
if (!supabase) return;
  const { error } = await supabase
    .from("estoque")
    .update({
      quantidade: novaQuantidade,
    })
    .eq("id", produtoMovimento.id);

  if (error) {
    alert(error.message);
    return;
  }

  setModalMovimento(false);

  carregarProdutos();
}

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">

  <h1 className="text-4xl font-bold text-slate-900">
    Estoque
  </h1>

  <div className="flex-1 flex justify-center">
    <input
      type="text"
      placeholder="Buscar produto..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="w-96 border rounded-xl p-3 text-black shadow-sm"
    />
  </div>

  <button
    onClick={() => {
      setEditandoId(null);

      setProduto("");
      setCategoria("");
      setQuantidade("");
      setMinimo("");
      setValor("");

      setModalAberto(true);
    }}
    style={{
      backgroundColor: "#2563eb",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    Novo Produto
  </button>

</div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Produto</th>
              <th className="text-left p-4">Categoria</th>
              <th className="text-left p-4">Quantidade</th>
              <th className="text-left p-4">Mínimo</th>
              <th className="text-left p-4">Valor</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
          {produtos
  .filter((item) => {
    const textoBusca = busca.toLowerCase();

    const status =
      item.quantidade < item.minimo
        ? "estoque baixo"
        : "normal";

    return (
      item.produto
        ?.toLowerCase()
        .includes(textoBusca) ||
      item.categoria
        ?.toLowerCase()
        .includes(textoBusca) ||
      status.includes(textoBusca)
    );
  })
  .map((item) => (



              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"

                
              >
                <td className="p-4">
                  {item.produto}
                </td>

                <td className="p-4">
                  {item.categoria}
                </td>

                <td className="p-4">
                  {item.quantidade}
                </td>

                <td className="p-4">
                  {item.minimo}
                </td>

                <td className="p-4 font-semibold">
                  R$ {Number(item.valor).toFixed(2)}
                </td>

                <td className="p-4">
  {item.quantidade < item.minimo ? (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
      Estoque Baixo
    </span>
  ) : (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
      Normal
    </span>
  )}
</td>

<td className="p-4">
  <div className="flex items-center gap-2">

    <button
  onClick={() => {
    setEditandoId(item.id);

    setProduto(item.produto);
    setCategoria(item.categoria);
    setQuantidade(String(item.quantidade));
    setMinimo(String(item.minimo));
    setValor(String(item.valor));

    setModalAberto(true);
  }}
  className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
  title="Editar"
>
  <Pencil size={18} />
</button>

    <button
  onClick={() => {
    excluirProduto(item.id);
  }}
  className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
  title="Excluir"
>
      <Trash2 size={18} />
    </button>

<button
  onClick={() => movimentarProduto(item)}
  className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
  title="Movimentar"
>
  <Package size={18} />
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
            ? "Editar Produto"
            : "Novo Produto"
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Produto"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          

          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="number"
            placeholder="Estoque mínimo"
            value={minimo}
            onChange={(e) => setMinimo(e.target.value)}
            className="border rounded-lg p-3 text-black"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Valor unitário"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border rounded-lg p-3 text-black md:col-span-2"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setModalAberto(false)}
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
            onClick={salvarProduto}
            style={{
              backgroundColor: "#2563eb",
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

      <Modal
  aberto={modalMovimento}
  fechar={() => setModalMovimento(false)}
  titulo="Movimentar Estoque"
>
  <div className="space-y-4">

    <input
      type="text"
      value={produtoMovimento?.produto || ""}
      disabled
      className="border rounded-lg p-3 w-full bg-slate-100 text-black"
    />

    <select
      value={tipoMovimento}
      onChange={(e) => setTipoMovimento(e.target.value)}
      className="border rounded-lg p-3 w-full text-black"
    >
      <option>Entrada</option>
      <option>Saída</option>
    </select>

    <input
      type="number"
      placeholder="Quantidade"
      value={quantidadeMovimento}
      onChange={(e) => setQuantidadeMovimento(e.target.value)}
      className="border rounded-lg p-3 w-full text-black"
    />

    <div className="flex justify-end gap-3 mt-6">

  <button
    onClick={() => setModalMovimento(false)}
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
    onClick={confirmarMovimento}
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
    Atualizar
  </button>

</div>
  </div>
</Modal>

    </div>
  );
}