"use client";


import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter();
 const [perfilAberto, setPerfilAberto] = useState(false);
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [editandoPerfil, setEditandoPerfil] = useState(false);


async function salvarPerfil() {
  if (!supabase) return;

  const { data, error } = await supabase
    .from("usuarios")
    .update({
      nome,
      email,
    })
    .eq("id", 1)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

alert("Perfil atualizado!");
setEditandoPerfil(false);
}

async function carregarPerfil() {
  if (!supabase) return;

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  setNome(data.nome);
  setEmail(data.email);
}

useEffect(() => {
  carregarPerfil();
}, []);

  return (
    <header className="bg-white border-b h-20 flex items-center justify-between px-6">
      <img
        src="/logo.jpg"
        alt="RF Ar Condicionado"
        className="h-20 w-auto object-contain"
      />

      <div className="relative">
      <button
  onClick={() => setMenuAberto(!menuAberto)}
  className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg"
>
  {nome ? nome.charAt(0).toUpperCase() : "?"}
</button>

        {menuAberto && (
          <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
            <button
  onClick={() => {
    setPerfilAberto(true);
    setMenuAberto(false);
  }}
  className="w-full text-left px-4 py-3 hover:bg-slate-100"
>
  Meu Perfil
</button>


            <button
  onClick={() => {
    router.push("/login");
  }}
  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
>
  Sair
</button>
          </div>
        )}
      </div>
      {perfilAberto && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-100">
      <h2 className="text-2xl font-bold mb-6">
        Meu Perfil
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-slate-500 text-sm">
            Nome
          </label>
         {editandoPerfil ? (
  <input
    value={nome}
    onChange={(e) => setNome(e.target.value)}
    className="border rounded-lg p-2 w-full"
  />
) : (
  <p className="font-semibold">{nome}</p>
)}


        </div>

        <div>
          <label className="text-slate-500 text-sm">
            Email
          </label>
         {editandoPerfil ? (
  <input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="border rounded-lg p-2 w-full"
  />
) : (
  <p className="font-semibold">{email}</p>
)}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
  onClick={() => {
  if (editandoPerfil) {
    salvarPerfil();
  } else {
    setEditandoPerfil(true);
  }
}}
  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all"
>
  {editandoPerfil ? "Salvar" : "Editar"}
</button>
        <button
          onClick={() => setPerfilAberto(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}


    </header>

    
  );
}