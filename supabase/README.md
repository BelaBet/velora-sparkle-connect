# Supabase — Velora

Schema do backend do painel administrativo (`/admin`): `member_profiles`,
`verification_requests`, `security_reports`, `admins`, todos com RLS
restrita a quem está na tabela `admins`.

`migrations/` espelha exatamente o que está aplicado no projeto remoto
("Veloria", ref `odfdcdpwgbdhguntmsid`) — é a fonte de verdade em texto,
versionada junto com o código, em vez de existir só no histórico do
Supabase.

## Aplicar em outro ambiente (ex: um projeto novo)

Com o [Supabase CLI](https://supabase.com/docs/guides/cli) instalado:

```sh
supabase link --project-ref <ref-do-projeto>
supabase db push
```

## Criar uma nova migration

```sh
supabase migration new nome_da_mudanca
# edite o arquivo gerado em supabase/migrations/
supabase db push
```

Evite editar migrations já aplicadas — crie uma nova para qualquer ajuste,
do jeito que já fazemos com commits.
