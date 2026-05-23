# ServiceFlow

Reusable lead capture, scheduling request, and admin workflow template for local service businesses.

Initial configuration target:
- LocalOps Systems (first seed/client config)

Next adaptation target:
- Neighbor electrician company (client zero for service-business mode)

## Tech stack
- Next.js (App Router)
- TypeScript
- PostgreSQL
- Drizzle ORM
- Tailwind CSS

## Current scope (foundation pass)
- Project structure and MVP route skeleton
- Drizzle schema draft for core entities
- LocalOps seed data as first business configuration
- Environment-driven setup for mode and business slug

## Setup
1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL` in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate SQL migrations from schema:
   ```bash
   npm run db:generate
   ```
5. Apply schema to local DB:
   ```bash
   npm run db:push
   ```
6. Seed LocalOps baseline data:
   ```bash
   npm run db:seed
   ```
7. Run the app:
   ```bash
   npm run dev
   ```

## Database scripts
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:studio`
- `npm run db:seed`

## Docs
- Architecture overview: `docs/architecture.md`
- Route and page plan: `docs/mvp-route-plan.md`
