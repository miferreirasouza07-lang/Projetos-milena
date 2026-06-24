"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);
  const [totalOrcamentos, setTotalOrcamentos] = useState(0);
  const [totalOS, setTotalOS] = useState(0);

  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [agendamentosHoje, setAgendamentosHoje] = useState<any[]>([]);
const [totalHoje, setTotalHoje] = useState(0);


  async function carregarDashboard() {
    if (!supabase) return;

    const { count: clientes } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true });

    const { count: agendamentos } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true });

      const hoje = new Date();
const dataHoje =
  hoje.getFullYear() +
  "-" +
  String(hoje.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(hoje.getDate()).padStart(2, "0");

const { data: agendaHoje } = await supabase
  .from("agendamentos")
  .select("*")
  .eq("data", dataHoje)
  .order("hora");

setAgendamentosHoje(agendaHoje || []);
setTotalHoje(agendaHoje?.length || 0);

    const { count: orcamentos } = await supabase
      .from("orcamentos")
      .select("*", { count: "exact", head: true });

    const { count: ordens } = await supabase
      .from("ordens_servico")
      .select("*", { count: "exact", head: true });

    const { data: financeiro } = await supabase
      .from("financeiro")
      .select("*");

    let totalReceitas = 0;
    let totalDespesas = 0;

    financeiro?.forEach((item: any) => {
      if (item.tipo === "Receita") {
        totalReceitas += Number(item.valor);
      } else {
        totalDespesas += Number(item.valor);
      }
    });

    setTotalClientes(clientes || 0);
    setTotalAgendamentos(agendamentos || 0);
    setTotalOrcamentos(orcamentos || 0);
    setTotalOS(ordens || 0);

    setReceitas(totalReceitas);
    setDespesas(totalDespesas);
    setSaldo(totalReceitas - totalDespesas);
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

       <div
  onClick={() => router.push("/clientes")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Clientes
  </p>

  <h2 className="text-4xl font-bold mt-3">
    {totalClientes}
  </h2>
</div>

        <div
  onClick={() => router.push("/agenda")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Agendamentos
  </p>

  <h2 className="text-4xl font-bold mt-3 text-blue-600">
    {totalAgendamentos}
  </h2>
</div>

        <div
  onClick={() => router.push("/orcamentos")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Orçamentos
  </p>

  <h2 className="text-4xl font-bold mt-3 text-orange-600">
    {totalOrcamentos}
  </h2>
</div>

        <div
  onClick={() => router.push("/ordens-servico")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Ordens de Serviço
  </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {totalOS}
          </h2>
        </div>

        <div
  onClick={() => router.push("/financeiro")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Receitas
  </p>

  <h2 className="text-4xl font-bold mt-3 text-green-600">
    R$ {receitas.toFixed(2)}
  </h2>
</div>
        <div
  onClick={() => router.push("/financeiro")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Despesas
  </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            R$ {despesas.toFixed(2)}
          </h2>
        </div>

        <div
  onClick={() => router.push("/financeiro")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Saldo
  </p>

          <h2
            className={`text-4xl font-bold mt-3 ${
              saldo >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            R$ {saldo.toFixed(2)}
          </h2>
        </div>

       <div
  onClick={() => router.push("/agenda")}
  className="bg-white rounded-xl shadow border p-6 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200"
>
  <p className="text-slate-600">
    Agendamentos Hoje
  </p>

  <h2 className="text-4xl font-bold text-blue-600 mt-3">
    {totalHoje}
  </h2>
</div>

</div>

<div className="bg-white rounded-2xl shadow-lg border p-6 mt-8 w-full">
  <h2 className="text-2xl font-bold mb-6">
    Agenda de Hoje
  </h2>

  {agendamentosHoje.length === 0 ? (
    <p className="text-slate-500">
      Nenhum agendamento para hoje.
    </p>
  ) : (
    <div className="space-y-3">
      {agendamentosHoje.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b pb-3"
        >
          <div className="w-24">
            <span className="font-bold text-blue-600 text-lg">
              {item.hora}
            </span>
          </div>

          <div className="flex-1">
            <p className="font-semibold">
              {item.cliente}
            </p>

            <p className="text-sm text-slate-500">
              {item.servico}
            </p>
          </div>

          <div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

</div>
  );
}