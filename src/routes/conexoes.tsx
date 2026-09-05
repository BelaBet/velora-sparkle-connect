import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/velora/app-shell";
import { ScreenIntro, ScreenList, ListRow } from "@/components/velora/screen";
import { MembershipBadge } from "@/components/velora/badges";
import juliana from "@/assets/discover-juliana.jpg";
import rafael from "@/assets/profile-rafael.jpg";
import ana from "@/assets/profile-juliana.jpg";

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
        <ListRow
          photo={juliana}
          title="Juliana, 29"
          meta="Conexão hoje · São Paulo"
          trailing={<MembershipBadge label="Nova" />}
        />
        <ListRow photo={rafael} title="Rafael, 34" meta="Conexão ontem · Jardins" />
        <ListRow photo={ana} title="Marina, 31" meta="Conexão há 3 dias · Itaim" />
      </ScreenList>
    </AppShell>
  );
}
