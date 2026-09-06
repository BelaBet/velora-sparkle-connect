import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenIntro, ScreenList, ListRow, MembershipBadge } from "@velora/ui";
import { connections } from "@/lib/velora-data";

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
    <AppShell activeTab="Conexões" activeBottom="Conexões">
      <ScreenIntro
        eyebrow="Interesse recíproco"
        title="Suas conexões"
        description="Só aparecem aqui as pessoas que demonstraram interesse mútuo. Nada é público."
      />
      <ScreenList>
        {connections.map((connection) => (
          <ListRow
            key={connection.id}
            to="/mensagens"
            search={{ with: connection.id }}
            photo={connection.photo}
            title={`${connection.name}, ${connection.age}`}
            meta={connection.meta}
            trailing={connection.isNew ? <MembershipBadge label="Nova" /> : undefined}
          />
        ))}
      </ScreenList>
    </AppShell>
  );
}
