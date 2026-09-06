import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { VeloraMark } from "./icons-nav";
import { signOutAdmin } from "@/lib/admin-auth";

const navItems = [
  { label: "Painel", to: "/admin" },
  { label: "Perfis", to: "/admin/perfis" },
  { label: "Verificações", to: "/admin/verificacoes" },
  { label: "Relatórios", to: "/admin/relatorios" },
];

/** Moldura do painel administrativo — sidebar no desktop, tabs no mobile. */
export function AdminShell({ active, children }: { active: string; children: ReactNode }) {
  const navigate = useNavigate();

  const signOut = () => {
    void signOutAdmin().then(() => navigate({ to: "/admin/login" }));
  };

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="hidden shrink-0 border-r border-border px-6 py-10 lg:flex lg:w-[260px] lg:flex-col">
          <div className="flex items-center gap-3">
            <VeloraMark size={24} className="text-champagne" />
            <div>
              <p className="font-display text-[1.1rem] leading-none tracking-[0.28em] text-champagne">
                VELORA
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Admin
              </p>
            </div>
          </div>

          <nav className="mt-12 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2.5 text-[15px] transition-velora",
                  item.label === active
                    ? "bg-champagne/10 text-champagne"
                    : "text-muted-foreground hover:bg-white/[0.03] hover:text-pearl",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={signOut}
            className="mt-auto text-left text-[13px] text-muted-foreground transition-velora hover:text-champagne"
          >
            Sair
          </button>
        </aside>

        <div className="flex min-h-screen w-full min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-border px-6 py-5 lg:px-10">
            <div className="flex items-center gap-2 lg:hidden">
              <VeloraMark size={20} className="text-champagne" />
              <span className="text-[12px] uppercase tracking-[0.24em] text-champagne">
                Velora Admin
              </span>
            </div>
            <h1 className="hidden font-display text-[1.6rem] text-ivory lg:block">{active}</h1>
            <button
              type="button"
              onClick={signOut}
              className="text-[13px] text-muted-foreground transition-velora hover:text-champagne lg:hidden"
            >
              Sair
            </button>
          </header>

          <nav className="flex gap-6 overflow-x-auto border-b border-border px-6 py-3 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 text-[13px] transition-velora",
                  item.label === active ? "text-champagne" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
