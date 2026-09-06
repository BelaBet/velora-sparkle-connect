import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, ScreenIntro } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";
import {
  getOwnVerificationStatus,
  requestIdentityVerification,
  type MemberVerificationStatus,
} from "@/lib/member-auth";

export const Route = createFileRoute("/verificacao")({
  head: () => ({
    meta: [{ title: "Velora — Verificação de identidade" }],
  }),
  component: Verificacao,
});

const statusCopy: Record<MemberVerificationStatus, { label: string; description: string }> = {
  pendente: {
    label: "Em análise",
    description: "Nossa equipe de confiança está revisando sua solicitação.",
  },
  aprovada: {
    label: "Identidade verificada",
    description: "Seu perfil já exibe o selo de identidade verificada.",
  },
  rejeitada: {
    label: "Não aprovada",
    description: "Solicite novamente ou entre em contato com o suporte.",
  },
};

function Verificacao() {
  return (
    <RequireMember>
      <AppShell activeTab="Descobrir" activeBottom="Perfil">
        <VerificacaoContent />
      </AppShell>
    </RequireMember>
  );
}

function VerificacaoContent() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<MemberVerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    void getOwnVerificationStatus().then((s) => {
      setStatus(s);
      setLoading(false);
    });
  }, []);

  const handleRequest = async () => {
    setRequesting(true);
    const error = await requestIdentityVerification();
    setRequesting(false);
    if (error) {
      toast("Não foi possível enviar a solicitação", { description: error });
      return;
    }
    setStatus("pendente");
    toast("Solicitação enviada", { description: "Você será avisada quando a análise terminar." });
  };

  return (
    <>
      <ScreenIntro
        eyebrow="Confiança"
        title="Verificação de identidade"
        description="Por segurança, pedimos essa verificação para impedir perfis falsos e proteger todo o círculo Velora. Ela não é obrigatória para continuar, mas perfis verificados têm prioridade na descoberta."
      />

      <div className="px-6 py-8">
        {loading ? (
          <p className="text-[13px] text-muted-foreground">Carregando…</p>
        ) : status ? (
          <div className="rounded-lg surface-glass p-5">
            <p className="text-[15px] text-ivory">{statusCopy[status].label}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {statusCopy[status].description}
            </p>
          </div>
        ) : (
          <button
            type="button"
            disabled={requesting}
            onClick={() => void handleRequest()}
            className="w-full rounded-lg surface-glass p-5 text-left transition-velora hover:border-champagne/35 disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="block text-[15px] text-ivory">
              {requesting ? "Enviando…" : "Solicitar verificação de identidade"}
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
              Um membro da equipe confirma manualmente seus dados. Não pedimos documentos ou fotos
              pelo app — apenas o status da verificação fica registrado.
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="mt-6 w-full text-center text-[13px] text-muted-foreground transition-velora hover:text-champagne"
        >
          {status ? "Voltar para a Velora" : "Fazer isso depois"}
        </button>
      </div>
    </>
  );
}
