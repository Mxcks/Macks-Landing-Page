# Cleanup manifest

Status: NOTHING LISTED HERE HAS BEEN DELETED. Deletion happens only in Phase 10 after
Phase 8 verification and explicit owner approval. Update the "Approved" column when Max
signs off on each row.

KEEP = required or valuable in the active repository. ARCHIVE = not needed by runtime or
development but worth retaining outside this repository. DELETE = redundant, generated,
or reproducible.

## Archived originals (`archive/phase-1-originals/`)

| Path | Classification | Used by | Final action | Reason | Condition | Approved |
|---|---|---|---|---|---|---|
| `index.html` | PRODUCTION (superseded copy) | Phase 4 parity baseline | DELETE | restructured into `public/index.html`, `main.css`, `main.js`, `guide.js` in Phase 4; still the only unmodified copy until the first commit | after Phase 8 verification and first commit | no |
| `studio-landing-v1.1-magic-ui.html` | REFERENCE | Phase 4–5 (concept extraction) | DELETE | copy and concepts recorded in `docs/product/public-site-content-model.md` | after Phase 8 content-parity check | no |
| `macks-studios-logo-mark.png` | DUPLICATE | nothing | DELETE | byte-identical to `brand/source/macks-studios-mark-source-adjusted.png` (hash verified 2026-09-23) | now safe; waiting for approval | no |
| `macks-studios-circle-logo.png` | DUPLICATE (near) | nothing | ARCHIVE | package `backgrounds/` covers it; opaque, no web use | move to business file storage | no |
| `macks-logo-square-1254-beam.png` | REJECTED VARIANT | nothing | ARCHIVE | owner rejected the beam; must never ship | move to business file storage | no |
| `photo_2026-09-23_10-25-43.jpg` | DUPLICATE (near) | nothing | DELETE | package `color-on-light` exports are higher quality | after owner confirms it is not a newer approved export | no |
| `macks-studios-logo-package-v1.zip` | MIGRATION INPUT | Phase 3 (done) | ARCHIVE | all 120 files hash-verified; production set and masters extracted | move to business file storage | no |
| `content-resources-for-developer.zip` | MIGRATION INPUT | Phase 2 (done) | DELETE | durable guidance extracted to `docs/product/content-guidelines.md`; source of truth is the private strategy repo | after owner reviews the guidelines doc | no |

## Contents of the logo ZIP not copied into the repository

| Group | Files | Final action | Reason |
|---|---|---|---|
| `png/transparent/icon/`, `png/transparent/mark/` | 52 | DELETE (never copied) | reproducible from SVG masters |
| `webp/` | 8 | DELETE (never copied) | reproducible from SVG masters |
| `backgrounds/` | 24 | DELETE (never copied) | opaque presentation exports; reproducible |
| `previews/` | 4 | DELETE (never copied) | generated proofs |
| `tools/build_logo_package.py` | 1 | DELETE (never copied) | belongs to the brand-tooling repo; references a Windows path |
| `vector/icon/*.svg` (in `brand/`) | 4 | KEEP | small; the color one is identical to `favicon.svg` |
| `web/favicon-16x16.png`, `favicon-48x48.png`, `favicon-black.svg`, `favicon-white.svg`, `icon-maskable-1024x1024.png` | 5 | DELETE (never copied) | not referenced by the production head links or manifest |

## Contents of the content ZIP not copied into the repository

| Item | Final action | Reason |
|---|---|---|
| `content-frameworks-hub.html` | DELETE | JS-rendered duplicate of the markdown files |
| `frameworks/aida.md`, `content-pillars.md`, `content-repurposing.md`, `hook-value-cta.md`, `topic-clusters.md` | DELETE | generic, not about this page; remain in the private strategy repo |
| `frameworks/landing-page-anatomy.md`, `pas.md` | DELETE | summarized in `content-guidelines.md` |
| `macks-studios-content-strategy.md` | DELETE | durable parts summarized; channel/handle details intentionally excluded |
| `README.md` | DELETE | one line folded into `content-guidelines.md` |

## Inside production files (Phase 4 work)

| Item | Final action | Condition |
|---|---|---|
| base64 JPEG in `public/index.html` (`--mark-image`) | DONE (Phase 4) | removed; `assets/brand/logo-mark.svg` renders in its place. The original is preserved in `archive/phase-1-originals/index.html`. |
| hard-coded Cal.com URLs in `public/index.html` (4: header, hero, guide review, footer) | DONE (Phase 4) | replaced by `data-booking-link` wired from `MACKS_CONFIG.BOOKING_URL` |
| guide step 5 (name, business, email) | DONE (Phase 4) | removed per owner decision 4 |
| `noindex, nofollow` meta | DELETE | Phase 11 only, deliberately |

## Whole directories

| Path | Final action | Condition |
|---|---|---|
| `archive/` | DELETE | Phase 10, after every row above is approved and the repository is committed |

## Phase 8 cleanup proposal (2026-09-23)

Nothing below has been deleted. Each group needs Max's explicit approval first.

| Group | Proposal | Reason |
|---|---|---|
| `public/` (14 files) | KEEP | production site; every file is referenced and returns 200 |
| `brand/` (masters, manifest, README, templates) | KEEP | official masters; not deployed |
| `docs/` | KEEP | project knowledge; the Phase 1 audit is historical but small |
| `archive/phase-1-originals/macks-studios-logo-package-v1.zip` | KEEP IN ARCHIVE, then move to business file storage | only complete copy of all 120 exports |
| `archive/phase-1-originals/macks-studios-circle-logo.png` | KEEP IN ARCHIVE, then business storage | opaque presentation export |
| `archive/phase-1-originals/macks-logo-square-1254-beam.png` | DO NOT REMOVE without Max; move to business storage | rejected variant; keep as a record, never in `public/` |
| `archive/phase-1-originals/index.html` | SAFE TO REMOVE AFTER APPROVAL and first commit | superseded by `public/`; git will hold history |
| `archive/phase-1-originals/studio-landing-v1.1-magic-ui.html` | SAFE TO REMOVE AFTER APPROVAL | concepts and copy traced in `content-source-audit.md` |
| `archive/phase-1-originals/macks-studios-logo-mark.png` | SAFE TO REMOVE AFTER APPROVAL | byte-identical to `brand/source/` |
| `archive/phase-1-originals/photo_2026-09-23_10-25-43.jpg` | SAFE TO REMOVE AFTER APPROVAL | near-duplicate of package export |
| `archive/phase-1-originals/content-resources-for-developer.zip` | SAFE TO REMOVE AFTER APPROVAL | durable guidance extracted; source of truth is the private strategy repo |
| CSS tokens `--space-1`, `--text-body` | optional tidy-up | defined but unused; harmless |

Recommended order: make the first commit with `archive/` present, move the three
KEEP IN ARCHIVE / DO NOT REMOVE files to business storage, then remove `archive/`.

## Phase 9 status update (2026-09-23)

Owner decisions are final. No file has been removed. Everything in `archive/` stays
through the first commit and initial production verification. Items marked SAFE TO
REMOVE AFTER APPROVAL in the Phase 8 table now read **SAFE TO REMOVE AFTER APPROVAL AND
SUCCESSFUL CUTOVER**. The beam logo remains DO NOT REMOVE without Max.
