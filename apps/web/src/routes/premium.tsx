import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, ScreenIntro, MembershipBadge, GhostAction, IconCheck } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Velora Black — Assinatura" },
      {
        name: "description",
        content:
          "Velora Black: curadoria dedicada, concierge de experiências e privacidade ampliada.",
      },
      { property: "og:title", content: "Velora Black" },
      {
        property: "og:description",
        content: "Curadoria dedicada, concierge e privacidade ampliada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Premium,
});

const beneficios = [
  "Curadoria dedicada de perfis",
  "Concierge de experiências",
  "Modo discreto avançado",
  "Prioridade em reservas parceiras",
];

function Premium() {
  const [requested, setRequested] = useState(false);

  return (
    <RequireMember>
      <AppShell activeTab="Descobrir" activeBottom="Premium">
        <ScreenIntro
          eyebrow="Assinatura"
          title="Velora Black"
          description="Para quem quer menos volume e mais precisão. Um círculo menor, escolhido com cuidado."
        />
        <div className="px-4 py-8">
          <div className="rounded-xl surface-card p-7">
            <MembershipBadge />
            <p className="mt-6 font-display text-4xl text-ivory">
              R$ 390<span className="text-base text-muted-foreground"> /mês</span>
            </p>
            <ul className="mt-7 space-y-4">
              {beneficios.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] text-pearl/85">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-champagne" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <GhostAction
                onClick={() => {
                  if (requested) return;
                  setRequested(true);
                  toast("Pedido de convite enviado", {
                    description: "Nossa equipe entrará em contato em até 48 horas.",
                  });
                }}
              >
                {requested ? "Convite solicitado" : "Solicitar convite"}
              </GhostAction>
            </div>
          </div>
        </div>
      </AppShell>
    </RequireMember>
  );
}
