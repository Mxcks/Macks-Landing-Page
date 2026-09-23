# Deployment

Status: NOT DEPLOYED. The full cutover plan, current DNS, and blockers are in
`cutover-plan.md`. Nothing in this repository is live. No hosting, DNS, or domain
changes have been made or are implied by any file here.

## Known so far

| Item | Value |
|---|---|
| Build command | none (static) |
| Output / publish directory | `public/` |
| Environment variables | none |
| Booking URL | `MACKS_CONFIG.BOOKING_URL` in `public/assets/js/config.js` |
| Canonical domain (intended) | https://macksstudios.org |
| Current holder of that domain | separate React application on Vercel |
| `booking.macksstudios.org` | no DNS record as of 2026-09-23; not usable |

## To be decided in Phase 11

- hosting provider for the static site;
- how the root domain is routed between this site and the existing application;
- DNS records (not invented until the provider is chosen);
- removal of `noindex, nofollow` from `public/index.html`;
- rollback strategy.

## Metadata checklist for cutover (from Phase 8)

| Item | State now | Needed at cutover |
|---|---|---|
| `noindex, nofollow` | present (intended) | **Required:** remove from `public/index.html` |
| `<link rel="canonical">` | missing | **Required:** add, using `SITE_URL` once the domain is final |
| Open Graph title, description, url | missing | Recommended: reuse the title and meta description |
| Open Graph image | missing, no approved asset | Optional until a 1200x630 image is approved |
| `robots.txt`, `sitemap.xml` | missing | Recommended for a one-page site; add with the host decision |
| title, description, viewport, theme-color, icons, manifest | present and valid | none |

Lighthouse SEO is 63 only because of the intentional `noindex`; no other SEO audit fails.
Cache headers and compression are a hosting setting, not a code change.
