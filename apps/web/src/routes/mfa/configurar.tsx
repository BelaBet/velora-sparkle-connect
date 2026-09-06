import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";
import {
  cleanupUnverifiedTotpFactors,
  enrollTotp,
  challengeAndVerifyTotp,
} from "@/lib/member-auth";

export const Route = createFileRoute("/mfa/configurar")({
  head: () => ({
    meta: [{ title: "Velora — Configurar verificação em duas etapas" }],
  }),
  component: MfaConfigurar,
});

function MfaConfigurar() {
  const navigate = useNavigate();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      await cleanupUnverifiedTotpFactors();
      const { data, error: enrollError } = await enrollTotp();
      if (!active) return;
      if (enrollError || !data) {
        setError(enrollError?.message ?? "Não foi possível iniciar a configuração.");
        setPreparing(false);
        return;
      }
      setFactorId(data.id);
      setSecret(data.totp.secret);
      setQrDataUri(`data:image/svg+xml;utf8,${encodeURIComponent(data.totp.qr_code)}`);
      setPreparing(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!factorId) return;
    setLoading(true);
    setError(null);
    const message = await challengeAndVerifyTotp(factorId, code);
    setLoading(false);
    if (message) {
      setError("Código inválido. Confira o app autenticador e tente novamente.");
      return;
    }
    void navigate({ to: "/verificacao" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={30} className="text-champagne" />
          <p className="font-display text-2xl tracking-[0.3em] text-champagne">VELORA</p>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl text-ivory">
          Verificação em duas etapas
        </h1>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground">
          Obrigatória para toda conta Velora — por segurança, impede que alguém com apenas sua senha
          consiga acessar seu perfil.
        </p>

        {preparing && (
          <p className="mt-8 text-center text-[13px] text-muted-foreground">Preparando…</p>
        )}

        {!preparing && qrDataUri && (
          <>
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-[13px] text-pearl">
                Escaneie com um app autenticador (Google Authenticator, 1Password, Authy):
              </p>
              <img
                src={qrDataUri}
                alt="QR code de configuração do autenticador"
                width={180}
                height={180}
                className="rounded-lg bg-ivory p-2"
              />
              {secret && (
                <p className="max-w-full break-all text-center text-[12px] text-muted-foreground">
                  Ou insira manualmente: <span className="text-pearl">{secret}</span>
                </p>
              )}
            </div>

            <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
                Código de 6 dígitos
                <input
                  required
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
                disabled={loading || code.length !== 6}
                className="mt-2 rounded-full border border-champagne py-2.5 text-[13px] uppercase tracking-[0.14em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
              >
                {loading ? "Confirmando…" : "Confirmar e ativar"}
              </button>
            </form>
          </>
        )}

        {!preparing && !qrDataUri && error && (
          <p className="mt-8 text-center text-[13px] text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
