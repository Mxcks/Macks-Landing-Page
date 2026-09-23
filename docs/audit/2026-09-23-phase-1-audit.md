# Macks Studios public website – Phase 1 audit

Date: 2026-09-23. Auditor: Claude (Fable 5.1), working as repository maintainer. Owner
decisions recorded at the end were given on the same day and govern Phases 2 and 3.

This is the record of the project as it was supplied, before any restructuring. Paths
under "Current" refer to the original flat folder; the same files now sit unchanged in
`archive/phase-1-originals/`.

## A. Repository summary

The supplied folder was not a git repository. It held eight loose files and no
directories: two HTML pages, two ZIP archives, and four logo images. No README, no build
tooling, no tests, no `.gitignore`, no client-management code. No material from ASSESS
FITNESS, SHIVWORKS, or any other client was present.

The live macksstudios.org is a third implementation not present in the folder: a React
single-page application on Vercel titled "Studios Foundation", with `/login`, `/signup`,
`/start`, `/foundation/reserve` routes, a Reserve → Map → Confirm → Build → Launch
process, and pricing copy ($4,500 starting price, $1,000 reservation). It contains no
Cal.com links. It appears to merge the public marketing site with the client system.

## B. File classification

| Path (original) | Class | Notes |
|---|---|---|
| `index.html` | A PRODUCTION | Authoritative base. Self-contained, no external requests. Contains a 27 KB base64 JPEG of the mark. Carries `noindex, nofollow`. |
| `studio-landing-v1.1-magic-ui.html` | D REFERENCE | Google Fonts, Lucide from unpkg, hotlinks `macksstudios.org/favicon.svg`, design-only inquiry form, fake payment records, booking subdomain with no DNS. |
| `macks-studios-logo-mark.png` | H DUPLICATE | Byte-identical (SHA-256 `1504210c…`) to `source/macks-studios-mark-source-adjusted.png` in the logo package. |
| `macks-studios-circle-logo.png` | H DUPLICATE (near) | 1254² opaque mark on dark with shadows, 920 KB. Package `backgrounds/` covers this use. |
| `macks-logo-square-1254-beam.png` | K UNCERTAIN → rejected by owner | Mark with an added horizontal beam. Not in the package; Max did not like it. Never a production asset. |
| `photo_2026-09-23_10-25-43.jpg` | H DUPLICATE (near) | Chat-export filename. Color mark on pure white, JPEG. Package `color-on-light` covers this at higher quality. |
| `macks-studios-logo-package-v1.zip` | F MIGRATION INPUT (contains B, C, E) | 120 generated files, manifest verified, zero warnings. |
| `content-resources-for-developer.zip` | F MIGRATION INPUT (contains C, E, H) | 7 generic frameworks, one Macks strategy doc, one HTML hub duplicating both. |

## C. Product model

Source-supported: Macks maps what a business already has, identifies fitting
opportunities, and shapes a Studio foundation to build from; a website may be part of it.
Public process is Discovery → Foundation Map → Proposal. Supporting internal concepts:
Presence Package, Product Suggestion Map, Essential Platforms, Opportunity Stack. Example
connected capabilities: Inquiries, Booking, Payments. Content has one job: turn strangers
into discovery bookings. Voice is plainspoken, direct, warm. Arlington, Texas. Booking on
Cal.com. The content package README says "Max's seven business systems" are the backbone;
they are not defined anywhere supplied.

Interpretation (not source-supported): the four supporting concepts are internal
deliverable names; present them as one Studio Foundation section in plain language. The
live site's pricing and five-step flow belong to the client system.

## D. Current public-site architecture

`index.html` is one static file: inline CSS with hard-coded colors, no external requests,
system font stack (Inter named but never loaded). Sections: header, hero, five-step
discovery guide, footer. Four booking links hard-coded to the Cal.com URL (header, hero, guide review, footer). The guide keeps
state in the browser, builds a copyable summary, never submits. Step 5 collects name,
business, and email into that summary. Accent is sage (#a8c4b0), matching the logo.

## E. Reference material analysis

Logo package: extract the `web/` favicon and icon set plus the color mark SVG for
production; retain source PNG, eight SVGs, print files, README, and manifest as masters;
52 transparent PNG sizes, 8 WebPs, 24 opaque backgrounds, 4 previews, and the Python build
tool (references a Windows `E:/` path in another repo) are redundant for the website. The
README mentions a `public/…transparent.png` that does not exist in the ZIP. Raw ZIP:
ARCHIVE outside the website repository after verified extraction.

Content package: the strategy doc holds unique voice rules and the conversion principle
(keep, summarized), plus a Reddit handle and an internal naming rule (do not carry over).
Only `landing-page-anatomy` and `pas` inform this page. The HTML hub duplicates the
markdown. Raw ZIP: DELETE after extraction; its source of truth is the private strategy
repository.

## F. Brand analysis

Official mark: seven-bar sage gradient on dark graphite, no wordmark. Recommended web set:
`logo-mark.svg`, `favicon.svg`, `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`,
`icon-192x192.png`, `icon-512x512.png`, `icon-maskable-512x512.png`, plus
`site.webmanifest`. No 1200×630 social image exists; none will be invented.

## G. Content model

See `docs/product/public-site-content-model.md`.

## H. Target repository tree

Static HTML, CSS, and JS, no build step, `public/` as deploy root:

```
/
├── README.md
├── .gitignore
├── public/            deploy root: index.html, site.webmanifest, assets/{css,js,brand}
├── brand/             masters, not deployed
├── docs/              product, development, deployment, audit
└── archive/           temporary migration safety, removed in Phase 10
```

## I. Migration map

| Original | Future | After migration |
|---|---|---|
| `index.html` | `public/index.html`, later split into CSS/JS files | KEEP |
| base64 JPEG inside `index.html` | replaced by `assets/brand/logo-mark.svg` | DELETE |
| `studio-landing-v1.1-magic-ui.html` | concepts into page; copy into content model doc | DELETE after Phase 8 |
| `macks-studios-logo-mark.png` | already `brand/source/` | DELETE |
| `macks-studios-circle-logo.png` | none | ARCHIVE |
| `macks-logo-square-1254-beam.png` | none (rejected) | ARCHIVE |
| `photo_2026-09-23_10-25-43.jpg` | none | DELETE |
| logo ZIP web set + color mark SVG | `public/assets/brand/` | KEEP |
| logo ZIP masters | `brand/` | KEEP |
| logo ZIP redundant exports | none | DELETE (reproducible from SVG) |
| logo ZIP itself | business file storage | ARCHIVE |
| content ZIP strategy doc + 2 frameworks | `docs/product/content-guidelines.md` | DELETE after extraction |
| content ZIP remainder | none | DELETE |

## J. Public page structure

Header → Hero (with connected-system visual) → Does this sound familiar → What a Studio
foundation is → How it works (01/02/03) → Optional guide → Final CTA → Footer. Removed:
fake form, fake payment ledger, opportunity count, Google Fonts, Lucide CDN, hotlinked
favicon.

## K. Client-system boundary

This repository is the public site only. The React application keeps its own repository.
Shared surface is the brand asset set and design tokens, copied not packaged. No monorepo.
Domain routing is a Phase 11 decision.

## L. Risk register

- `booking.macksstudios.org` has no DNS record; Cal.com URL returns 200.
- Live-site divergence: pricing, five-step process, "Studios Foundation" naming.
- Accent color: brief said orange, logo and index are sage.
- Unverified claims in the prototype: "200+ opportunities", "10 minute session", "$150 /
  $500 Paid".
- Guide collected name and email into a copy-only summary.
- Prototype dependencies leak visitor IPs to three third parties.
- `noindex` set on `index.html`; must be removed deliberately at launch.
- Base64 blob is 48 percent of `index.html` by bytes.
- No version control existed.
- Secrets: none found. Strategy doc contains a personal handle; kept out of this repo.

## M. Cleanup manifest

Maintained separately in `cleanup-manifest.md`.

## N. Implementation plan

Phase 2 foundation → 3 assets → 4 structure → 5 content → 6 guide → 7 polish → 8
verification → 9/10 cleanup → 11 deployment prep.

## Owner decisions (2026-09-23)

1. Sage is the brand accent; no orange as a second identity. Logo unchanged.
2. Beam logo variant rejected; archived, never production.
3. Live-site pricing, reservation, five-step flow, login/signup are not imported. Public
   process stays Discovery → Foundation Map → Proposal.
4. Guide drops name, business, and email. Remains optional and browser-only.
5. `BOOKING_URL` = Cal.com Studio Discovery, configured in one place.
   `booking.macksstudios.org` is not production-ready.
6. Hard boundary: this repo is the public website; no monorepo; no changes to the live
   application; routing decided at deployment.
