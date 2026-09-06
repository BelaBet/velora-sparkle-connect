import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";

export async function signInAdmin(email: string, password: string): Promise<string | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return error.message;

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return "Esta conta não tem acesso ao painel administrativo.";
  }

  return null;
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

export type AdminAuthStatus = "checking" | "authed" | "guest";

/** Sessão de admin: exige usuário autenticado E presente na tabela admins. */
export function useAdminSession(): AdminAuthStatus {
  const [status, setStatus] = useState<AdminAuthStatus>("checking");

  useEffect(() => {
    let active = true;

    const evaluate = async (session: Session | null) => {
      if (!session) {
        if (active) setStatus("guest");
        return;
      }
      const { data: admin } = await supabase
        .from("admins")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();
      if (active) setStatus(admin ? "authed" : "guest");
    };

    void supabase.auth.getSession().then(({ data }) => evaluate(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void evaluate(session);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return status;
}
