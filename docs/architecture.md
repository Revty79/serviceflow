# ServiceFlow Architecture (MVP Foundation)

## 1) Build goal for this phase
Create a reusable, single-client template that can be reconfigured for different local service businesses without rewriting the app.

## 2) Design principles
- Keep business-specific copy and brand values in data (`business_settings`, seeds), not in page code.
- Keep routes stable and reusable across business modes.
- Keep auth and scheduling behavior modular so we can upgrade later without schema rework.
- Start with one database and one active business slug; prepare for per-client DB later.

## 3) Current project structure
```text
src/
  app/
    page.tsx
    services/page.tsx
    packages/page.tsx
    request/page.tsx
    thank-you/page.tsx
    admin/
      layout.tsx
      login/page.tsx
      leads/page.tsx
      leads/[leadId]/page.tsx
      settings/page.tsx
  components/
    dev/route-placeholder.tsx
  lib/
    config/
      env.ts
      business-modes.ts
    db/
      client.ts
      schema.ts
      seed/
        localops.ts
        index.ts
    routes/
      mvp-routes.ts
docs/
  architecture.md
  mvp-route-plan.md
drizzle.config.ts
```

## 4) Configuration layers
- Environment (`.env`): runtime settings like DB URL and active business slug.
- Database (`business_settings`): business identity, contact details, CTA text, brand tokens.
- Mode mapping (`business-modes.ts`): default behavior profile (`localops` vs `service_business`).
- Seed set (`seed/localops.ts`): first real client configuration for LocalOps Systems.

## 5) Multi-client path (later phases)
Today:
- One Postgres database.
- One active business selected by `SERVICEFLOW_BUSINESS_SLUG`.

Future options:
- Option A: shared DB, scoped by `business_id` (already supported by schema).
- Option B: separate DB per client by environment-specific `DATABASE_URL`.
- Option C: hybrid (small clients shared, larger clients isolated).

## 6) Out of scope in this first pass
- Production auth implementation.
- Full lead form submission pipeline and UI polish.
- Notification delivery (email/SMS).
- Appointment calendar integrations.
