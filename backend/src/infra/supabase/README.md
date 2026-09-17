# Batch 4 — Supabase adapter boundary

The backend flow remains:

`HTTP → middleware → controller → service → repository/provider interface → infrastructure adapter`

`backend/src/infra/supabase/adapter.ts` is intentionally SDK-free in this batch. It provides the server-only configuration boundary and a controlled error when Supabase-dependent work is attempted without configuration. Health startup does not construct or require a Supabase connection.

Future Supabase SDK imports may exist only inside this directory. Repository and provider interfaces remain framework-neutral so domain modules can be tested with fakes and can change persistence providers without rewrites.
