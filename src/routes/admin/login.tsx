import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VeloraMark } from "@/components/velora/icons-nav";
import { signInAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Velora Admin — Entrar" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const message = await signInAdmin(email, password);
    setLoading(false);
    if (message) {
      setError(message);
    } else {
      void navigate({ to: "/admin" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={30} className="text-champagne" />
          <p className="font-display text-2xl tracking-[0.3em] text-champagne">VELORA</p>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Painel administrativo
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-10 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
            E-mail
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velora.com"
              className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
            Senha
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
            />
          </label>

          {error && <p className="text-[13px] text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full border border-champagne py-2.5 text-[13px] uppercase tracking-[0.14em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
