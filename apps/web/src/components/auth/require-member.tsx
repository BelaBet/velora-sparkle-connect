import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMemberSession } from "@/lib/member-auth";

const redirectByStatus = {
  guest: "/login",
  "needs-profile": "/completar-perfil",
  "needs-mfa-enroll": "/mfa/configurar",
  "needs-mfa-challenge": "/mfa/verificar",
} as const;

/**
 * Bloqueia o app até confirmar login + verificação em duas etapas (MFA).
 * Existe para impedir que alguém não autorizado acesse contas ou dados
 * de outros membros — por isso login sozinho não basta.
 */
export function RequireMember({ children }: { children: ReactNode }) {
  const status = useMemberSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== "checking" && status !== "authed") {
      void navigate({ to: redirectByStatus[status] });
    }
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
