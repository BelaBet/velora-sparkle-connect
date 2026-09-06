# stone-split-service

> Duplicado de [BelaBet/VC](https://github.com/BelaBet/VC) para uso dentro do monorepo da Velora.
> Copiado como está — os ajustes específicos da Velora (sem split de produtor/afiliado, já
> que aqui é uma assinatura direta da plataforma, não um marketplace) ainda serão feitos.

Integração com a API de split de pagamento da **Stone / Pagar.me**, no **modelo de taxas da Hotmart** — pacote único pra usar em todos os seus projetos (em vez de cada um reimplementar isso).

Baseado na arquitetura real e validada (recipient-guard, config por variável de ambiente, `chargeWithSplit` ponta a ponta) — só o **cálculo da taxa** foi trocado pelo modelo Hotmart em vez do gross-up de 3% usado em outro projeto seu.

## O modelo de taxa (ver seção 3 e 8 do documento de planejamento)

Ao contrário de um modelo "gross-up" (onde a taxa soma em cima do preço e o cliente paga produto + taxas), aqui a taxa é **"por dentro"**, igual à Hotmart:

- O comprador paga o **valor cheio do produto**, sem acréscimo.
- A plataforma retira sua taxa **de dentro** desse valor: **9,9% + R$ 2,49** em vendas acima de R$ 10, ou **20% flat** em microtransações (≤ R$ 10).
- O que sobra é dividido entre **produtor**, **co-produtor** (opcional) e **afiliado** (opcional), pelos percentuais que você configurar.

```
totalAmount (o que o comprador paga) = valor do produto, sempre
platformFee = 9,9% × totalAmount + R$ 2,49   (ou 20% × totalAmount se ≤ R$10)
netAmount   = totalAmount − platformFee
afiliado    = netAmount × affiliatePercentage / 100
co-produtor = netAmount × coproducerPercentage / 100
produtor    = netAmount − afiliado − co-produtor   (fica com o resto)
```

A taxa da plataforma **não aparece** no array de `split` enviado ao Pagar.me — ela fica implicitamente com a conta principal (dona da secret key), que é o comportamento padrão quando as regras de split não cobrem 100% do valor. Só o que sobra depois da taxa entra no split explícito.

## Configurar

```bash
cp .env.example .env
```

Preencha `PAGARME_SECRET_KEY` (a chave que você já tem) e `PAGARME_PLATFORM_RECIPIENT_ID` (o recipient da sua conta principal). Use ambiente de teste (`sk_test_...`) primeiro.

```bash
npm install
npm run typecheck   # confere os tipos, sem gerar nada
npm run build       # compila src/*.ts -> dist/*.js
npm start           # sobe o servidor HTTP (src/server.ts) em http://localhost:3000
```

## Rodando como serviço HTTP (recomendado pra usar em vários projetos)

Com o servidor no ar (`npm start`), seus outros projetos chamam por HTTP em vez de importar o código TypeScript diretamente:

```bash
# Simular a taxa, sem cobrar nada — útil pra mostrar o preço no checkout:
curl -X POST http://localhost:3000/split/simulate \
  -H "Content-Type: application/json" \
  -d '{"grossAmountCents":49700,"producerRecipientId":"re_xxx","affiliateRecipientId":"re_yyy","affiliatePercentage":50}'

# Criar um recebedor (produtor/co-produtor/afiliado) — documento é validado
# (CPF/CNPJ com dígito verificador) antes de chamar a Pagar.me:
curl -X POST http://localhost:3000/recipients \
  -H "Content-Type: application/json" \
  -d '{"type":"individual","name":"Maria Produtora","document":"11144477735","email":"maria@example.com","bankAccount":{"bank":"260","branchNumber":"0001","accountNumber":"123456","accountCheckDigit":"7","accountType":"checking"}}'

# Cobrar de verdade, com split:
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -d '{"grossAmountCents":49700,"installments":1,"paymentMethod":"credit_card","producerRecipientId":"re_xxx","affiliateRecipientId":"re_yyy","affiliatePercentage":50}'
```

Endpoints disponíveis: `POST /recipients`, `GET /recipients/:id`, `POST /split/simulate`, `POST /checkout`, `GET /orders/:id`, `POST /webhooks/pagarme`, `GET /health`.

## Uso

```ts
import { chargeWithSplit } from "./src/charge-with-split";
import { calculateHotmartSplit, formatBRL } from "./src/split-calculator";

// Simular a taxa (sem chamar a API) — útil pra UI de checkout:
const preview = calculateHotmartSplit({
  grossAmountCents: 49700, // R$ 497,00
  producerRecipientId: "re_xxx",
  affiliateRecipientId: "re_yyy",
  affiliatePercentage: 50,
});
console.log(formatBRL(preview.platformFeeCents)); // R$ 51,69

// Cobrar de verdade:
const resultado = await chargeWithSplit({
  grossAmountCents: 49700,
  installments: 1,
  paymentMethod: "credit_card",
  producerRecipientId: "re_xxx",
  affiliateRecipientId: "re_yyy",
  affiliatePercentage: 50,
});
```

Veja `examples/usage-example.ts` pra um exemplo completo rodável.

## Estrutura

```
src/
  config.ts               → lê as variáveis de ambiente (secret key, recipient da plataforma, etc)
  document-validator.ts    → valida CPF/CNPJ (dígito verificador) antes de criar um recebedor
  split-calculator.ts      → cálculo de taxa no modelo Hotmart (9,9%+R$2,49 / 20%)
  recipient-guard.ts        → validação: nenhum recipient pode ser igual ao da plataforma
  recipients.ts             → cria/consulta recebedores (produtor, co-produtor, afiliado)
  orders.ts                  → consulta um pedido pelo id
  charge-with-split.ts       → monta o split (produtor/co-produtor/afiliado) e chama o Pagar.me
  webhook.ts                  → valida a assinatura HMAC e despacha eventos (order.paid etc)
  server.ts                   → expõe tudo isso como endpoints HTTP (Express)
examples/
  usage-example.ts             → exemplo de ponta a ponta, sem servidor
```

## Diferença em relação ao outro projeto seu (LojaHub)

| | LojaHub (gross-up) | Este pacote (Hotmart) |
|---|---|---|
| Quem paga a taxa | Cliente (soma em cima) | Sai de dentro do valor do produto |
| Taxa | 0,96% plataforma + 2,04% MDR Stone = 3% | 9,9% + R$ 2,49 (ou 20% microtransação) |
| Pernas do split | 2 (plataforma + vendedor) | até 3 (produtor + co-produtor + afiliado) |
| Quem banca taxa/arredondamento | Vendedor | Produtor |

Se algum dos seus projetos precisar do modelo gross-up em vez do Hotmart, troque só `split-calculator.ts` e `charge-with-split.ts` — `config.ts` e `recipient-guard.ts` já são genéricos o suficiente pra servir os dois.

## ⚠️ Antes de produção

1. Troque `PAGARME_SECRET_KEY` para a chave de produção (`sk_live_...`).
2. Troque `PAGARME_PLATFORM_RECIPIENT_ID` para o recipient de produção — **é uma conta separada** da de teste.
3. Implemente tokenização de cartão no front-end (nunca envie o número do cartão cru para este backend).
4. Configure o webhook do Pagar.me para `order.paid` / `order.payment_failed` / `order.refunded` e libere o acesso ao produto só depois da confirmação assíncrona, não da resposta síncrona do checkout.

## Publicando este repositório no GitHub

```bash
cd stone-split-service
gh repo create SEU_USUARIO/stone-split-service --private --source=. --remote=origin --push
# ou, sem o gh CLI: crie o repo vazio no site do GitHub e depois
git remote add origin https://github.com/SEU_USUARIO/stone-split-service.git
git push -u origin main
```
