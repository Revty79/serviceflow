# MVP Route & Page Plan

## Public routes

| Route | Purpose | Reads | Writes |
|---|---|---|---|
| `/` | Home / positioning and CTA launch point | `business_settings`, selected `services` highlights | none |
| `/services` | Services / what we build | `services`, `business_settings` | none |
| `/packages` | Pricing/packages | `services` (price labels, featured order) | none |
| `/request` | Request audit/contact form | `business_settings`, `intake_questions`, `services` | `leads`, optional `appointment_requests` |
| `/thank-you` | Submission confirmation | `business_settings` | none |

## Admin routes

| Route | Purpose | Reads | Writes |
|---|---|---|---|
| `/admin/login` | Admin authentication | `admins` | session/auth state |
| `/admin/leads` | Lead inbox and filters | `leads`, optional joins for `services` and `admins` | lead assignment/status quick updates (later) |
| `/admin/leads/[leadId]` | Lead detail and notes | `leads`, `lead_notes`, `appointment_requests` | `leads.status`, `lead_notes` |
| `/admin/settings` | Business settings editor | `business_settings` | `business_settings` |

## API actions planned for MVP

| Endpoint / Action | Purpose |
|---|---|
| `POST /api/leads` | Validate and create lead from public request form |
| `PATCH /api/leads/:id/status` | Update lead status in admin |
| `POST /api/leads/:id/notes` | Add internal note |
| `PATCH /api/business-settings` | Save core business profile and branding |

## MVP state/status lifecycle

Stored values in `lead_status` enum:
- `new`
- `contacted`
- `scheduled`
- `proposal_sent`
- `won`
- `lost`
- `follow_up_later`

UI label mapping:
- New
- Contacted
- Scheduled
- Proposal Sent
- Won
- Lost
- Follow Up Later

## Route sequencing
1. Visitor lands on `/`.
2. Visitor explores `/services` or `/packages`.
3. Visitor submits `/request`.
4. Visitor reaches `/thank-you`.
5. Admin signs in via `/admin/login`.
6. Admin triages in `/admin/leads`.
7. Admin updates detail in `/admin/leads/[leadId]`.
8. Admin updates brand + CTA in `/admin/settings`.
