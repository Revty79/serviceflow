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
- Milestone 2B current status: customer-facing public pages now live at `/`, `/services`, `/packages`, and `/thank-you`
- Milestone 2C current status: client handoff seed safety + admin account password change at `/admin/account`
- Milestone 2D current status: admin services/packages editor at `/admin/services`

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
- Milestone 2A: Completed
  - Active business settings can be edited in admin
  - Changes revalidate affected public pages
- Milestone 2B: Completed
  - Public pages read from active business config (`SERVICEFLOW_BUSINESS_SLUG`)
  - Services and package cards render from `services` table
  - Thank-you page shows business contact details from `business_settings`
- Milestone 2C: Completed
  - Seed script is safe by default for existing client data
  - Existing admin passwords are preserved unless explicitly reset
  - Logged-in admins can change password at `/admin/account`
- Milestone 2D: Completed
  - Logged-in admins can create/edit/deactivate/reactivate services at `/admin/services`
  - Public service/package pages update from admin-managed `services` records
  - Featured package enforcement keeps one featured service per business

## Local Admin Login
- URL: `http://localhost:3000/admin/login`
- Default seeded email: `owner@localopssystems.com`
- Default seeded password: `change-me-before-production`
- You can override these in `.env` with:
  - `SEED_ADMIN_EMAIL`
  - `SEED_ADMIN_PASSWORD`
- Account route (requires login): `http://localhost:3000/admin/account`

## Client Handoff Setup
- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are for initial bootstrap only.
- `npm run db:seed` creates missing setup records.
- Existing admin passwords are not overwritten unless `RESET_SEED_ADMIN_PASSWORD=true`.
- Existing business, services, and intake records are not overwritten unless reset flags are set to `true`.
- Reset flags (default `false`):
  - `RESET_SEED_ADMIN_PASSWORD`
  - `RESET_SEEDED_BUSINESS`
  - `RESET_SEEDED_SERVICES`
  - `RESET_SEEDED_INTAKE_QUESTIONS`
- Recommended handoff flow:
  1. Create database.
  2. Configure `.env`.
  3. Run `npm run db:push`.
  4. Run `npm run db:seed`.
  5. Give client temporary login credentials.
  6. Client signs in and changes password at `/admin/account`.

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

## Admin Services Editor
- Route: `http://localhost:3000/admin/services`
- This page edits services for the active business selected by `SERVICEFLOW_BUSINESS_SLUG`.
- Supported fields:
  - `name`
  - `slug`
  - `summary`
  - `description`
  - `priceLabel`
  - `sortOrder`
  - `isFeatured`
  - `isActive`

## Public Site Data Source
- The following public routes now read from active business config:
  - `/`
  - `/services`
  - `/packages`
  - `/thank-you`
- Active business is selected by `SERVICEFLOW_BUSINESS_SLUG` and loaded from `business_settings`.

## Remaining Placeholders
- No public scaffold/route-map placeholders remain.
- Still intentionally out of scope:
  - Intake question editing in admin

## Database scripts
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:studio`
- `npm run db:seed`

## Docs
- Architecture overview: `docs/architecture.md`
- Route and page plan: `docs/mvp-route-plan.md`
