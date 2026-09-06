import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";
import { getVerifiedTotpFactorId, challengeAndVerifyTotp, signOutMember } from "@/lib/member-auth";

export const Route = createFileRoute("/mfa/verificar")({
  head: () => ({
    meta: [{ title: "Velora — Verificação em duas etapas" }],
  }),
  component: MfaVerificar,
});

function MfaVerificar() {
  const navigate = useNavigate();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getVerifiedTotpFactorId().then(setFactorId);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    setError(null);
    const message = await challengeAndVerifyTotp(factorId, code);
    setLoading(false);
    if (message) {
      setError("Código inválido. Tente novamente.");
      return;
    }
    void navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={30} className="text-champagne" />
          <p className="font-display text-2xl tracking-[0.3em] text-champagne">VELORA</p>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl text-ivory">
          Confirme sua identidade
        </h1>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground">
          Por segurança, pedimos o código do seu app autenticador a cada novo acesso. Isso impede
          que alguém com apenas sua senha entre na sua conta.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
            Código de 6 dígitos
            <input
              required
              autoFocus
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="rounded-lg surface-glass px-4 py-2.5 text-center text-[18px] tracking-[0.3em] text-ivory outline-none placeholder:text-muted-foreground"
            />
          </label>

          {error && <p className="text-[13px] text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading || code.length !== 6 || !factorId}
            className="mt-2 rounded-full border border-champagne py-2.5 text-[13px] uppercase tracking-[0.14em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Verificando…" : "Verificar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            void signOutMember().then(() => navigate({ to: "/login" }));
          }}
          className="mt-6 w-full text-center text-[13px] text-muted-foreground transition-velora hover:text-champagne"
        >
          Sair e entrar com outra conta
        </button>
      </div>
    </div>
  );
}
