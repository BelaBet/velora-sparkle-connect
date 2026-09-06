import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/require-admin";
import {
  ProfileCard,
  ExperienceCard,
  VerifiedBadge,
  LivenessBadge,
  TrustBadge,
  PrivacyIndicator,
  MembershipBadge,
  GhostAction,
  IconHeart,
  IconSpark,
  IconLiveness,
  IconPrivacy,
  IconLocation,
  IconCheck,
  IconArrow,
  IconSave,
  IconPass,
} from "@velora/ui";
import juliana from "@/assets/profile-juliana.jpg";
import rafael from "@/assets/profile-rafael.jpg";
import lounge from "@/assets/experience-lounge.jpg";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Velora — Design System | Private Luxury Dating & Experiences" },
      {
        name: "description",
        content:
          "A linguagem visual da Velora: paleta obsidian e champagne, tipografia editorial, componentes de identidade, confiança e experiências privadas.",
      },
      { property: "og:title", content: "Velora — Private Luxury Dating & Experiences" },
      {
        property: "og:description",
        content:
          "Privacidade, confiança e exclusividade traduzidas em um sistema de design de alto luxo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DesignSystemRoute,
});

function DesignSystemRoute() {
  return (
    <RequireAdmin>
      <Index />
    </RequireAdmin>
  );
}

const swatches = [
  { name: "Obsidian", hex: "#090909", cls: "bg-obsidian" },
  { name: "Graphite", hex: "#121212", cls: "bg-graphite" },
  { name: "Charcoal", hex: "#1B1B1B", cls: "bg-charcoal" },
  { name: "Smoke", hex: "#272727", cls: "bg-smoke" },
  { name: "Ivory", hex: "#F4F0E8", cls: "bg-ivory" },
  { name: "Pearl", hex: "#E8E3DA", cls: "bg-pearl" },
  { name: "Champagne", hex: "#C8AD78", cls: "bg-champagne" },
  { name: "Champagne Soft", hex: "#A99163", cls: "bg-champagne-soft" },
];

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl text-ivory md:text-5xl">{title}</h2>
      <div className="mt-12">{children}</div>
    </section>
  );
}

function Index() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-32 md:px-10">
      <header className="flex items-center justify-between py-8">
        <span className="font-display text-xl tracking-[0.4em] text-ivory">VELORA</span>
        <MembershipBadge label="Design System" />
      </header>

      <div className="animate-rise py-16 md:py-24">
        <p className="text-eyebrow">Private Luxury Dating &amp; Experiences</p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-ivory md:text-7xl">
          Meet someone
          <br />
          extraordinary.
        </h1>
        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Privacidade, confiança e exclusividade — traduzidas em uma linguagem visual única antes
          da primeira tela ser construída.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <VerifiedBadge />
          <LivenessBadge />
          <TrustBadge />
          <PrivacyIndicator />
        </div>
      </div>

      <Section eyebrow="Foundation" title="Paleta">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border md:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="bg-graphite p-5">
              <div className={`h-20 w-full rounded-sm ${s.cls}`} />
              <p className="mt-4 text-[13px] text-pearl">{s.name}</p>
              <p className="text-[11px] tracking-[0.16em] text-muted-foreground">{s.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Foundation" title="Tipografia">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-eyebrow">Display · Cormorant Garamond</p>
            <p className="mt-6 font-display text-5xl text-ivory">Aa</p>
            <p className="mt-4 font-display text-2xl text-pearl/85">
              Uma noite que merece ser lembrada.
            </p>
          </div>
          <div>
            <p className="text-eyebrow">Interface · Inter</p>
            <p className="mt-6 text-5xl font-light text-ivory">Aa</p>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              Botões, menus, filtros, mensagens e dados. Precisão silenciosa, sem competir com a
              fotografia.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Cards" title="Profile Card">
        <div className="grid gap-8 sm:grid-cols-2">
          <ProfileCard
            photo={juliana}
            name="Juliana"
            age={29}
            city="São Paulo"
            distanceKm={3}
            interests={["Gastronomia", "Viagens", "Música", "Academia"]}
            quote="Adoro descobrir novos lugares e boas conversas."
            priority
          />
          <ProfileCard
            photo={rafael}
            name="Rafael"
            age={34}
            city="São Paulo"
            distanceKm={7}
            interests={["Arquitetura", "Vinhos", "Corrida"]}
            quote="Prefiro uma mesa tranquila a um lugar cheio."
          />
        </div>
      </Section>

      <Section eyebrow="Experiences" title="Experience Card">
        <div className="grid gap-8 md:grid-cols-2">
          <ExperienceCard
            image={lounge}
            title="Jantar reservado"
            venue="Salon Privé · Jardins"
            city="São Paulo"
            detail="Mesa reservada em salão privativo, menu degustação para dois e entrada discreta pelo lobby."
          />
          <div className="flex flex-col justify-center gap-8 rounded-xl surface-glass p-10">
            <p className="text-eyebrow">Hierarquia</p>
            <ol className="space-y-4 font-display text-2xl text-pearl/85">
              <li>1 · Imagem</li>
              <li>2 · Identidade</li>
              <li>3 · Informação</li>
              <li>4 · Ação</li>
            </ol>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              A imagem domina. A interface nunca compete com a fotografia — e nunca começa por
              botões empilhados.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Velora Icons" title="Ícones">
        <div className="flex flex-wrap gap-4">
          {[IconHeart, IconPass, IconCheck, IconSpark, IconLiveness, IconLocation, IconPrivacy, IconSave, IconArrow].map(
            (Icon, i) => (
              <div
                key={i}
                className="flex h-16 w-16 items-center justify-center rounded-lg surface-glass text-pearl transition-velora hover:text-champagne"
              >
                <Icon size={22} />
              </div>
            ),
          )}
        </div>
      </Section>

      <Section eyebrow="Motion" title="Microinterações">
        <div className="flex flex-wrap items-center gap-10 rounded-xl surface-glass p-10">
          <div className="space-y-4">
            <p className="text-[13px] text-muted-foreground">
              Interesse · scale 1 → 1.12 → glow → 1 · 240ms
            </p>
            <div className="flex items-center gap-4">
              <GhostAction>Toque no coração do perfil</GhostAction>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Princípio" title="A regra de ouro">
        <div className="grid gap-6 font-display text-2xl text-pearl/85 md:grid-cols-2">
          <p>Se parece barato, removemos.</p>
          <p>Se parece complicado, simplificamos.</p>
          <p>Se parece comum, refinamos.</p>
          <p>Se parece inseguro, não lançamos.</p>
        </div>
      </Section>
    </main>
  );
}
