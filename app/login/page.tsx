"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [nomeCadastro, setNomeCadastro] = useState("");
const [emailCadastro, setEmailCadastro] = useState("");
const [senhaCadastro, setSenhaCadastro] = useState("");
  
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const router = useRouter();

async function criarConta() {
  if (!supabase) return;

  const { data, error } = await supabase.auth.signUp({
    email: emailCadastro,
    password: senhaCadastro,
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Conta criada com sucesso!");
}

async function fazerLogin() {

   if (!supabase) {
    alert("Supabase não configurado");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    alert(error.message);
    return;
  }

  router.push("/dashboard");
}
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-10">
        <div>

        <div>
  <img
    src="/logo.jpg"
    alt="RF Ar Condicionado"
    className="w-140 h-auto mb-4"
  />

</div>

        </div>
      </div>

      {/* Lado direito */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-linear-to-br from-blue-900 to-green-600 p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold text-white mb-8">
  Bem-vindo
</h2>

          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-white">
  E-mail
</label>

              <input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
                placeholder="Digite seu e-mail"
               className="w-full border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-white">
                Senha
              </label>

              <div className="relative">
    <input
  value={senha}
  onChange={(e) => setSenha(e.target.value)}
  type={showPassword ? "text" : "password"}
      placeholder="Digite sua senha"
      className="w-full border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>
</div>

            <div className="flex items-center justify-between text-sm">
              <label className="text-white flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                />
                Lembrar acesso
              </label>

              <button
                type="button"
                className="text-white font-medium hover:text-slate-200"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
  type="button"
  onClick={fazerLogin}
  className="w-full bg-white hover:bg-slate-100 text-green-700 py-3 rounded-lg font-bold transition shadow-lg"
>
  Entrar
</button>
<div className="text-center mt-4">
  <button
  type="button"
  onClick={() => setCadastroAberto(true)}
  className="text-white hover:text-slate-200 font-medium"
>
  Criar Conta
</button>
</div>
          </form>

          {cadastroAberto && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md">

      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        Criar Conta
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Nome"
          value={nomeCadastro}
  onChange={(e) => setNomeCadastro(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="email"
          placeholder="E-mail"
          value={emailCadastro}
  onChange={(e) => setEmailCadastro(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senhaCadastro}
  onChange={(e) => setSenhaCadastro(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setCadastroAberto(false)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancelar
        </button>

       <button
  onClick={criarConta}
  className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
  Criar Conta
</button>

      </div>

    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}