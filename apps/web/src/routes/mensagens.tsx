import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, ScreenIntro, ScreenList, ListRow, IconArrow, IconArrowRight } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";
import { useMatches, useMatchMessages, useSendMessage } from "@/lib/connections-data";
import { useOwnProfileId } from "@/lib/member-auth";
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

function Mensagens() {
  return (
    <RequireMember>
      <MensagensContent />
    </RequireMember>
  );
}

function MensagensContent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const ownProfileId = useOwnProfileId();
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const selected = matches?.find((m) => m.matchId === search.with) ?? null;
  const { data: messages, isLoading: messagesLoading } = useMatchMessages(
    selected?.matchId ?? null,
  );
  const sendMessage = useSendMessage();
  const [draft, setDraft] = useState("");

  const openConversation = (matchId: string) => {
    void navigate({ search: { with: matchId } });
  };

  const closeConversation = () => {
    void navigate({ search: { with: undefined } });
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !selected) return;
    sendMessage.mutate(
      { matchId: selected.matchId, text },
      { onError: () => toast("Não foi possível enviar a mensagem") },
    );
    setDraft("");
  };

  if (search.with && selected) {
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
          {selected.photoUrl ? (
            <img
              src={selected.photoUrl}
              alt={selected.name}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-[13px] text-champagne">
              {selected.name.charAt(0)}
            </span>
          )}
          <p className="text-[15px] text-ivory">{selected.name}</p>
        </div>

        <div className="flex flex-col gap-3 px-4 py-6 lg:px-10">
          {messagesLoading && <p className="text-[13px] text-muted-foreground">Carregando…</p>}
          {messages?.length === 0 && (
            <p className="text-[13px] text-muted-foreground">
              Nenhuma mensagem ainda. Diga oi para {selected.name}.
            </p>
          )}
          {messages?.map((m) => {
            const isMe = m.senderProfileId === ownProfileId;
            return (
              <div key={m.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                <p
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                    isMe ? "bg-champagne/15 text-ivory" : "surface-glass text-pearl",
                  )}
                >
                  {m.text}
                </p>
                <span className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mx-4 mb-4 rounded-lg hairline-champagne p-4 text-[13px] leading-relaxed text-pearl/80 lg:mx-10">
          Nunca compartilhe documentos, dados bancários ou endereço residencial. A Velora nunca pede
          esses dados por mensagem.
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
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
            disabled={!draft.trim() || sendMessage.isPending}
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

      {matchesLoading && <p className="px-6 text-[13px] text-muted-foreground">Carregando…</p>}
      {!matchesLoading && matches?.length === 0 && (
        <p className="px-6 text-[13px] text-muted-foreground">
          Nenhuma conversa ainda. Suas conexões aparecem aqui.
        </p>
      )}

      <ScreenList>
        {matches?.map((match) => (
          <button
            key={match.matchId}
            type="button"
            onClick={() => openConversation(match.matchId)}
            className="text-left"
          >
            <ListRow
              photo={match.photoUrl ?? undefined}
              title={match.name}
              meta={`Conexão em ${new Date(match.matchedAt).toLocaleDateString("pt-BR")}`}
            />
          </button>
        ))}
      </ScreenList>
    </AppShell>
  );
}
