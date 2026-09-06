import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/velora/app-shell";
import { ScreenIntro } from "@/components/velora/screen";
import {
  VerifiedBadge,
  LivenessBadge,
  TrustBadge,
  PrivacyIndicator,
} from "@/components/velora/badges";
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
  {
    id: "check-in",
    title: "Check-in de encontro",
    meta: "Avise alguém de confiança sobre local e horário.",
    confirmTwice: false,
    onConfirm: () =>
      toast("Check-in agendado", {
        description: "Seu contato de confiança receberá local e horário do encontro.",
      }),
  },
  {
    id: "emergencia",
    title: "Contato de emergência",
    meta: "Um toque envia sua localização ao contato escolhido.",
    confirmTwice: true,
    onConfirm: () =>
      toast("Localização enviada", {
        description: "Seu contato de emergência foi avisado com sua localização atual.",
      }),
  },
  {
    id: "bloquear",
    title: "Bloquear perfil",
    meta: "O bloqueio é imediato, silencioso e definitivo.",
    confirmTwice: false,
    onConfirm: () =>
      toast("Perfil bloqueado", {
        description: "Essa pessoa não poderá mais ver ou contatar você.",
      }),
  },
  {
    id: "denunciar",
    title: "Denunciar comportamento",
    meta: "Análise humana em até 24 horas.",
    confirmTwice: false,
    onConfirm: () =>
      toast("Denúncia enviada", {
        description: "Nossa equipe de confiança fará a análise em até 24h.",
      }),
  },
];

function Seguranca() {
  const [armed, setArmed] = useState<string | null>(null);

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
        {acoes.map((a) => {
          const needsConfirm = a.confirmTwice && armed !== a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                if (needsConfirm) {
                  setArmed(a.id);
                  toast("Toque novamente para confirmar", { description: a.title });
                  return;
                }
                setArmed(null);
                a.onConfirm();
              }}
              className="flex items-start gap-4 rounded-lg surface-glass p-5 text-left transition-velora hover:border-champagne/35"
            >
              <IconShield size={20} className="mt-0.5 shrink-0 text-champagne" />
              <span>
                <span className="block text-[15px] text-ivory">{a.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                  {armed === a.id ? "Toque novamente para confirmar." : a.meta}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
