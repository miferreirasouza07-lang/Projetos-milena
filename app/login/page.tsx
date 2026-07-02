"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const router = useRouter();

async function fazerLogin() {
  if (!supabase) {
    alert("Supabase não configurado");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  const { data: usuario, error: erroUsuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (erroUsuario || !usuario) {
    await supabase.auth.signOut();
    alert("Você não possui permissão para acessar o sistema.");
    return;
  }

  localStorage.setItem("usuario", JSON.stringify(usuario));

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

          </form>
        </div>
      </div>
    </div>
  );
}