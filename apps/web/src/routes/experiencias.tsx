import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, ScreenIntro, ExperienceCard, GhostAction } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";
import {
  useExperiences,
  useMyBookedExperienceIds,
  useRequestBooking,
} from "@/lib/experiences-data";
import lounge from "@/assets/experience-lounge.jpg";

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
    <RequireMember>
      <ExperienciasContent />
    </RequireMember>
  );
}

function ExperienciasContent() {
  const { data: experiences, isLoading, isError, refetch } = useExperiences();
  const { data: bookedIds } = useMyBookedExperienceIds();
  const requestBooking = useRequestBooking();

  return (
    <AppShell activeTab="Experiências" activeBottom="Descobrir">
      <ScreenIntro
        eyebrow="Curadoria"
        title="Experiências"
        description="Lugares escolhidos um a um. Reserva feita pelo concierge, com entrada discreta."
      />

      {isLoading && <p className="px-6 text-[13px] text-muted-foreground">Carregando…</p>}
      {isError && (
        <div className="flex flex-col items-start gap-3 px-6">
          <p className="text-[13px] text-destructive">Não foi possível carregar as experiências.</p>
          <GhostAction onClick={() => void refetch()}>Tentar de novo</GhostAction>
        </div>
      )}

      <div className="flex flex-col gap-5 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-10">
        {experiences?.map((exp) => (
          <ExperienceCard
            key={exp.id}
            image={lounge}
            title={exp.title}
            venue={exp.venue}
            city={exp.city}
            detail={exp.detail}
            reserved={bookedIds?.has(exp.id) ?? false}
            onReserve={() =>
              requestBooking.mutate(exp.id, {
                onSuccess: () =>
                  toast("Reserva solicitada", {
                    description:
                      "O concierge Velora entrará em contato para confirmar os detalhes.",
                  }),
                onError: () => toast("Não foi possível solicitar a reserva"),
              })
            }
          />
        ))}
      </div>
    </AppShell>
  );
}
