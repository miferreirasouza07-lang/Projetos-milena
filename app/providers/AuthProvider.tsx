"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

type Usuario = {
  auth_id: string;
  nome: string;
  email: string;
  cargo: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  carregando: true,
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarUsuario() {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUsuario(null);
      setCarregando(false);
      return;
    }

    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("auth_id", session.user.id)
      .single();

    setUsuario(data ?? null);
    setCarregando(false);
  }

  useEffect(() => {
    carregarUsuario();

    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      carregarUsuario();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}