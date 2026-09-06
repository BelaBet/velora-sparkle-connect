import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";
import { signUpMember, completeSignupProfile } from "@/lib/member-auth";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Velora — Criar conta" },
      {
        name: "description",
        content: "Crie sua conta Velora com verificação em duas etapas e checagem de identidade.",
      },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("É preciso aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error: signUpError, sessionCreated } = await signUpMember(email, password);
    if (signUpError) {
      setLoading(false);
      setError(signUpError);
      return;
    }

    if (!sessionCreated) {
      setLoading(false);
      setAwaitingConfirmation(true);
      return;
    }

    const profileError = await completeSignupProfile(name, Number(age), city);
    setLoading(false);
    if (profileError) {
      setError(profileError);
      return;
    }
    void navigate({ to: "/" });
  };

  if (awaitingConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
        <div className="w-full max-w-sm text-center">
          <VeloraMark size={30} className="mx-auto text-champagne" />
          <h1 className="mt-6 font-display text-2xl text-ivory">Confirme seu e-mail</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Enviamos um link de confirmação para <span className="text-pearl">{email}</span>. Depois
            de confirmar, entre normalmente — vamos concluir seu cadastro e configurar a verificação
            em duas etapas.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block text-[13px] text-champagne hover:underline"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={30} className="text-champagne" />
          <p className="font-display text-2xl tracking-[0.3em] text-champagne">VELORA</p>
        </div>

        <p className="mt-8 text-center text-[13px] leading-relaxed text-muted-foreground">
          Toda conta Velora exige verificação em duas etapas e passa por checagem de identidade.
          Isso existe por segurança, para impedir que qualquer pessoa não autorizada acesse o app.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
            Nome
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1.5 text-[13px] text-pearl">
              Idade
              <input
                type="number"
                required
                min={18}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="29"
                className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
              />
            </label>
            <label className="flex flex-[2] flex-col gap-1.5 text-[13px] text-pearl">
              Cidade
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="São Paulo"
                className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
            />
          </label>

          <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-champagne"
            />
            <span>
              Li e concordo com os{" "}
              <Link to="/termos" target="_blank" className="text-champagne hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link to="/privacidade" target="_blank" className="text-champagne hover:underline">
                Política de Privacidade
              </Link>{" "}
              da Velora.
            </span>
          </label>

          {error && <p className="text-[13px] text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="mt-2 rounded-full border border-champagne py-2.5 text-[13px] uppercase tracking-[0.14em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-champagne hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
