# Live application audit: Mxcks/branching-builder (Phase 10)

Date: 2026-09-23. Read-only audit plus one local, uncommitted copy change. Nothing was
pushed or deployed. No production Supabase, Vercel, Cloudflare, or DNS setting was
touched.

## Repository

| Item | Value |
|---|---|
| Remote | `git@github.com:Mxcks/branching-builder.git` (also `Mxcks/macks-studios-lead-net`) |
| Local clone | `/home/dev/Documents/Suyama/Project/branching-builder` |
| `main` HEAD | `476ed3a` 2026-09-17 "Handle booking subdomain root redirect" |
| Deployed? | Very likely `main`: live homepage body text is identical to `main` apart from the offer name. The exact deployed commit can only be confirmed in Vercel. |
| Framework | TanStack Start (React, Vite, Nitro), Tailwind, shadcn/ui |
| Package manager | bun (`bun.lock`) |
| Hosting | Vercel (`vercel.json`, framework `tanstack-start`) |
| Auth | Supabase Auth (email/password, magic link, password reset), Cloudflare Turnstile |
| Data | Supabase Postgres; database webhooks via `private.app_config` |
| Payments | **No Stripe integration.** The $1,000 reservation payment link is sent by email after the reserve form |
| Other services | Resend, HubSpot forms, Telegram notifications, Cloudflare R2 uploads, PostHog, Sentry |

Environment variable names (values not read): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_*`, `VITE_TURNSTILE_SITE_KEY`,
`VITE_POSTHOG_*`, `VITE_SENTRY_*`, `SENTRY_*`, `HUBSPOT_*`, `PUBLIC_SITE_URL`,
`RESEND_API_KEY`, `INTAKE_ADMIN_EMAIL`, `TELEGRAM_*`, `R2_*`.

Routes (51): public marketing `/`, `/explore`, `/about/studio`, `/foundation/reserve`,
`/foundation/waitlist`, `/brief`, `/guild`, `/ship`, `/developer`, `/request-project`,
`/intake/*`; auth `/login`, `/signup`, `/auth`, `/reset-password`, `/start`,
`/waiting-room`; signed-in `/portal/*`, `/messages`, `/settings`, `/account`,
`/admin/*`; API `/api/public/*/notify`, `/api/public/assign-tier`; `/sitemap.xml`.

## "Studios Foundation" occurrences

| File | Count | Class | Action |
|---|---|---|---|
| `src/routes/index.tsx` | 10 | A public marketing (title, meta, og, headings, body) | changed to Studio Foundation |
| `src/routes/foundation.waitlist.tsx` | 5 | A public marketing | changed |
| `src/routes/foundation.reserve.tsx` | 2 | A public marketing (meta, eyebrow) | changed |
| `src/lib/studio/foundation.ts` | 4 of 5 | A public copy data (CTA label, step body, FAQ, launch offer) | changed |
| `src/lib/studio/foundation.ts` line 1 | 1 | F code comment | unchanged |
| `src/lib/studio/foundation-intake.functions.ts` | 1 | F code comment | unchanged |
| `supabase/migrations/20260909090000_…sql` | 1 | I applied migration comment | unchanged |
| `tests/foundation-content.test.ts` | 1 | G expected CTA label | updated to match the visible label |

No database value, route, identifier, or intake kind contains the string.
"Studios Mobile" and "How Studios works" are different names and were left alone.

## "Foundation Map" and "Studio Map"

| Where | Text | Class | Action |
|---|---|---|---|
| `/explore` | 4-stage journey: Studio Entry (paid, credited), **Studio Map** ("scope, boundaries, price path, ownership"), Configured Build, Continuity | A public marketing | **not changed; owner decision needed** |
| `/about/studio` | same four stages; "the Studio Map explains it" | A public marketing | **not changed; owner decision needed** |
| homepage "How it works" step 2 "Map" | after the $1,000 reservation | A public marketing | **not changed** |

Renaming "Studio Map" to "Foundation Map" would describe the Foundation Map as holding a
price path and following a paid entry, which the alignment brief excludes. Renaming the
homepage "Map" step would tie the $1,000 reservation to the Foundation Map. Both need
Max.

## The five-stage flow

Source: `HOW_IT_WORKS` in `src/lib/studio/foundation.ts`, rendered on `/`. It is
**marketing copy only**; there is no state machine behind it.

| Stage | Copy | What actually happens in code |
|---|---|---|
| Reserve | "Put down $1,000 to reserve a Studio Foundation build slot." | `/foundation/reserve` form inserts an `intake_submissions` row (kind `foundation-reserve`) and notifies admins. No payment, no auth. Payment link sent later by email. |
| Map | review business, systems, journey, requirements | no code; manual service work |
| Confirm | scope, total price, deliverables, plan | no code; manual |
| Build | design and develop | no code on the public site; delivery happens elsewhere |
| Launch | verify, deploy, launch support | no code |

Relationship to Discovery → Foundation Map → Proposal: the five stages describe a
**build engagement** (reserve a slot, scope it, price it, build, launch). The three
stages describe the **diagnostic path before a commercial offer**. They can coexist if
the app's copy presents Reserve → … → Launch as the build path that follows a Proposal.
Today they conflict on order: the old copy takes $1,000 **before** mapping, while the new
model maps **before** the Proposal and is payment-neutral. Resolving that is a business
decision, not a copy fix.

## Pricing

| Amount | Source | Meaning |
|---|---|---|
| $4,500 | `FOUNDATION_PRICING.startingAt` | starting project price for a Studio Foundation build; final price after scope confirmation |
| $1,000 | `FOUNDATION_PRICING.reservation` | reservation deposit for a build slot, applied to the project total |

Both unchanged. Neither is attached to the Foundation Map. Neither appears on the new
landing page.

## Booking vs Reserve

- Reserve is a **build-slot reservation request** that leads to a $1,000 payment.
- Studio Discovery is a **free-standing call booking** on Cal.com.
- They are different funnel stages and can coexist. The new landing page should keep
  Cal.com; the app should keep Reserve until Max decides otherwise.
- `vercel.json` already redirects `booking.macksstudios.org` to the approved Cal.com URL,
  but that hostname has no DNS record, so the redirect is inactive.

## Phase 10B: language reconciliation (2026-09-23)

Owner decision (Max): "Map" only ever means the Foundation Map; retire "Studio Map";
reframe `/explore` and `/about/studio` as the Build engagement after Proposal acceptance;
the $1,000 build-slot deposit sits after Proposal acceptance, before Build; the Foundation
Map package price is separate and TBD; pricing and workflow logic untouched.

Canonical journey: Discovery → Foundation Map → Proposal → Proposal acceptance → $1,000
build-slot deposit → Build → launch.

Changes on local branch `reconcile/studio-foundation-singular` (uncommitted):

| File | Change | Type |
|---|---|---|
| `src/lib/studio/foundation.ts` | new `DISCOVERY_BOOKING_URL`; `HOW_IT_WORKS` reordered to Discovery, Foundation Map, Proposal, Reserve, Build and launch; four FAQ answers; deliverable "system mapping" → "system planning"; earlier singular-name edits | copy data; pricing constants and capacity functions unchanged |
| `src/routes/index.tsx` | hero, pricing, and closing CTAs → Studio Discovery booking; Reserve kept as "Proposal accepted? Reserve your build slot."; pricing and how-it-works wording; earlier name edits | copy and link targets |
| `src/components/site/SiteHeader.tsx` | header button → "Book a call" (Cal.com) instead of "Reserve Your Studio" | link target and label |
| `src/routes/explore.tsx` | Studio Entry and Studio Map retired; stages now Accepted Proposal, Build-slot deposit, Configured Build, Continuity; meta copy; "Begin Studio Entry" → "Get started" (still `/start`) | copy, icons |
| `src/routes/about.studio.tsx` | expectations reframed around Discovery/Foundation Map/Proposal then Build; meta and JSON-LD descriptions; "Begin Studio Entry" → "Get started" | copy |
| `src/routes/foundation.reserve.tsx` | framed for clients with an accepted Proposal; link to book Discovery first; success and footnote wording; earlier name edits | copy |
| `src/routes/foundation.waitlist.tsx` | earlier name edits only | copy |
| `tests/foundation-content.test.ts` | earlier label update; six new invariant tests (prices 4500/1000, journey order, no price on the Foundation Map step, deposit names Proposal, no Studio Map, booking URL) | test |

Not changed: reserve form fields and submission, `submitFoundationReservation`,
database, notifications, auth, routes, API, `FOUNDATION_PRICING`, `primaryCtaHref` /
`primaryCtaLabel` / capacity switch, migrations.

Cutover runbook: `cutover-runbook.md`.
