import { createFileRoute, Link } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Velora — Termos de Uso" },
      { name: "description", content: "Termos de Uso da Velora." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Termos,
});

function Termos() {
  return (
    <div className="min-h-screen bg-obsidian px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={28} className="text-champagne" />
          <p className="font-display text-xl tracking-[0.3em] text-champagne">VELORA</p>
        </div>

        <h1 className="mt-8 font-display text-3xl text-ivory">Termos de Uso</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Última atualização: 6 de setembro de 2026
        </p>

        <div className="mt-8 flex flex-col gap-6 text-[14px] leading-relaxed text-pearl/85">
          <section>
            <h2 className="text-[15px] text-ivory">1. Sobre a Velora</h2>
            <p className="mt-2">
              A Velora é uma plataforma de relacionamento e experiências que conecta pessoas maiores
              de 18 anos. Ao criar uma conta, você declara ter pelo menos 18 anos e concorda com
              estes Termos e com nossa{" "}
              <Link to="/privacidade" className="text-champagne hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">2. Sua conta</h2>
            <p className="mt-2">
              Você é responsável por manter a confidencialidade da sua senha e do seu segundo fator
              de autenticação (MFA). Informações de perfil (nome, idade, cidade, fotos, biografia)
              devem ser verdadeiras. Contas com informações falsas, perfis duplicados ou uso
              automatizado podem ser suspensas ou encerradas sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">3. Verificação de identidade</h2>
            <p className="mt-2">
              Podemos solicitar verificação de identidade a qualquer momento. Perfis não verificados
              podem ter alcance reduzido na descoberta. Falsificar sua identidade ou tentar burlar a
              verificação é motivo de banimento permanente.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">4. Conduta</h2>
            <p className="mt-2">São proibidos, entre outros:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>
                Assédio, ameaças, discurso de ódio ou conteúdo sexualmente explícito não solicitado;
              </li>
              <li>Solicitar dinheiro, dados bancários ou documentos de outros membros;</li>
              <li>Perfis falsos, golpes ou qualquer atividade fraudulenta;</li>
              <li>Uso da plataforma por menores de 18 anos;</li>
              <li>Coleta de dados de outros membros para fins não previstos nestes Termos.</li>
            </ul>
            <p className="mt-2">
              Denúncias são analisadas pela nossa equipe de confiança em até 24 horas. Contas
              reincidentes ou com denúncias graves podem ser suspensas cautelarmente durante a
              análise.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">5. Bloqueio e denúncia</h2>
            <p className="mt-2">
              Você pode bloquear qualquer perfil a qualquer momento — o bloqueio é imediato e impede
              contato em ambas as direções. Denúncias falsas ou feitas de má-fé também violam estes
              Termos.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">6. Assinaturas (Velora Black)</h2>
            <p className="mt-2">
              Planos pagos são cobrados de forma recorrente até o cancelamento. Você pode cancelar a
              qualquer momento; o acesso aos benefícios do plano permanece até o fim do período já
              pago. Não há reembolso proporcional de períodos parcialmente utilizados, exceto quando
              exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">7. Experiências e reservas</h2>
            <p className="mt-2">
              Reservas de experiências feitas pelo concierge Velora estão sujeitas à disponibilidade
              dos parceiros (restaurantes, hotéis, lounges). A Velora atua como intermediária e não
              se responsabiliza por atos de terceiros durante a experiência.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">8. Encerramento de conta</h2>
            <p className="mt-2">
              Você pode encerrar sua conta a qualquer momento pelas configurações de perfil. Podemos
              suspender ou encerrar contas que violem estes Termos, com ou sem aviso prévio, a nosso
              critério, especialmente em casos de risco à segurança de outros membros.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">9. Alterações</h2>
            <p className="mt-2">
              Podemos atualizar estes Termos periodicamente. Mudanças relevantes serão comunicadas
              dentro do app antes de entrarem em vigor.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">10. Contato</h2>
            <p className="mt-2">
              Dúvidas sobre estes Termos: <span className="text-pearl">suporte@velora.app</span>
            </p>
          </section>
        </div>

        <Link
          to="/cadastro"
          className="mt-10 inline-block text-[13px] text-champagne hover:underline"
        >
          Voltar para o cadastro
        </Link>
      </div>
    </div>
  );
}
