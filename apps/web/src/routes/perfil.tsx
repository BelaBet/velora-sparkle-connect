import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, VerifiedBadge, LivenessBadge, MembershipBadge, IconArrow } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";
import { signOutMember } from "@/lib/member-auth";
import juliana from "@/assets/discover-juliana.jpg";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Velora — Meu perfil" },
      {
        name: "description",
        content: "Gerencie fotos, verificações, preferências e privacidade do seu perfil Velora.",
      },
      { property: "og:title", content: "Velora — Meu perfil" },
      { property: "og:description", content: "Fotos, verificações, preferências e privacidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

const itens = [
  { label: "Bio e interesses", to: "/perfil/editar" },
  { label: "Verificação de identidade", to: "/verificacao" },
  { label: "Preferências de descoberta", to: "/" },
  { label: "Privacidade e discrição", to: "/seguranca" },
  { label: "Linguagem visual Velora", to: "/design-system" },
];

function Perfil() {
  return (
    <RequireMember>
      <PerfilContent />
    </RequireMember>
  );
}

function PerfilContent() {
  const navigate = useNavigate();

  return (
    <AppShell activeTab="Descobrir" activeBottom="Perfil">
      <div className="relative aspect-[9/9] w-full overflow-hidden">
        <img
          src={juliana}
          alt="Sua foto principal"
          width={900}
          height={1300}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 scrim-bottom" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
          <MembershipBadge />
          <h1 className="font-display text-4xl text-ivory">Juliana, 29</h1>
          <div className="flex flex-wrap gap-2">
            <VerifiedBadge />
            <LivenessBadge />
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-px px-4 py-8">
        {itens.map((i) => (
          <li key={i.label}>
            <Link
              to={i.to}
              className="flex items-center justify-between border-b border-border py-4 text-[15px] text-pearl transition-velora hover:text-champagne"
            >
              {i.label}
              <IconArrow size={16} className="text-champagne/70" />
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => {
              void signOutMember().then(() => navigate({ to: "/login" }));
            }}
            className="flex w-full items-center justify-between border-b border-border py-4 text-left text-[15px] text-destructive transition-velora hover:text-destructive/80"
          >
            Sair
          </button>
        </li>
      </ul>
    </AppShell>
  );
}
