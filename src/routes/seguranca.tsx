import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/velora/app-shell";
import { ScreenIntro } from "@/components/velora/screen";
import { VerifiedBadge, LivenessBadge, TrustBadge, PrivacyIndicator } from "@/components/velora/badges";
import { IconShield } from "@/components/velora/icons-nav";

export const Route = createFileRoute("/seguranca")({
  head: () => ({
    meta: [
      { title: "Velora — Central de Segurança" },
      {
        name: "description",
        content:
          "Check-in de encontro, botão de emergência, bloqueio e denúncia. Segurança desde o primeiro passo.",
      },
      { property: "og:title", content: "Velora — Central de Segurança" },
      { property: "og:description", content: "Check-in, emergência, bloqueio e denúncia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Seguranca,
});

const acoes = [
  { title: "Check-in de encontro", meta: "Avise alguém de confiança sobre local e horário." },
  { title: "Contato de emergência", meta: "Um toque envia sua localização ao contato escolhido." },
  { title: "Bloquear perfil", meta: "O bloqueio é imediato, silencioso e definitivo." },
  { title: "Denunciar comportamento", meta: "Análise humana em até 24 horas." },
];

function Seguranca() {
  return (
    <AppShell activeTab="Descobrir" activeBottom="Segurança">
      <ScreenIntro
        eyebrow="Confiança"
        title="Central de segurança"
        description="Verificação de identidade, presença ao vivo e reputação — antes de qualquer encontro."
      />
      <div className="flex flex-wrap gap-2 px-6 pt-6">
        <VerifiedBadge />
        <LivenessBadge />
        <TrustBadge />
        <PrivacyIndicator />
      </div>
      <div className="flex flex-col gap-3 px-4 py-8">
        {acoes.map((a) => (
          <button
            key={a.title}
            type="button"
            className="flex items-start gap-4 rounded-lg surface-glass p-5 text-left transition-velora hover:border-champagne/35"
          >
            <IconShield size={20} className="mt-0.5 shrink-0 text-champagne" />
            <span>
              <span className="block text-[15px] text-ivory">{a.title}</span>
              <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                {a.meta}
              </span>
            </span>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
