import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/velora/app-shell";
import { ScreenIntro } from "@/components/velora/screen";
import { ExperienceCard } from "@/components/velora/experience-card";
import { experiences } from "@/lib/velora-data";

export const Route = createFileRoute("/experiencias")({
  head: () => ({
    meta: [
      { title: "Velora — Experiências" },
      {
        name: "description",
        content:
          "Jantares reservados, lounges privados e experiências selecionadas para encontros Velora.",
      },
      { property: "og:title", content: "Velora — Experiências" },
      {
        property: "og:description",
        content: "Jantares reservados e lounges privados selecionados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experiencias,
});

function Experiencias() {
  return (
    <AppShell activeTab="Experiências" activeBottom="Descobrir">
      <ScreenIntro
        eyebrow="Curadoria"
        title="Experiências"
        description="Lugares escolhidos um a um. Reserva feita pelo concierge, com entrada discreta."
      />
      <div className="flex flex-col gap-5 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-10">
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            image={exp.image}
            title={exp.title}
            venue={exp.venue}
            city={exp.city}
            detail={exp.detail}
          />
        ))}
      </div>
    </AppShell>
  );
}
