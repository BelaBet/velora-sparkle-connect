import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/velora/app-shell";
import { DiscoverCard } from "@/components/velora/discover-card";
import { DiscoverActions } from "@/components/velora/discover-actions";
import { GhostAction } from "@/components/velora/interaction";
import { discoverProfiles } from "@/lib/velora-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velora — Descobrir | Private Luxury Dating & Experiences" },
      {
        name: "description",
        content:
          "Descubra pessoas verificadas em um ambiente privado e sofisticado. Identidade verificada, discrição e experiências selecionadas.",
      },
      { property: "og:title", content: "Velora — Descobrir" },
      {
        property: "og:description",
        content: "Pessoas verificadas, discrição e experiências selecionadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Descobrir,
});

function Descobrir() {
  const [index, setIndex] = useState(0);
  const profile = discoverProfiles[index];
  const done = index >= discoverProfiles.length;

  const advance = () => setIndex((i) => i + 1);

  return (
    <AppShell activeTab="Descobrir" activeBottom="Descobrir">
      <div className="px-4 pt-4 lg:mx-auto lg:max-w-[440px] lg:px-0 lg:pt-10">
        {profile ? (
          <DiscoverCard
            profile={profile}
            onAbout={() => toast(`${profile.name}, ${profile.age}`, { description: profile.about })}
          />
        ) : (
          <div className="flex aspect-[9/15.2] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-graphite px-8 text-center">
            <p className="font-display text-2xl text-ivory">Você viu todos por agora</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Novos perfis verificados aparecem ao longo do dia. Volte mais tarde ou reveja o
              círculo atual.
            </p>
            <GhostAction onClick={() => setIndex(0)}>Recomeçar</GhostAction>
          </div>
        )}
      </div>
      <DiscoverActions
        disabled={done}
        onPass={() => {
          if (done) return;
          advance();
        }}
        onInterest={() => {
          if (done) return;
          toast("Interesse enviado", {
            description: `${profile!.name} será avisada se o interesse for recíproco.`,
          });
          advance();
        }}
        onNext={() => {
          if (done) return;
          advance();
        }}
      />
    </AppShell>
  );
}
