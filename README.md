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
- Milestone 1 completed: lead intake and admin lead management working
- Milestone 2A current status: functional business settings editor at `/admin/settings`

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

## Milestones
- Milestone 1: Completed
  - Public request form creates leads
  - Admin login works
  - Admin lead inbox works
  - Lead detail status updates and internal notes work
- Milestone 2A: In progress
  - Active business settings can be edited in admin
  - Changes revalidate affected public pages

## Local Admin Login
- URL: `http://localhost:3000/admin/login`
- Default seeded email: `owner@localopssystems.com`
- Default seeded password: `change-me-before-production`
- You can override these in `.env` with:
  - `SEED_ADMIN_EMAIL`
  - `SEED_ADMIN_PASSWORD`

## Business Settings Editor
- Route: `http://localhost:3000/admin/settings`
- This page edits the active business selected by `SERVICEFLOW_BUSINESS_SLUG`.
- Editable fields in this milestone:
  - `businessName`
  - `phone`
  - `email`
  - `serviceArea`
  - `primaryCtaText`
  - `secondaryCtaText`
  - `brandPrimary`
  - `brandSecondary`
  - `brandAccent`
  - `timezone`
  - `contactRouting.notifyEmails`

## Database scripts
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:studio`
- `npm run db:seed`

## Docs
- Architecture overview: `docs/architecture.md`
- Route and page plan: `docs/mvp-route-plan.md`
