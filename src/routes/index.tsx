import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/velora/app-shell";
import { DiscoverCard } from "@/components/velora/discover-card";
import { DiscoverActions } from "@/components/velora/discover-actions";
import juliana from "@/assets/discover-juliana.jpg";

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
  return (
    <AppShell activeTab="Descobrir" activeBottom="Descobrir">
      <div className="px-4 pt-4 lg:mx-auto lg:max-w-[440px] lg:px-0 lg:pt-10">
        <DiscoverCard
          profile={{
            photo: juliana,
            name: "Juliana",
            age: 29,
            distanceKm: 3,
            interests: ["Gastronomia", "Viagens", "Música", "Academia"],
            bio: "Apaixonada por bons vinhos, viagens e conversas profundas.",
            photoCount: 5,
          }}
        />
      </div>
      <DiscoverActions />
    </AppShell>
  );
}
