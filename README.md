# Macks Studios

Public website for Macks Studios (macksstudios.org). Status: **in restructuring, not
deployed**. Sections marked TODO are filled in during later phases.

## Purpose

Macks Studios helps a business turn scattered documents, disconnected tools, and unclear
customer journeys into a clearer system and a practical next step. A website may be part
of that; it is not the whole answer. This site explains that, helps a visitor recognize
their situation, explains the Discovery → Foundation Map → Proposal process, and routes
them to booking. Public process: Discovery → Foundation Map → Proposal. The Foundation
Map is the diagnostic deliverable; the Proposal is the separate commercial step; Build
comes later and is not a public stage. All owner decisions are final (2026-09-23); see
`docs/product/studio-foundation-alignment.md`. Cutover status: `docs/deployment/cutover-plan.md`.

**Primary conversion: book a Studio Discovery call.**

## Project boundaries

This repository is the public marketing website only. It does not contain, and must not
absorb, the Macks client management system (engagements, proposals, invoices, payments,
projects, handoff). The live macksstudios.org is currently served by a separate React
application that also holds client-system routes; that application is not part of this
repository and is not modified by it. Shared branding only; no shared runtime code; no
monorepo. See `docs/product/macks-product-model.md`.

## Repository structure

```
public/                      deploy root (everything served comes from here)
  index.html                 the page (markup only)
  assets/css/main.css        all styles, tokens at the top
  assets/js/main.js          booking link wiring
  assets/js/guide.js         discovery guide
  site.webmanifest           web app manifest
  assets/brand/              production brand set (logo, favicons, app icons)
  assets/js/config.js        BOOKING_URL and SITE_URL, the only place they are defined
brand/                       official logo masters, not deployed
docs/product/                what Macks is, terminology, content model, content guidelines
docs/development/            architecture
docs/deployment/             deployment status and decisions
docs/audit/                  Phase 1 audit and the cleanup manifest
archive/phase-1-originals/   every file as originally supplied, hash-verified; temporary
```

## Public website

One static page, no build step, no framework. Sections: header, hero, problem
recognition, connected-systems example, Studio foundation, how it works, optional
browser-only discovery guide, final booking call to action, footer. Section order follows
`docs/product/public-site-content-model.md`; every claim is traced in
`docs/product/content-source-audit.md`.

## Client-system relationship

Separate product, separate repository, separate deployment. The public site links to
booking only. Nothing post-booking lives here.

## Current development status

| Phase | Status |
|---|---|
| 1 Audit | done, `docs/audit/2026-09-23-phase-1-audit.md` |
| 2 Repository foundation | done |
| 3 Brand asset migration | done |
| 4 Landing-page structure | done (refactor only; content unchanged) |
| 5 Content migration | done, pending owner review of copy |
| 6 Discovery-guide refinement and alignment pass | done, pending owner review (`docs/product/studio-foundation-alignment.md`) |
| 7 Responsive conversion polish | done, pending owner review |
| 8 Release-readiness verification | done; owner decisions and pre-cutover issue remain |
| 9 Decision lock and cutover preparation | done; cutover blocked on live-site source access, see `docs/deployment/cutover-plan.md` |
| 10 / 10B Live-app audit and language reconciliation | done locally; see `docs/deployment/branching-builder-audit.md` and `docs/deployment/cutover-runbook.md` |
| 11 Cleanup and cutover | after owner decisions; see `docs/audit/cleanup-manifest.md` |
| 11 Deployment preparation | not started |

## Deployment status

Not deployed. No hosting configured, no DNS changed. See `docs/deployment/deployment.md`.

## Booking configuration

`public/assets/js/config.js` defines `MACKS_CONFIG.BOOKING_URL`
(`https://cal.com/macks-studios/studio-discovery`, verified working 2026-09-23). Every
booking button must resolve to it. `booking.macksstudios.org` has no DNS record and is not
to be used. The four booking links in the markup carry `data-booking-link` and are
wired from that value by `main.js`; no Cal.com URL appears in the HTML.

## Privacy model

Normal browsing sends nothing to Macks. The discovery guide runs entirely in the
visitor's browser: answers are never submitted, stored, or attached to the booking link.
The guide asks no contact details. The only outbound navigation is to Cal.com. No
analytics, fonts, or icon CDNs are loaded.
Any change to this needs an explicit decision and an update to this section.

## Content and brand assets

- Production brand set: `public/assets/brand/` (from the official logo package v1.0.0;
  hashes verified against `brand/asset-manifest.json`).
- Masters: `brand/`.
- Copy sources and rules: `docs/product/`; per-claim tracing in `docs/product/content-source-audit.md`.
- The beam logo variant in `archive/` was rejected by the owner and must not be used.

## Local development

No tooling required. From the repository root:

```
python3 -m http.server 8000 --directory public
```

then open http://localhost:8000/. Asset paths are root-relative, so the page must be
served (opening the file directly from disk will not load styles or scripts).

## Testing

TODO (Phase 8). Checklist: `docs/development/architecture.md` will link to
`docs/development/testing.md` once written. Widths to verify: 320, 375, 768, 1024, 1440.

## Deployment, DNS, and domain notes

TODO (Phase 11). See `docs/deployment/deployment.md` for what is already known.

## Launch checklist

TODO (Phase 11). Must include: remove `noindex, nofollow`; confirm booking destination;
confirm canonical domain and routing against the existing application; verify favicon
and manifest paths on the chosen host.
