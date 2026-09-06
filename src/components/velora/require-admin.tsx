import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminSession } from "@/lib/admin-auth";

/** Bloqueia o conteúdo até confirmar sessão de admin; redireciona convidados ao login. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const status = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "guest") void navigate({ to: "/admin/login" });
  }, [status, navigate]);

  if (status !== "authed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <p className="text-[13px] text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  return <>{children}</>;
}
