import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  IconMenu,
  IconBell,
  IconCompass,
  IconConnections,
  IconCrown,
  IconShield,
  IconUser,
  IconMessages,
  VeloraMark,
} from "./icons-nav";

/** TopBar — marca centralizada, ações discretas nas laterais (mobile). */
export function TopBar({ hasNotification = true }: { hasNotification?: boolean }) {
  return (
    <header className="flex items-center justify-between px-6 pt-4 pb-3">
      <button type="button" aria-label="Menu" className="text-pearl/85 transition-velora hover:text-champagne">
        <IconMenu size={24} />
      </button>

      <div className="flex flex-col items-center gap-1">
        <VeloraMark size={24} className="text-champagne" />
        <span className="font-display text-[1.35rem] leading-none tracking-[0.34em] text-champagne">
          VELORA
        </span>
      </div>

      <button
        type="button"
        aria-label="Notificações"
        className="relative text-pearl/85 transition-velora hover:text-champagne"
      >
        <IconBell size={24} />
        {hasNotification && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-champagne" />
        )}
      </button>
    </header>
  );
}

export type TabItem = { label: string; to: string };

/** TabBar — seções principais, sublinhado champagne na ativa. */
export function TabBar({ items, active }: { items: TabItem[]; active: string }) {
  return (
    <nav className="border-b border-border">
      <ul className="flex items-center gap-7 overflow-x-auto px-6">
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <li key={item.label} className="shrink-0">
              <Link
                to={item.to}
                className={cn(
                  "block border-b-2 pb-3 pt-2 text-[15px] transition-velora",
                  isActive
                    ? "border-champagne text-champagne"
                    : "border-transparent text-muted-foreground hover:text-pearl",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const bottomItems = [
  { label: "Descobrir", to: "/", Icon: IconCompass },
  { label: "Conexões", to: "/conexoes", Icon: IconConnections },
  { label: "Premium", to: "/premium", Icon: IconCrown },
  { label: "Segurança", to: "/seguranca", Icon: IconShield },
  { label: "Perfil", to: "/perfil", Icon: IconUser },
];

const sideItems = [
  { label: "Descobrir", to: "/", Icon: IconCompass },
  { label: "Conexões", to: "/conexoes", Icon: IconConnections },
  { label: "Mensagens", to: "/mensagens", Icon: IconMessages },
  { label: "Experiências", to: "/experiencias", Icon: IconCrown },
  { label: "Premium", to: "/premium", Icon: IconCrown },
  { label: "Segurança", to: "/seguranca", Icon: IconShield },
  { label: "Perfil", to: "/perfil", Icon: IconUser },
];

/** BottomNavigation — cinco destinos, ícone Velora + rótulo curto (mobile). */
export function BottomNavigation({ active }: { active: string }) {
  return (
    <nav className="border-t border-border bg-graphite/80 backdrop-blur-xl lg:hidden">
      <ul className="flex items-stretch justify-between px-3 pb-6 pt-3">
        {bottomItems.map(({ label, to, Icon }) => {
          const isActive = label === active;
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-velora",
                  isActive ? "text-champagne" : "text-muted-foreground hover:text-pearl",
                )}
              >
                {isActive ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-obsidian">
                    <Icon size={18} />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center">
                    <Icon size={21} />
                  </span>
                )}
                <span className="text-[11px] tracking-[0.02em]">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** SideNavigation — navegação vertical persistente em telas grandes. */
export function SideNavigation({ active }: { active: string }) {
  return (
    <aside className="hidden shrink-0 border-r border-border px-6 py-10 lg:flex lg:w-[260px] lg:flex-col xl:w-[280px]">
      <Link to="/" className="flex items-center gap-3">
        <VeloraMark size={26} className="text-champagne" />
        <span className="font-display text-[1.25rem] leading-none tracking-[0.32em] text-champagne">
          VELORA
        </span>
      </Link>

      <nav className="mt-12">
        <ul className="flex flex-col gap-1">
          {sideItems.map(({ label, to, Icon }) => {
            const isActive = label === active;
            return (
              <li key={label}>
                <Link
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] transition-velora",
                    isActive
                      ? "bg-champagne/10 text-champagne"
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-pearl",
                  )}
                >
                  <Icon size={19} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-10">
        <p className="text-eyebrow">Discrição</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          Seu perfil só é visto por membros verificados do círculo.
        </p>
      </div>
    </aside>
  );
}

const tabs: TabItem[] = [
  { label: "Descobrir", to: "/" },
  { label: "Conexões", to: "/conexoes" },
  { label: "Mensagens", to: "/mensagens" },
  { label: "Experiências", to: "/experiencias" },
];

/**
 * AppShell — moldura Velora responsiva.
 * Mobile: TopBar + TabBar + BottomNavigation.
 * Desktop: navegação lateral persistente + área de conteúdo ampla.
 */
export function AppShell({
  children,
  activeTab,
  activeBottom,
  aside,
}: {
  children: ReactNode;
  activeTab: string;
  activeBottom: string;
  aside?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <SideNavigation active={activeTab} />

        <div className="flex min-h-screen w-full min-w-0 flex-col bg-obsidian shadow-[0_0_80px_-20px_rgba(0,0,0,0.9)] max-lg:mx-auto max-lg:max-w-[430px]">
          <div className="lg:hidden">
            <TopBar />
            <TabBar items={tabs} active={activeTab} />
          </div>

          <header className="hidden items-center justify-between border-b border-border px-10 py-6 lg:flex">
            <h2 className="font-display text-[1.75rem] leading-none text-ivory">{activeTab}</h2>
            <button
              type="button"
              aria-label="Notificações"
              className="relative text-pearl/85 transition-velora hover:text-champagne"
            >
              <IconBell size={22} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-champagne" />
            </button>
          </header>

          <div className="flex flex-1 min-w-0">
            <main className="min-w-0 flex-1">{children}</main>
            {aside ? (
              <div className="hidden w-[320px] shrink-0 border-l border-border px-8 py-10 xl:block">
                {aside}
              </div>
            ) : null}
          </div>

          <BottomNavigation active={activeBottom} />
        </div>
      </div>
    </div>
  );
}
