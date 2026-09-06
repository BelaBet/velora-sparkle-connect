import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/require-admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminProfiles, useVerificationRequests, useSecurityReports } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Velora Admin — Painel" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <RequireAdmin>
      <AdminShell active="Painel">
        <DashboardContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function DashboardContent() {
  const profiles = useAdminProfiles();
  const verifications = useVerificationRequests();
  const reports = useSecurityReports();

  const loading = profiles.isLoading || verifications.isLoading || reports.isLoading;

  const tiles = [
    {
      label: "Perfis ativos",
      value: profiles.data?.filter((p) => p.status === "ativo").length ?? 0,
    },
    { label: "Perfis cadastrados", value: profiles.data?.length ?? 0 },
    {
      label: "Verificações pendentes",
      value: verifications.data?.filter((v) => v.status === "pendente").length ?? 0,
    },
    {
      label: "Denúncias em aberto",
      value: reports.data?.filter((r) => r.status !== "resolvido").length ?? 0,
    },
  ];

  return (
    <>
      <p className="text-eyebrow">Visão geral</p>
      <h2 className="mt-3 font-display text-3xl text-ivory">Bem-vinda de volta</h2>

      {loading ? (
        <p className="mt-8 text-[13px] text-muted-foreground">Carregando dados…</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl surface-card p-6">
              <p className="font-display text-3xl text-champagne">{t.value}</p>
              <p className="mt-2 text-[13px] text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
