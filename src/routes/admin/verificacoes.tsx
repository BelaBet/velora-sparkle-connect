import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RequireAdmin } from "@/components/velora/require-admin";
import { AdminShell } from "@/components/velora/admin-shell";
import {
  useVerificationRequests,
  useResolveVerification,
  type VerificationStatus,
  type VerificationType,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/verificacoes")({
  head: () => ({
    meta: [{ title: "Velora Admin — Verificações" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminVerificacoes,
});

const typeLabel: Record<VerificationType, string> = {
  identidade: "Identidade",
  liveness: "Presença (liveness)",
};

const statusStyle: Record<VerificationStatus, string> = {
  pendente: "text-champagne",
  aprovada: "text-champagne",
  rejeitada: "text-destructive",
};

function AdminVerificacoes() {
  return (
    <RequireAdmin>
      <AdminShell active="Verificações">
        <VerificacoesContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function VerificacoesContent() {
  const { data: requests, isLoading, isError } = useVerificationRequests();
  const resolveVerification = useResolveVerification();

  const resolve = (
    id: string,
    profileName: string,
    type: VerificationType,
    status: VerificationStatus,
  ) => {
    resolveVerification.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast(status === "aprovada" ? "Verificação aprovada" : "Verificação rejeitada", {
            description: `${profileName} · ${typeLabel[type]}`,
          }),
        onError: () =>
          toast("Não foi possível atualizar a verificação", { description: profileName }),
      },
    );
  };

  const pending = requests?.filter((r) => r.status === "pendente") ?? [];
  const resolved = requests?.filter((r) => r.status !== "pendente") ?? [];

  return (
    <>
      <p className="text-eyebrow">Confiança</p>
      <h2 className="mt-3 font-display text-3xl text-ivory">Verificações</h2>

      {isLoading && (
        <p className="mt-8 text-[13px] text-muted-foreground">Carregando verificações…</p>
      )}
      {isError && (
        <p className="mt-8 text-[13px] text-destructive">
          Não foi possível carregar as verificações.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <h3 className="mt-8 text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
            Pendentes ({pending.length})
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            {pending.length === 0 && (
              <p className="text-[13px] text-muted-foreground">Nenhuma verificação pendente.</p>
            )}
            {pending.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-4 rounded-lg surface-glass p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[15px] text-ivory">{r.profileName}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {typeLabel[r.type]} · enviado em {r.submittedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={resolveVerification.isPending}
                    onClick={() => resolve(r.id, r.profileName, r.type, "rejeitada")}
                    className="text-[13px] text-destructive underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40"
                  >
                    Rejeitar
                  </button>
                  <button
                    type="button"
                    disabled={resolveVerification.isPending}
                    onClick={() => resolve(r.id, r.profileName, r.type, "aprovada")}
                    className="rounded-full border border-champagne px-4 py-1.5 text-[13px] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
                  >
                    Aprovar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
            Histórico
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            {resolved.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg surface-glass p-5"
              >
                <div>
                  <p className="text-[15px] text-ivory">{r.profileName}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {typeLabel[r.type]} · {r.submittedAt}
                  </p>
                </div>
                <span
                  className={cn("text-[13px] uppercase tracking-[0.08em]", statusStyle[r.status])}
                >
                  {r.status === "aprovada" ? "Aprovada" : "Rejeitada"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
