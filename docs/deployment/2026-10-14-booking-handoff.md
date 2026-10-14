# Booking choice handoff (2026-10-14)

This PR adds the free-first booking choice to the standalone static landing source. It does not configure or deploy the production Vercel project.

## Current public evidence

- `https://macksstudios.org/` serves static HTML whose content matches this repository's `public/index.html` at `main` except for a Google ads script tag. Its `/assets/css/main.css` matches this repository's main CSS after line-ending normalization. This supports this repository as the source of the current public landing content, but does not establish the exact deployed commit or Vercel project.
- `https://macksstudios.org/booking`, `/login`, `/signup`, and `/portal` return 404 as of 2026-10-14. The older `Mxcks/macks-studios-lead-net` React repository contains `src/routes/index.tsx` and `vercel.json`, but no `public/index.html` corresponding to the current static apex. The older documentation describing React on the apex predates the current public response.
- The current Home has `noindex, nofollow`. This PR retains that setting and applies it to the new booking page. Search indexing is a separate sitewide decision.

## Release boundary for Suzuki

1. Identify the Vercel project and production deployment currently serving `macksstudios.org`; record its deployment ID and rollback target. The connected Vercel team/project records inspected for this task did not prove that mapping.
2. Apply this PR's `public/` files to that project's deployment workflow, retaining the existing Google ads script and any unrelated production configuration. Do not use a DNS switch or replace a React application as a shortcut.
3. Stage and test the actual Vercel preview at Home and `/booking/`: both Cal.com links, free-first order, keyboard access, mobile widths, assets, and existing routes. Confirm how the host handles a directory index at `/booking/` and the bare `/booking` path.
4. Promote only after the project and route behavior are verified; then check the live host and keep the recorded rollback target.

Review preview: `https://0a6cc9c6.macks-booking-review-20261014.pages.dev/booking/`. It demonstrates content and layout on Cloudflare Pages, not the production Vercel deployment mechanism.
