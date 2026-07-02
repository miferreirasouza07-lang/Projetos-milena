export default function UsuariosPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Usuários
        </h1>

        <p className="text-slate-500">
          Gerencie os usuários do sistema.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold">
          Novo Usuário
        </button>

      </div>

    </div>
  );
}