"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProtegeRota({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!supabase) {
      router.replace("/login");
      return;
    }

    const client = supabase;

    async function verificarSessao() {
      const {
        data: { session },
      } = await client.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setCarregando(false);
    }

    verificarSessao();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}