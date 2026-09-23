# Issue: public terminology alignment before domain cutover

Status: open, **cutover blocker**. First recorded 2026-09-23; updated in Phase 9 the same
day. Nothing has been changed on either side.

## Mismatch (re-confirmed 2026-09-23 by read-only fetch)

| | This landing page | Live macksstudios.org |
|---|---|---|
| Offer name | Studio Foundation (final) | Studios Foundation (title and 13 mentions) |
| Public journey | Discovery → Foundation Map → Proposal | Reserve → Map → Confirm → Build → Launch |
| Pricing | none; Foundation Map payment neutral | $4,500 starting price, $1,000 reservation |
| Primary action | Studio Discovery call on Cal.com | reserve, log in, sign up (no Cal.com link) |

## Where the live content comes from

Per `macks-studios-foundation-architecture-planning/planning/foundation-plan-2026-09-12/00-authority-audit.md`:
the live site is built from **`Mxcks/branching-builder`** (the same repository as
`Mxcks/macks-studios-lead-net` after a GitHub rename), HEAD `4bcce13`, merged
2026-09-09, author Denis. Pricing lives in `foundation.ts`. Routes include `/login`,
`/signup`, `/start`, `/explore`, `/foundation/reserve`, `/foundation/waitlist`.

That source is **not in this workspace**. The local `macks-studios-lead-net` folder is a
stale fork (`6d367e4`, June 2026) that predates Studios Foundation, so it cannot be used
to inspect or reconcile the live copy.

## What reconciliation needs

1. Read access to `Mxcks/branching-builder` at the deployed commit.
2. Classify every "Studios Foundation" occurrence (marketing copy, signed-in copy, code
   identifier, schema, tests, issued records) and change only current public offer copy
   to "Studio Foundation".
3. Decide what the five stages mean. Reserve and Confirm appear to be a reservation and
   checkout path tied to the $1,000 amount; Build and Launch are delivery. They can sit
   alongside Discovery → Foundation Map → Proposal if the copy says which is which. The
   $4,500 and $1,000 amounts stay as they are.
4. Decide where that application lives after the swap (see `cutover-plan.md`).

## Does it block landing-page development?

No. The landing page is complete to the final decisions.

## Must it be resolved before domain cutover?

Yes. Max's approval is "proceed once the old flow is reconciled", and swapping the root
domain would also move the live reservation, login, and signup routes.

## Phase 10 update (2026-09-23)

- "Studios Foundation" → "Studio Foundation" is done locally on branch
  `reconcile/studio-foundation-singular` of `branching-builder` (22 visible strings, one
  test expectation). Not committed, pushed, or deployed.
- Still open and needs Max: the `/explore` and `/about/studio` "Studio Map" journey, and
  the homepage order where $1,000 is paid before the Map. See `branching-builder-audit.md`.
