import { createFileRoute, Link } from "@tanstack/react-router";
import { VeloraMark } from "@velora/ui";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Velora — Política de Privacidade" },
      { name: "description", content: "Política de Privacidade da Velora." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <div className="min-h-screen bg-obsidian px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <VeloraMark size={28} className="text-champagne" />
          <p className="font-display text-xl tracking-[0.3em] text-champagne">VELORA</p>
        </div>

        <h1 className="mt-8 font-display text-3xl text-ivory">Política de Privacidade</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Última atualização: 6 de setembro de 2026
        </p>

        <div className="mt-8 flex flex-col gap-6 text-[14px] leading-relaxed text-pearl/85">
          <section>
            <p>
              Esta política explica como a Velora coleta, usa e protege seus dados pessoais, em
              conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">1. Dados que coletamos</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>
                Cadastro: nome, idade, e-mail, cidade e senha (armazenada com hash, nunca em texto
                puro);
              </li>
              <li>Perfil: fotos, biografia, interesses;</li>
              <li>
                Verificação: status de verificação de identidade (não armazenamos documentos ou
                selfies biométricas — apenas o resultado da checagem);
              </li>
              <li>
                Segurança: fator de autenticação (MFA), bloqueios e denúncias que você registra;
              </li>
              <li>
                Interações: interesses demonstrados, conexões, mensagens trocadas com outros membros
                e reservas de experiências;
              </li>
              <li>
                Pagamento: ao assinar o Velora Black, dados de cobrança são processados pelo nosso
                parceiro de pagamentos — a Velora não armazena o número do seu cartão.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">2. Como usamos seus dados</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>Operar a descoberta, conexões e mensagens entre membros;</li>
              <li>Verificar identidade e prevenir perfis falsos ou fraude;</li>
              <li>Processar assinaturas e reservas de experiências;</li>
              <li>Investigar denúncias e proteger a segurança da comunidade;</li>
              <li>Cumprir obrigações legais e responder a autoridades quando exigido por lei.</li>
            </ul>
            <p className="mt-2">
              Não vendemos seus dados pessoais a terceiros. Mensagens trocadas com outros membros
              são privadas e visíveis apenas às duas partes da conversa.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">3. Compartilhamento</h2>
            <p className="mt-2">
              Compartilhamos dados apenas com prestadores necessários à operação do serviço
              (hospedagem, banco de dados, processamento de pagamento, verificação de identidade)
              sob obrigação contratual de confidencialidade, e com autoridades quando exigido
              judicialmente.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">4. Segurança</h2>
            <p className="mt-2">
              Aplicamos controle de acesso por linha (RLS) em todo o banco de dados, autenticação
              multifator, senhas com hash e verificação contra vazamentos conhecidos. Nenhum sistema
              é 100% seguro, mas revisamos continuamente nossas práticas.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">5. Seus direitos (LGPD)</h2>
            <p className="mt-2">Você pode, a qualquer momento:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Acessar e corrigir seus dados diretamente pelo app, em Perfil → Editar;</li>
              <li>Solicitar a exclusão da sua conta e dos dados associados;</li>
              <li>Solicitar uma cópia dos seus dados;</li>
              <li>Revogar consentimentos dados anteriormente.</li>
            </ul>
            <p className="mt-2">
              Para exercer esses direitos, escreva para{" "}
              <span className="text-pearl">privacidade@velora.app</span>. Respondemos em até 15
              dias.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">6. Retenção</h2>
            <p className="mt-2">
              Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, dados
              pessoais são removidos ou anonimizados, exceto o mínimo necessário para cumprir
              obrigações legais (ex.: registros fiscais de pagamento) ou para investigar denúncias
              em aberto.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">7. Menores de idade</h2>
            <p className="mt-2">A Velora é destinada exclusivamente a maiores de 18 anos.</p>
          </section>

          <section>
            <h2 className="text-[15px] text-ivory">8. Contato</h2>
            <p className="mt-2">
              Dúvidas sobre privacidade: <span className="text-pearl">privacidade@velora.app</span>
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
