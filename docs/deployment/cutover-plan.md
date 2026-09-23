# Cutover plan for macksstudios.org

Status: **prepared, not executed, blocked** (2026-09-23). No DNS, hosting, or live-site
change has been made. Max has approved the domain swap in principle, conditional on the
old flow being reconciled first.

## 1. Current state (public DNS, read-only lookup 2026-09-23)

Nameservers: Namecheap (`dns1/dns2.registrar-servers.com`).

| Name | Type | TTL | Value | Serves |
|---|---|---|---|---|
| `macksstudios.org` | A | 1799 | `216.150.1.1` (Vercel) | live React app built from `Mxcks/branching-builder` |
| `www.macksstudios.org` | CNAME | 899 | `a4042c443c1ac505.vercel-dns-017.com.` (Vercel) | 308 redirect to the apex |
| `app.`, `client.`, `portal.` | none | | | nothing |
| `booking.macksstudios.org` | none | | | nothing (never use) |
| `macksstudios.org` | MX | 1799 | `mx1.improvmx.com` (10), `mx2.improvmx.com` (20) | email forwarding |
| `macksstudios.org` | TXT | 1799 | SPF (registrar forwarding + ImprovMX) | email |
| `macksstudios.org` | TXT | 1799 | HubSpot developer verification | HubSpot |
| `macksstudios.org` | TXT | 1799 | Google site verification | Google |
| `_dmarc.macksstudios.org` | TXT | 300 | DMARC `p=none` | email |

Public lookups cannot see records Namecheap hides behind URL redirects or private
records. Suzuki must confirm this table in the Namecheap Advanced DNS panel before any
change.

## 2. Applications involved

| System | Source | Deployed at | Domain dependency found |
|---|---|---|---|
| New landing page | this repository, `public/` | not deployed | none; all paths root-relative, `SITE_URL` placeholder in `config.js` |
| Live public app (Studios Foundation, reserve, login, signup) | `Mxcks/branching-builder` | Vercel, apex + www | **unknown**: source not in this workspace |
| Client-management system | `hectorr-st/macks-client-management-system` (local `Client management System`) | **unknown**: no Vercel project file, no production URL in code | Supabase `site_url` is `http://localhost:3000`; no absolute macksstudios.org URLs, no cookie domain, no Stripe callback URLs in code |

## 3. Proposed post-cutover architecture (needs decision)

Candidate, not chosen:

| Host | Would serve |
|---|---|
| `macksstudios.org` | new landing page (`public/` as a static site) |
| `www.macksstudios.org` | 308 redirect to the apex |
| `app.macksstudios.org` (or similar) | the existing React app, so reserve, login, signup, and the $4,500 / $1,000 flow keep working |
| client-management system | its own host, decided separately |

This is only safe if the live React app can run under a new host. That depends on its
Supabase auth redirect list, any OAuth callbacks, Stripe success, cancel, and webhook
URLs, email links, and hard-coded absolute URLs. None of that can be checked without the
`Mxcks/branching-builder` source and its Vercel and Supabase settings.

## 4. Domain-sensitive dependencies

| Item | System | Classification |
|---|---|---|
| Landing page asset paths, booking URL | landing page | NO CHANGE |
| Landing page canonical, Open Graph url | landing page | CHANGE REQUIRED AT CUTOVER (see section 6) |
| Supabase auth site URL and redirect allowlist | live React app | UNKNOWN / BLOCKER |
| Magic links, auth emails | live React app | UNKNOWN / BLOCKER |
| OAuth callbacks | live React app | UNKNOWN / BLOCKER |
| Stripe checkout success/cancel, webhook endpoint (for the $1,000 reservation, if used) | live React app | UNKNOWN / BLOCKER |
| Cookie domain, CORS, trusted origins | live React app | UNKNOWN / BLOCKER |
| Supabase `site_url` / redirects | client-management system | VERIFY MANUALLY: repo config is localhost only; hosted Supabase settings not visible |
| Email (ImprovMX MX, SPF, DMARC) | domain | NO CHANGE |
| HubSpot and Google verification TXT | domain | NO CHANGE |

## 5. DNS change plan (to fill in once the host is chosen; do not guess values)

Records that would change:
- apex `A` (and any `ALIAS`/`AAAA`) for `macksstudios.org`: from the current Vercel
  project to the landing page host, using the values that host provides;
- `www` CNAME: to the landing page host, or kept on Vercel if the landing page is
  deployed to Vercel as a new project (then only the Vercel domain assignment moves and
  DNS may not change at all);
- new `app` (or chosen name) CNAME: to wherever the existing React app is re-homed.

Records that must not change: MX, SPF, DMARC, HubSpot TXT, Google TXT, NS.

Before cutover:
1. Lower TTL on apex and `www` to 300 at least one old-TTL period (30 minutes) ahead.
2. Screenshot the full Namecheap Advanced DNS table.
3. Deploy the landing page to its host and verify on the host's preview URL.
4. If the React app moves, bring up its new host and update its auth and payment URLs
   first, and verify login and reservation there.

Rollback: restore the screenshotted apex and `www` values (or move the Vercel domain
assignment back). With TTL at 300, recovery takes about five minutes.

## 6. SEO cutover changes (apply only after the architecture is final)

Required:
- remove `<meta name="robots" content="noindex, nofollow" />` from `public/index.html`;
- add `<link rel="canonical" href="https://macksstudios.org/" />` (matches `SITE_URL`).

Recommended:
- `og:title` "Macks Studios | Make the next move clearer";
- `og:description` reusing the meta description;
- `og:url` `https://macksstudios.org/`, `og:type` `website`;
- `public/robots.txt` allowing all and pointing at a sitemap;
- `public/sitemap.xml` with the single URL.

Optional: `og:image`, only once a 1200×630 image is approved.

## 7. Mobile Safari (manual check required)

Not tested; no Safari is available in the development environment. Check on a real
iPhone before or immediately after cutover:

- [ ] root page loads, no sideways scrolling
- [ ] logo renders; headline reads "Make the next move clearer."
- [ ] hero booking button is tappable and opens Cal.com Studio Discovery
- [ ] guide: forward, back, review all work
- [ ] Copy summary copies, or shows the select-text fallback
- [ ] footer renders; no obvious broken layout

## 8. Post-cutover check for Maren

- [ ] macksstudios.org loads the new page
- [ ] headline: "Make the next move clearer."
- [ ] offer reads "Studio Foundation" (singular)
- [ ] deliverable reads "Foundation Map"
- [ ] process reads Discovery → Foundation Map → Proposal
- [ ] a booking button opens cal.com/macks-studios/studio-discovery
- [ ] no Foundation Map price anywhere on the page
- [ ] $4,500 / $1,000 still shown where the existing app uses them
- [ ] no "Studios Foundation" left in public copy for the current offer
- [ ] client application still reachable at its agreed address
- [ ] page works on a phone

## 9. First commit plan

Include: `.gitignore`, `README.md`, `public/`, `brand/`, `docs/`, `archive/`.
Exclude: nothing else exists in the tree; test screenshots and browser profiles live
outside the repository.
Archive: committed as-is so the originals are in history before any cleanup.
Suggested message: `feat: Macks Studios landing page ready for cutover review`.

## 10. Phase 10 update: live-app dependencies (2026-09-23)

The live app's source is now audited (`branching-builder-audit.md`). The UNKNOWN rows in
section 4 resolve as follows.

| Dependency | Finding | Classification |
|---|---|---|
| Supabase database webhooks | `private.app_config` holds four URLs on the apex: `/api/public/{leads,signups,project-requests,intakes}/notify` (migrations `20260704053000`, `20260731235900`). pg_net posts will not reach the app once the apex serves the static page. | **CHANGE REQUIRED** (production DB update, needs approval) |
| `PUBLIC_SITE_URL` (Vercel env) | Used for portal invite links, admin invite redirect to `/login`, message links, Telegram links, HubSpot pageUri. Falls back to `https://macksstudios.org`. | **CHANGE REQUIRED** (Vercel env) |
| Supabase Auth Site URL and redirect allowlist | Code uses `window.location.origin` for signup, magic link, and password reset, so it follows the host. The dashboard allowlist and Site URL are not visible here. | **MANUAL VERIFICATION** (Supabase dashboard) |
| Supabase auth email templates | May use `{{ .SiteURL }}`. Not visible here. | **MANUAL VERIFICATION** |
| Cloudflare Turnstile | Site key is bound to allowed hostnames. | **MANUAL VERIFICATION** (add app host) |
| Hard-coded canonical, og:url, sitemap base in app routes | `https://macksstudios.org` in `index.tsx`, `explore.tsx`, `about.studio.tsx`, `foundation.*.tsx`, `sitemap[.]xml.ts`. They would point at pages the apex no longer serves. | **CHANGE REQUIRED** (small code change or noindex on the app host) |
| Links already sent and bookmarked (`/login`, `/portal/…`, `/foundation/reserve`, `/signup`) | Would 404 on the static apex. | **CHANGE REQUIRED** (path redirects on the apex host) |
| Stripe | Not integrated. | NO CHANGE |
| Cookie domain, CORS, trusted origins | None configured; Supabase session is per origin. Users will need to sign in again on the new host. | NO CHANGE (expect one re-login) |
| `intake/schema.ts` `$id` URL | Identifier, not fetched. | NO CHANGE |
| PostHog, Sentry | Host-agnostic keys; any allowed-domain lists are in their dashboards. | MANUAL VERIFICATION (low risk) |
| `vercel.json` booking redirect | Only active if `booking.` gets DNS. | NO CHANGE |

### Is `app.macksstudios.org` safe?

Technically yes, with manual configuration. The app has no apex-only logic, no cookie
domain, and no Stripe callbacks. It is **not** safe until the four CHANGE REQUIRED items
and three MANUAL checks above are done, in the order below.

### Recommended architecture

| Host | Serves | How |
|---|---|---|
| `macksstudios.org` | new landing page | new Vercel project from this repo, output directory `public/`, no build step |
| `www.macksstudios.org` | 308 to the apex | domain assigned to the landing project |
| `app.macksstudios.org` | existing branching-builder app | add as a domain on the existing Vercel project |
| apex paths `/login`, `/signup`, `/start`, `/auth`, `/reset-password`, `/portal/*`, `/admin/*`, `/messages`, `/settings`, `/account`, `/waiting-room`, `/foundation/*`, `/intake/*`, `/explore`, `/about/*`, `/brief`, `/guild`, `/ship`, `/developer`, `/request-project`, `/api/*` | redirect to the same path on `app.` | `vercel.json` redirects in the landing project |

The `/api/*` redirect is a fallback only; database webhooks must be updated directly,
because pg_net may not follow redirects.

### DNS changes (plan only)

If both projects stay on Vercel, the apex `A 216.150.1.1` and `www` CNAME can stay as
they are; only the Vercel domain assignments move. One record is added:

| Name | Type | Value | TTL |
|---|---|---|---|
| `app` | CNAME | the target Vercel shows when `app.macksstudios.org` is added to the app project | 300 |

Unchanged: apex A, www CNAME, MX (ImprovMX), SPF, DMARC, HubSpot TXT, Google TXT, NS.

### Cutover order

1. Add `app.macksstudios.org` to the app's Vercel project and create the `app` CNAME. Verify the app loads there.
2. Supabase dashboard: add `https://app.macksstudios.org/**` to redirect URLs, keep the apex entries during transition, and decide the Site URL.
3. Cloudflare Turnstile: add `app.macksstudios.org` to the widget's hostnames.
4. Vercel env on the app project: set `PUBLIC_SITE_URL=https://app.macksstudios.org`, redeploy.
5. Production DB: update the four `private.app_config` webhook URLs to the app host (migration or SQL, with approval). Test one notification.
6. Test on `app.`: signup, login, password reset, magic link, portal invite, reserve form, admin notification.
7. Create the landing Vercel project, with the redirects above and the SEO changes from section 6.
8. Move `macksstudios.org` and `www` from the app project to the landing project.
9. Maren's checklist (section 8) and the mobile Safari check (section 7).

Rollback: move the apex and `www` domain assignments back to the app project. If step 5
was applied, re-run the old `private.app_config` values. Everything else is additive.

### App code changes needed at cutover (plan only)

- Point hard-coded `SITE_URL` / `BASE_URL` constants at the app host, or read them from
  `PUBLIC_SITE_URL`.
- Decide whether the app's marketing pages stay indexable on `app.` or get `noindex`.
- Deploy the reviewed `reconcile/studio-foundation-singular` branch.
