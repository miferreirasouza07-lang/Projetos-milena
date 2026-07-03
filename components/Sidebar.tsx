import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">

      <div className="p-6 border-b border-slate-700 flex flex-col items-center">
        <div className="p-4 border-b border-slate-700">
  <h2 className="text-lg font-bold text-white">
    RF Ar Condicionado
  </h2>

  <p className="text-xs text-slate-400 mt-1">
    Sistema de Gestão
  </p>
</div>
</div>

<nav className="p-4 space-y-2">

        <Link
          href="/dashboard"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          href="/clientes"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Clientes
        </Link>

        <Link
          href="/agenda"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Agenda
        </Link>

        <Link
          href="/orcamentos"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Orçamentos
        </Link>

        <Link
          href="/ordens-servico"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Ordens de Serviço
        </Link>

        <Link
          href="/financeiro"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Financeiro
        </Link>

        <Link
          href="/estoque"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Estoque
        </Link>



      </nav>
    </aside>
  );
}