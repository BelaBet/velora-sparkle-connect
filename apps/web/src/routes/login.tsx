import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";
import { signInMember } from "@/lib/member-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Velora — Entrar" },
      {
        name: "description",
        content: "Entre na Velora com verificação em duas etapas.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const message = await signInMember(email, password);
    setLoading(false);
    if (message) {
      setError("E-mail ou senha inválidos.");
    } else {
      void navigate({ to: "/" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={30} className="text-champagne" />
          <p className="font-display text-2xl tracking-[0.3em] text-champagne">VELORA</p>
        </div>

        <p className="mt-8 text-center text-[13px] leading-relaxed text-muted-foreground">
          Por segurança, o acesso exige senha e um segundo fator de verificação — para impedir que
          qualquer pessoa não autorizada entre na sua conta.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
            E-mail
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
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

        <p className="mt-8 text-center text-[13px] text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="text-champagne hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
