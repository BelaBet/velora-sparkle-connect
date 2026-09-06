import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RequireAdmin } from "@/components/velora/require-admin";
import { AdminShell } from "@/components/velora/admin-shell";
import {
  useSecurityReports,
  useAdvanceReportStatus,
  type ReportSeverity,
  type ReportStatus,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/relatorios")({
  head: () => ({
    meta: [
      { title: "Velora Admin — Relatórios de segurança" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRelatorios,
});

const severityStyle: Record<ReportSeverity, string> = {
  alta: "text-destructive",
  média: "text-champagne",
  baixa: "text-muted-foreground",
};

const statusOrder: ReportStatus[] = ["aberto", "em análise", "resolvido"];

function nextStatus(status: ReportStatus): ReportStatus {
  const idx = statusOrder.indexOf(status);
  return statusOrder[Math.min(idx + 1, statusOrder.length - 1)] ?? status;
}

function AdminRelatorios() {
  return (
    <RequireAdmin>
      <AdminShell active="Relatórios">
        <RelatoriosContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function RelatoriosContent() {
  const { data: reports, isLoading, isError } = useSecurityReports();
  const advanceStatus = useAdvanceReportStatus();

  const advance = (id: string, reportedName: string, current: ReportStatus) => {
    if (current === "resolvido") return;
    const status = nextStatus(current);
    advanceStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast(`Denúncia marcada como "${status}"`, { description: reportedName }),
        onError: () =>
          toast("Não foi possível atualizar a denúncia", { description: reportedName }),
      },
    );
  };

  return (
    <>
      <p className="text-eyebrow">Confiança</p>
      <h2 className="mt-3 font-display text-3xl text-ivory">Relatórios de segurança</h2>

      {isLoading && <p className="mt-8 text-[13px] text-muted-foreground">Carregando denúncias…</p>}
      {isError && (
        <p className="mt-8 text-[13px] text-destructive">Não foi possível carregar as denúncias.</p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {reports?.map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-lg surface-glass p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] text-ivory">
                  {r.reason}{" "}
                  <span className="text-muted-foreground">· contra {r.reportedName}</span>
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Denunciado por {r.reporterName} · {r.submittedAt}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-[11px] uppercase tracking-[0.1em]",
                  severityStyle[r.severity],
                )}
              >
                {r.severity}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-pearl/80">{r.details}</p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] capitalize text-champagne">{r.status}</span>
              {r.status !== "resolvido" && (
                <button
                  type="button"
                  disabled={advanceStatus.isPending}
                  onClick={() => advance(r.id, r.reportedName, r.status)}
                  className="rounded-full border border-champagne px-4 py-1.5 text-[13px] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
                >
                  {r.status === "aberto" ? "Marcar em análise" : "Marcar resolvido"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
