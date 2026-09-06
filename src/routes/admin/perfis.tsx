import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RequireAdmin } from "@/components/velora/require-admin";
import { AdminShell } from "@/components/velora/admin-shell";
import { useAdminProfiles, useSetProfileStatus, type ProfileStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/perfis")({
  head: () => ({
    meta: [{ title: "Velora Admin — Perfis" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPerfis,
});

const statusLabel: Record<ProfileStatus, string> = {
  ativo: "Ativo",
  suspenso: "Suspenso",
  pendente: "Pendente",
};

const statusStyle: Record<ProfileStatus, string> = {
  ativo: "text-champagne",
  suspenso: "text-destructive",
  pendente: "text-muted-foreground",
};

function AdminPerfis() {
  return (
    <RequireAdmin>
      <AdminShell active="Perfis">
        <PerfisContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function PerfisContent() {
  const { data: profiles, isLoading, isError } = useAdminProfiles();
  const setStatus = useSetProfileStatus();

  const changeStatus = (id: string, name: string, status: ProfileStatus) => {
    setStatus.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast(`Perfil ${statusLabel[status].toLowerCase()}`, { description: name }),
        onError: () => toast("Não foi possível atualizar o perfil", { description: name }),
      },
    );
  };

  return (
    <>
      <p className="text-eyebrow">Gestão</p>
      <h2 className="mt-3 font-display text-3xl text-ivory">Perfis</h2>

      {isLoading && <p className="mt-8 text-[13px] text-muted-foreground">Carregando perfis…</p>}
      {isError && (
        <p className="mt-8 text-[13px] text-destructive">Não foi possível carregar os perfis.</p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {profiles?.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-4 rounded-lg surface-glass p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[15px] text-ivory">
                {p.name}, {p.age}
                {p.verified && <span className="ml-2 text-[11px] text-champagne">Verificada</span>}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {p.email} · {p.city} · desde {p.joinedAt}
              </p>
              {p.reportsCount > 0 && (
                <p className="mt-1 text-[12px] text-destructive">{p.reportsCount} denúncia(s)</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span
                className={cn("text-[13px] uppercase tracking-[0.08em]", statusStyle[p.status])}
              >
                {statusLabel[p.status]}
              </span>
              {p.status === "suspenso" ? (
                <button
                  type="button"
                  disabled={setStatus.isPending}
                  onClick={() => changeStatus(p.id, p.name, "ativo")}
                  className="text-[13px] text-champagne underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40"
                >
                  Reativar
                </button>
              ) : (
                <button
                  type="button"
                  disabled={setStatus.isPending}
                  onClick={() => changeStatus(p.id, p.name, "suspenso")}
                  className="text-[13px] text-destructive underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40"
                >
                  Suspender
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
