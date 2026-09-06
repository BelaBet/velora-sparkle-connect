# Velora: Private Luxury

Sim. E eu faria isso antes de construir as telas, porque a Velora precisa nascer com uma linguagem visual única — não podemos ter uma tela “luxo” e outra com cara de SaaS comum.

A arquitetura que eu proponho é esta:

VELORA — Arquitetura Premium

Conceito central:

Private Luxury Dating & Experiences

A experiência inteira deve transmitir três coisas:

Privacidade → Confiança → Exclusividade

1. Estrutura técnica

Eu montaria inicialmente como:

VELORA
│
├── apps/
│   ├── web/                  → Next.js
│   ├── mobile/               → React Native / Expo
│   └── admin/                → Backoffice
│
├── packages/
│   ├── ui/                   → Biblioteca visual Velora
│   ├── design-tokens/        → Cores, tipografia, espaçamentos
│   ├── icons/                → Ícones proprietários
│   ├── validation/           → Regras e validações
│   ├── types/                → Tipos compartilhados
│   └── config/               → Configurações
│
├── backend/
│   ├── auth/
│   ├── identity/
│   ├── profiles/
│   ├── discovery/
│   ├── matching/
│   ├── messaging/
│   ├── experiences/
│   ├── bookings/
│   ├── payments/
│   ├── trust/
│   ├── moderation/
│   └── notifications/
│
└── database/
    ├── migrations/
    ├── functions/
    ├── policies/
    └── seeds/

A biblioteca packages/ui será o coração visual da Velora.

2. Biblioteca Velora UI

Não quero uma biblioteca genérica de componentes.

Quero uma Design System Library de alto luxo.

Nome:

Velora UI

Ela terá componentes próprios como:

Velora UI
│
├── Foundation
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Radius
│   ├── Shadows
│   ├── Motion
│   └── Blur
│
├── Navigation
│   ├── TopBar
│   ├── BottomNavigation
│   ├── TabBar
│   └── BackButton
│
├── Cards
│   ├── ProfileCard
│   ├── ExperienceCard
│   ├── MatchCard
│   ├── VenueCard
│   └── PremiumCard
│
├── Identity
│   ├── VerifiedBadge
│   ├── TrustBadge
│   ├── IdentityStatus
│   └── PrivacyIndicator
│
├── Interaction
│   ├── InterestButton
│   ├── PassButton
│   ├── SaveButton
│   ├── ShareButton
│   └── LikeAnimation
│
├── Forms
│   ├── Input
│   ├── Select
│   ├── DatePicker
│   ├── LocationPicker
│   └── PreferenceSelector
│
├── Messaging
│   ├── ChatBubble
│   ├── ConversationPreview
│   ├── TypingIndicator
│   └── SafetyNotice
│
├── Experiences
│   ├── ExperienceHero
│   ├── ExperiencePackage
│   ├── VenueGallery
│   ├── BookingCard
│   └── ReservationStatus
│
├── Safety
│   ├── SafetyCenter
│   ├── CheckIn
│   ├── EmergencyButton
│   ├── BlockButton
│   └── ReportButton
│
└── Feedback
    ├── Toast
    ├── Modal
    ├── BottomSheet
    ├── Loading
    └── EmptyState

3. Paleta oficial

Nada de dourado exagerado.

O luxo da Velora será discreto.

Base

Obsidian       #090909
Graphite       #121212
Charcoal       #1B1B1B
Smoke          #272727
Ivory          #F4F0E8
Pearl          #E8E3DA
Champagne      #C8AD78
Champagne Soft #A99163

O Champagne será usado como detalhe de sofisticação.

Não como fundo inteiro.

4. Tipografia

Quero duas famílias trabalhando juntas.

Display

Uma serif sofisticada:

Cormorant Garamond

Para:

títulos

nomes

frases premium

experiências

campanhas

Exemplo:

Meet someone extraordinary.

Interface

Uma sans moderna:

Inter

Para:

botões

menus

filtros

informações

mensagens

dados

Essa combinação cria aquele contraste:

editorial de luxo + tecnologia moderna.

5. Sistema de fotografia

Aqui está uma parte importantíssima.

A biblioteca não deve definir apenas componentes.

Ela deve definir como a Velora fotografa.

Velora Photography System

Perfil

Fotos:

alta resolução

iluminação natural ou cinematográfica

composição editorial

ambientes sofisticados

hotéis

restaurantes

rooftops

lounges

viagens

arquitetura

experiências

Evitar:

selfies ruins

banheiro

fotos tremidas

excesso de filtros

estética de aplicativo de relacionamento barato

sexualização explícita

A foto precisa dizer:

“Essa pessoa tem uma vida interessante.”

e não simplesmente:

“Essa pessoa está disponível.”

6. Profile Card

Esse será provavelmente o componente mais importante da plataforma.

Visualmente:

┌──────────────────────────────┐
│                              │
│                              │
│        FOTO EDITORIAL        │
│                              │
│                              │
│  ✓ Identidade verificada     │
│                              │
│  Juliana, 29                 │
│  São Paulo · 3 km            │
│                              │
│  Gastronomia · Viagens       │
│  Música · Academia           │
│                              │
│  "Adoro descobrir novos      │
│   lugares e boas conversas." │
│                              │
│    ×              ♡          │
└──────────────────────────────┘

Mas com uma diferença:

a imagem domina.

A interface não deve competir com a fotografia.

7. Hierarquia visual

Toda tela seguirá:

1. IMAGEM / EXPERIÊNCIA
        ↓
2. IDENTIDADE
        ↓
3. INFORMAÇÃO
        ↓
4. AÇÃO

Nunca:

botão
botão
botão
texto
texto
imagem

Isso deixa a interface com cara de sistema administrativo.

A Velora não pode parecer um sistema administrativo.

8. Sistema de espaçamento

Vamos trabalhar com uma escala consistente:

4
8
12
16
20
24
32
40
48
64
80
96

Muito espaço negativo.

Luxo precisa de respiro.

9. Bordas e superfícies

Nada de cards com borda pesada.

Preferência:

background
↓
camada escura
↓
imagem
↓
gradient
↓
conteúdo

Para elementos secundários:

background: rgba(...)
border: 1px rgba(...)
backdrop-blur

Ou seja:

glass discreto, não “glassmorphism de 2022”.

10. Microinterações

Aqui podemos deixar a Velora realmente sofisticada.

Exemplo:

Interesse

O usuário toca:

♡

A animação:

scale 1
→
scale 1.12
→
glow
→
scale 1

Duração:

180–240ms

Nada exagerado.

Match

Quando ocorre conexão:

foto
↓
blur
↓
fade
↓
"É uma conexão."
↓
duas fotos aparecem
↓
"Vocês demonstraram interesse."

Minimalista.

11. Ícones

Eu evitaria uma biblioteca visual extremamente reconhecível.

Podemos criar:

Velora Icons

Estilo:

linha fina

geometria elegante

cantos suaves

1.5px

visual editorial

Exemplo:

♡
⌖
✦
◌
◯
↗
✓

E ícones específicos para:

identidade

confiança

segurança

experiência

localização

conexão

12. Badges

Um dos elementos mais importantes.

Verificada

✓ Identidade verificada

Liveness

◉ Presença verificada

Trust

✦ Perfil confiável

Premium

VELORA BLACK

Experience

VELORA EXPERIENCE

Esses elementos precisam ser pequenos e elegantes.

Nada de selos gigantes.

13. Design Tokens

A biblioteca terá tokens centralizados.

Exemplo:

color.background.primary
color.background.secondary

color.text.primary
color.text.secondary
color.text.muted

color.accent.champagne
color.accent.champagneSoft

radius.sm
radius.md
radius.lg
radius.xl

spacing.xs
spacing.sm
spacing.md
spacing.lg
spacing.xl

shadow.card
shadow.modal

motion.fast
motion.normal
motion.slow

Assim, se amanhã decidirmos:

“O champagne está muito amarelo.”

mudamos uma variável e toda a plataforma acompanha.

14. Arquitetura do produto

Além da biblioteca visual:

                    VELORA
                       │
       ┌───────────────┼────────────────┐
       │               │                │
    PEOPLE         EXPERIENCES       TRUST
       │               │                │
       │               │                │
   Discovery        Venues          Identity
   Matching         Hotels          Liveness
   Profiles         Restaurants     Reputation
   Connections      Events          Safety
   Messaging        Concierge       Moderation
       │               │                │
       └───────────────┼────────────────┘
                       │
                  PLATFORM CORE
                       │
             ┌─────────┼─────────┐
             │         │         │
          Supabase   Payments   Notifications

15. Banco de dados

O núcleo será:

users
profiles
profile_photos

identity_verifications
user_preferences

likes
matches
blocks

conversations
messages

trust_scores
reviews
reports

experiences
experience_categories

partners
partner_locations
partner_availability

bookings
booking_participants

payments
subscriptions
subscription_plans

notifications
support_tickets
audit_logs
consent_records

E aqui quero ser bastante rígida:

biometria bruta não deve ficar circulando pelo nosso banco.

A arquitetura deve preferir armazenar:

provider
provider_reference
verification_status
identity_verified
age_verified
liveness_verified
verified_at

e não guardar desnecessariamente documentos/selfies biométricos.

Isso é particularmente importante porque a plataforma trabalhará com identidade e dados sensíveis. A própria orientação técnica do Supabase reforça RLS, controle de autorização e proteção das superfícies expostas.

16. Segurança desde o início

Não vamos colocar segurança depois.

A arquitetura já nasce com:

Auth
 │
 ├── MFA
 ├── Session management
 ├── Device recognition
 └── Risk detection
        │
        ↓
Identity
 │
 ├── Document
 ├── Age
 └── Liveness
        │
        ↓
Trust
 │
 ├── Reputation
 ├── Reports
 ├── Blocks
 └── Behavior

No Supabase:

RLS em todas as tabelas expostas, políticas específicas por usuário e nada de usar metadata editável pelo usuário para decisões de autorização.

17. Stack

Eu manteria:

CamadaTecnologiaWebNext.jsMobileReact Native / ExpoUIVelora UIBackendSupabaseDatabasePostgreSQLAuthSupabase AuthStorageSupabase Storage / mídia dedicadaRealtimeSupabase RealtimeAPIsEdge Functions / Next.jsHostingVercelIdentityProvedor KYC/LivenessPushAPNs + FirebaseAnalyticsPostHogPaymentsGateway compatível com o modeloMonitoringSentry

A camada web pode usar Next.js App Router, mantendo componentes e responsabilidades bem separados entre servidor e cliente.

18. A regra de ouro da Velora

Quero colocar isso como princípio no próprio design system:

Se parece barato, removemos.

Se parece complicado, simplificamos.

Se parece comum, refinamos.

Se parece inseguro, não lançamos.

E principalmente:

A Velora não deve parecer um “app de pegação”.

Ela deve parecer uma mistura de:

hotel cinco estrelas + private club + dating premium + concierge digital.

Essa é a diferença que pode criar uma marca realmente forte.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://velora-sparkle-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aa18b926-a958-4a61-969a-b8ec93513ee5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

> **Nota**: desde que o repositório virou um monorepo (`apps/` + `packages/`), o
> editor visual do Lovable — que espera o app na raiz do repo — provavelmente
> não consegue mais sincronizar/buildar este projeto. O desenvolvimento
> passou a ser feito por aqui (Git/Claude Code) em vez do editor Lovable.

## Estrutura do repositório

```
velora/
├── apps/
│   └── web/              → app principal (TanStack Start), inclui /admin
├── packages/
│   ├── ui/                → Velora UI — componentes visuais reutilizáveis
│   └── design-tokens/     → cores, tipografia, espaçamento, motion (CSS)
└── supabase/
    └── migrations/        → schema versionado do backend
```

`packages/ui` e `packages/design-tokens` são consumidos por `apps/web` via
workspace (`workspace:*`), sem precisar de build separado — o Vite do app
processa o TypeScript/CSS direto da fonte.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
