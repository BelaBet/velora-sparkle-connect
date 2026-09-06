import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";
import { completeSignupProfile } from "@/lib/member-auth";

export const Route = createFileRoute("/completar-perfil")({
  head: () => ({
    meta: [{ title: "Velora — Completar cadastro" }],
  }),
  component: CompletarPerfil,
});

function CompletarPerfil() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const profileError = await completeSignupProfile(name, Number(age), city);
    setLoading(false);
    if (profileError) {
      setError(profileError);
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

        <h1 className="mt-8 text-center font-display text-2xl text-ivory">Falta pouco</h1>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground">
          Seu e-mail já foi confirmado. Complete seu perfil para continuar.
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

          {error && <p className="text-[13px] text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full border border-champagne py-2.5 text-[13px] uppercase tracking-[0.14em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Salvando…" : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
