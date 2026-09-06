import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenIntro, ScreenList, ListRow } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";
import { useMatches } from "@/lib/connections-data";

export const Route = createFileRoute("/conexoes")({
  head: () => ({
    meta: [
      { title: "Velora — Conexões" },
      {
        name: "description",
        content: "Interesses recíprocos e conexões discretas dentro do círculo Velora.",
      },
      { property: "og:title", content: "Velora — Conexões" },
      { property: "og:description", content: "Interesses recíprocos e conexões discretas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Conexoes,
});

function Conexoes() {
  return (
    <RequireMember>
      <ConexoesContent />
    </RequireMember>
  );
}

function ConexoesContent() {
  const { data: matches, isLoading, isError } = useMatches();

  return (
    <AppShell activeTab="Conexões" activeBottom="Conexões">
      <ScreenIntro
        eyebrow="Interesse recíproco"
        title="Suas conexões"
        description="Só aparecem aqui as pessoas que demonstraram interesse mútuo. Nada é público."
      />

      {isLoading && <p className="px-6 text-[13px] text-muted-foreground">Carregando conexões…</p>}
      {isError && (
        <p className="px-6 text-[13px] text-destructive">
          Não foi possível carregar suas conexões.
        </p>
      )}
      {!isLoading && !isError && matches?.length === 0 && (
        <p className="px-6 text-[13px] text-muted-foreground">
          Nenhuma conexão ainda. Demonstre interesse no Descobrir para começar.
        </p>
      )}

      <ScreenList>
        {matches?.map((match) => (
          <ListRow
            key={match.matchId}
            to="/mensagens"
            search={{ with: match.matchId }}
            photo={match.photoUrl ?? undefined}
            title={`${match.name}, ${match.age}`}
            meta={`Conexão em ${new Date(match.matchedAt).toLocaleDateString("pt-BR")} · ${match.city}`}
          />
        ))}
      </ScreenList>
    </AppShell>
  );
}
