import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, ScreenIntro, ScreenList, ListRow, IconArrow, IconArrowRight } from "@velora/ui";
import { initialConversations, type Conversation } from "@/lib/velora-data";
import { cn } from "@/lib/utils";

type MensagensSearch = { with?: string | undefined };

export const Route = createFileRoute("/mensagens")({
  validateSearch: (search: Record<string, unknown>): MensagensSearch => ({
    with: typeof search.with === "string" ? search.with : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Velora — Mensagens" },
      {
        name: "description",
        content:
          "Conversas privadas entre conexões verificadas, com avisos de segurança discretos.",
      },
      { property: "og:title", content: "Velora — Mensagens" },
      { property: "og:description", content: "Conversas privadas entre conexões verificadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mensagens,
});

function lastMessagePreview(conversation: Conversation) {
  const last = conversation.messages[conversation.messages.length - 1];
  return last ? `"${last.text}"` : "Nenhuma mensagem ainda.";
}

function Mensagens() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [conversations, setConversations] = useState(initialConversations);
  const [draft, setDraft] = useState("");

  const selected = conversations.find((c) => c.id === search.with) ?? null;

  const openConversation = (id: string) => {
    void navigate({ search: { with: id } });
  };

  const closeConversation = () => {
    void navigate({ search: { with: undefined } });
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !selected) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, { id: `${Date.now()}`, from: "me", text, time }] }
          : c,
      ),
    );
    setDraft("");
  };

  if (selected) {
    return (
      <AppShell activeTab="Mensagens" activeBottom="Conexões">
        <div className="flex items-center gap-3 border-b border-border px-4 py-4 lg:px-10">
          <button
            type="button"
            aria-label="Voltar"
            onClick={closeConversation}
            className="text-pearl/85 transition-velora hover:text-champagne"
          >
            <IconArrowRight size={18} className="rotate-180" />
          </button>
          <img
            src={selected.photo}
            alt={selected.name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <p className="text-[15px] text-ivory">{selected.name}</p>
        </div>

        <div className="flex flex-col gap-3 px-4 py-6 lg:px-10">
          {selected.messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex flex-col", m.from === "me" ? "items-end" : "items-start")}
            >
              <p
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                  m.from === "me" ? "bg-champagne/15 text-ivory" : "surface-glass text-pearl",
                )}
              >
                {m.text}
              </p>
              <span className="mt-1 text-[11px] text-muted-foreground">{m.time}</span>
            </div>
          ))}
        </div>

        <div className="mx-4 mb-4 rounded-lg hairline-champagne p-4 text-[13px] leading-relaxed text-pearl/80 lg:mx-10">
          Nunca compartilhe documentos, dados bancários ou endereço residencial. A Velora nunca pede
          esses dados por mensagem.
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mt-auto flex items-center gap-3 border-t border-border px-4 py-4 lg:px-10"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escreva uma mensagem"
            className="min-w-0 flex-1 rounded-full surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Enviar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-30"
          >
            <IconArrow size={16} />
          </button>
        </form>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="Mensagens" activeBottom="Conexões">
      <ScreenIntro
        eyebrow="Privado"
        title="Mensagens"
        description="Conversas visíveis apenas para vocês dois. Você pode encerrar ou bloquear a qualquer momento."
      />
      <ScreenList>
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => openConversation(c.id)}
            className="text-left"
          >
            <ListRow photo={c.photo} title={c.name} meta={lastMessagePreview(c)} />
          </button>
        ))}
      </ScreenList>
    </AppShell>
  );
}
