# Architecture

Status: current as of Phase 4 (2026-09-23). Sections marked TODO are completed later.

## Chosen stack

Static HTML, CSS, and JavaScript. No framework, no package manager, no build step.
Reason: one page, one interactive component (the discovery guide), one small demo planned
for Phase 5. Tooling would add dependencies and deploy complexity without benefit. Revisit
only if the site grows to several pages with shared components.

## Layout

```
public/                      deploy root; only this is served
  index.html                 markup only: no inline styles or scripts
  site.webmanifest           web app manifest (icons under /assets/brand/)
  assets/css/main.css        all styles
  assets/js/config.js        BOOKING_URL, SITE_URL (single source of truth)
  assets/js/main.js          general page behavior (booking link wiring)
  assets/js/guide.js         discovery guide
  assets/brand/              production brand set
brand/                       logo masters, not deployed
docs/                        this documentation
archive/                     migration safety, removed in Phase 10
```

Every path in the HTML is root-relative (`/assets/...`), so the site must be served from
the root of a host or a local server pointed at `public/`. Opening `index.html` from disk
will not resolve the assets.

## CSS organization (`assets/css/main.css`)

Numbered sections: tokens, base, typography, buttons, header (with section nav shown from
768px), hero, content sections (cards, the seven-step flow, process steps, final CTA
panel), discovery guide, footer, responsive, reduced motion. All colors, type sizes, spacing, widths, radii, and the
focus ring are custom properties on `:root`. Rules use tokens only; no hex values appear
below the token block. The visual direction is dark graphite backgrounds, a sage accent
(`--color-accent`, from the logo), neutral text, and restrained borders. Breakpoints:
560px (narrow gutter, full-width buttons, 104px hero mark, tighter hero spacing), 640px
(two-column cards), 760px (hero stacks, mark above copy), 768px (nav, flow as four columns
over two rows with in-row connectors, three-column steps, two-column footer), 1024px
(three-column problem cards).

Phase 7 responsive changes (2026-09-23), all CSS except one added link:
- Mobile hero mark reduced from 260px to 104px below 560px; order unchanged.
- One compact booking link (secondary button, `data-booking-link`) after the
  connected-systems section.
- Connected-systems flow uses a 4 + 3 grid from 768px instead of seven columns from
  1024px. `prefers-reduced-motion`
disables smooth scrolling and button transitions.

## JavaScript responsibilities

| File | Does | Never does |
|---|---|---|
| `config.js` | Defines frozen `window.MACKS_CONFIG` with `BOOKING_URL` and `SITE_URL`. | anything else |
| `main.js` | On DOM ready, sets `href` of every `[data-booking-link]` to `BOOKING_URL` after validating it is a parseable https URL. If invalid or missing: logs a console error, removes `href`, sets `aria-disabled`, appends "(unavailable)" to the label. | network requests, analytics |
| `guide.js` | Runs the discovery guide: shows one `fieldset.step` at a time, validates single-choice steps, moves focus to the step legend, updates progress label and track, builds a plain-text summary, copies it via the Clipboard API with a select-text fallback. | storage, fetch, XHR, beacons, form submission, collecting contact details |

Scripts load at the end of `<body>` in the order config, main, guide. Booking links (seven: header, hero, after connected systems, process, guide review, final CTA, footer) have
`href="#"` in markup and depend on JavaScript; the `<noscript>` note says so.

## Booking configuration

`MACKS_CONFIG.BOOKING_URL` is the only place the booking destination exists. The markup
carries `data-booking-link` on the seven booking links (header, hero, after connected systems,
process, guide review, final CTA, footer).
To change the destination, edit `config.js` only. `booking.macksstudios.org` has no DNS
record and must not be used until that changes.

## Discovery guide state model

- `currentStep` indexes the visible step. Steps: situation, friction, starting, help; each
  single choice and required to advance. The last step also has an optional notes field.
- Summary lines: Situation, Where it hurts most, Starting point, Looking for, and Notes
  only when provided.
- Progress label "Question n of N" is `aria-live="polite"`; the track is decorative.
- Validation error is a `role="alert"` paragraph; focus returns to the first option.
- On review: form hidden, summary built from the DOM, focus moved to the review heading.
- "Edit answers" returns to the last step with answers intact.
- Answers exist only in the DOM while the page is open. Nothing is stored or sent.

## Brand asset paths

| Use | Path |
|---|---|
| Header and hero mark | `/assets/brand/logo-mark.svg` (1600×1200 viewBox, cropped square with `object-fit: cover`) |
| Favicons | `/assets/brand/favicon.svg`, `favicon-32x32.png`, `favicon.ico` |
| Apple touch icon | `/assets/brand/apple-touch-icon.png` |
| App icons | referenced from `/site.webmanifest` |

Hashes of these files match `brand/asset-manifest.json`.

## Privacy and network behavior

Loading the page requests only first-party files: the HTML, one stylesheet, three scripts,
the logo SVG, the manifest, and favicons. No fonts, icon libraries, analytics, or pixels.
The only third-party navigation is the booking link to Cal.com, which happens when the
visitor activates it. Guide answers are not attached to that link. Verified in Phase 4 by
logging every network request during a full guide walk-through.

## Relationship to the live application

macksstudios.org is currently served by a separate React application (Vercel) that also
contains client-system routes. This repository does not touch it. Which application
answers the root domain is decided in Phase 11.

## Testing (TODO, Phase 8)

Phase 4 used headless Chrome over the DevTools Protocol to render at 320, 375, 768, 1024,
and 1440 px, compare element positions against a baseline, walk the guide, and log network
requests. The scripts are not yet in the repository; Phase 8 decides whether to keep them
under `tests/`.
