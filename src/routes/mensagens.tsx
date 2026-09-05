import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/velora/app-shell";
import { ScreenIntro, ScreenList, ListRow } from "@/components/velora/screen";
import juliana from "@/assets/discover-juliana.jpg";
import rafael from "@/assets/profile-rafael.jpg";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Velora — Mensagens" },
      {
        name: "description",
        content: "Conversas privadas entre conexões verificadas, com avisos de segurança discretos.",
      },
      { property: "og:title", content: "Velora — Mensagens" },
      { property: "og:description", content: "Conversas privadas entre conexões verificadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mensagens,
});

function Mensagens() {
  return (
    <AppShell activeTab="Mensagens" activeBottom="Conexões">
      <ScreenIntro
        eyebrow="Privado"
        title="Mensagens"
        description="Conversas visíveis apenas para vocês dois. Você pode encerrar ou bloquear a qualquer momento."
      />
      <ScreenList>
        <ListRow
          photo={juliana}
          title="Juliana"
          meta="“Conheço um lugar perfeito para isso.”"
          trailing={<span className="h-2 w-2 rounded-full bg-champagne" />}
        />
        <ListRow photo={rafael} title="Rafael" meta="“Combinado para quinta, então.”" />
      </ScreenList>
      <div className="mx-4 mb-8 rounded-lg hairline-champagne p-4 text-[13px] leading-relaxed text-pearl/80">
        Nunca compartilhe documentos, dados bancários ou endereço residencial. A Velora nunca pede
        esses dados por mensagem.
      </div>
    </AppShell>
  );
}
