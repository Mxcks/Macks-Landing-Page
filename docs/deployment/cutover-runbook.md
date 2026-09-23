# Cutover runbook: macksstudios.org → landing page, app.macksstudios.org → existing app

Status: **prepared, not executed** (2026-09-23). Owner-approved architecture:

| Host | Serves |
|---|---|
| `macksstudios.org` | standalone landing page (this repository, `public/`) |
| `www.macksstudios.org` | 308 to the apex |
| `app.macksstudios.org` | existing `Mxcks/branching-builder` application |
| `booking.macksstudios.org` | optional; `vercel.json` in branching-builder already redirects it to Cal.com if DNS is added |

Nothing below has been run. Every production step needs Suzuki at the console.

## 1. Manual verification checklist (Suzuki, before any change)

### Vercel (branching-builder project)
- [ ] Record the commit deployed to Production. Expected `476ed3a` (`main`); the live homepage text matches it.
- [ ] Record Production domains (expected: `macksstudios.org`, `www.macksstudios.org`).
- [ ] Record environment variable names and scopes (Production / Preview). Values not needed.
- [ ] Record the current `PUBLIC_SITE_URL` value (expected unset or `https://macksstudios.org`).
- [ ] Confirm `app.macksstudios.org` can be added to this project; note the DNS target Vercel shows.

### Supabase Auth (project used by branching-builder)
- [ ] Site URL (screenshot).
- [ ] Redirect URL allowlist (screenshot).
- [ ] Email templates: confirm signup, magic link, reset password, invite. Note any hard-coded `macksstudios.org` or `{{ .SiteURL }}`.
- [ ] Invitation redirect: the app sends `${PUBLIC_SITE_URL}/portal` and `${PUBLIC_SITE_URL}/login`.
- [ ] Password reset and magic link use `window.location.origin` in code, so they follow the host automatically, but only if the host is allowlisted.

### Supabase database
- [ ] Run and record (read-only):
  ```sql
  select key, value from private.app_config
  where key in ('lead_webhook_url','signup_webhook_url','project_request_webhook_url','intake_webhook_url');
  ```
  Expected values, from migrations `20260704053000` and `20260731235900`:
  `https://macksstudios.org/api/public/{leads,signups,project-requests,intakes}/notify`.
- [ ] Check for any other `macksstudios.org` value in `private.app_config`.

### Cloudflare Turnstile
- [ ] Record the widget's allowed hostnames. `app.macksstudios.org` must be added **before** the app is used there, or `/start` and `/signup` cannot pass the challenge.

### PostHog and Sentry
- [ ] PostHog: check "Authorized URLs" and any toolbar domain list; add the app host if restricted.
- [ ] Sentry: check "Allowed Domains" on the project; add the app host if set.

### Namecheap
- [ ] Screenshot the full Advanced DNS table (host, type, value, TTL), including any URL-redirect records public lookups cannot see.
- [ ] Expected today: apex `A 216.150.1.1`, `www CNAME …vercel-dns-017.com`, MX ImprovMX x2, SPF TXT, DMARC TXT, HubSpot TXT, Google TXT.
- [ ] Record needed: **one new `CNAME app` → the target Vercel shows**. Nothing else changes.
- [ ] Do not touch MX, SPF, DMARC, HubSpot, Google, or nameservers.

## 2. Database change plan (SQL prepared, NOT executed)

```sql
-- Run only in step 5 of section 5, after app.macksstudios.org serves the app.
begin;
update private.app_config set value = 'https://app.macksstudios.org/api/public/leads/notify'            where key = 'lead_webhook_url';
update private.app_config set value = 'https://app.macksstudios.org/api/public/signups/notify'          where key = 'signup_webhook_url';
update private.app_config set value = 'https://app.macksstudios.org/api/public/project-requests/notify' where key = 'project_request_webhook_url';
update private.app_config set value = 'https://app.macksstudios.org/api/public/intakes/notify'          where key = 'intake_webhook_url';
select key, value from private.app_config where key like '%webhook_url';
commit;
```

Rollback SQL is the same four statements with `https://macksstudios.org/…`. Ideally also
commit this as a migration in branching-builder so the repository matches production.

## 3. Old-path redirect map (landing page Vercel project, apex → app)

All redirects are 308, keep the path and query string, and target
`https://app.macksstudios.org/<same path>`.

| Apex path | Class | Why |
|---|---|---|
| `/login`, `/signup`, `/reset-password`, `/auth` | REQUIRED | sign-in and auth emails already sent |
| `/portal`, `/portal/:path*` | REQUIRED | client portal and invite links |
| `/admin`, `/admin/:path*` | REQUIRED | admin console |
| `/messages`, `/settings`, `/account`, `/waiting-room` | REQUIRED | signed-in pages, email links |
| `/start` | REQUIRED | account-creation intake, signup email redirect |
| `/foundation/reserve`, `/foundation/waitlist` | REQUIRED | build-slot reservation flow |
| `/intake`, `/intake/:path*`, `/request-project` | REQUIRED | intake forms |
| `/api/:path*` | REQUIRED (fallback only) | database webhooks are updated directly because pg_net may not follow redirects |
| `/explore`, `/about/studio`, `/brief`, `/guild`, `/ship`, `/developer` | RECOMMENDED | public app pages that may be linked or indexed |
| `/sitemap.xml` | NOT NEEDED | the landing page serves its own |
| `/`, `/assets/:path*`, `/site.webmanifest`, `/robots.txt`, `/favicon.ico` | NOT NEEDED, must not redirect | landing page's own files |

The landing page uses only `/`, `/assets/…`, `/site.webmanifest`, and the planned
`/robots.txt` and `/sitemap.xml`, so none of the rules above can capture its files.

Draft `vercel.json` for the landing project (not created yet):

```json
{
  "outputDirectory": "public",
  "redirects": [
    { "source": "/:p(login|signup|reset-password|auth|start|messages|settings|account|waiting-room|request-project|explore|brief|guild|ship|developer)", "destination": "https://app.macksstudios.org/:p", "permanent": true },
    { "source": "/:p(portal|admin|intake|foundation|about|api)/:rest*", "destination": "https://app.macksstudios.org/:p/:rest*", "permanent": true },
    { "source": "/:p(portal|admin|intake)", "destination": "https://app.macksstudios.org/:p", "permanent": true }
  ]
}
```

## 4. SEO cutover

Landing page, applied in step 8 only:
- remove `<meta name="robots" content="noindex, nofollow" />`;
- add `<link rel="canonical" href="https://macksstudios.org/" />`;
- add `og:type` `website`, `og:url` `https://macksstudios.org/`, `og:title`
  "Macks Studios | Make the next move clearer", `og:description` = the meta description;
- add `public/robots.txt` (`User-agent: *`, `Allow: /`, `Sitemap: https://macksstudios.org/sitemap.xml`);
- add `public/sitemap.xml` with the single URL `https://macksstudios.org/`;
- no `og:image` until one is approved.

branching-builder, hard-coded apex URLs to change for `app.`:
- `SITE_URL` in `src/routes/index.tsx`, `explore.tsx`, `foundation.reserve.tsx`, `foundation.waitlist.tsx`;
- `CANONICAL` and JSON-LD `url` in `src/routes/about.studio.tsx`;
- `BASE_URL` in `src/routes/sitemap[.]xml.ts`;
- fallback `"https://macksstudios.org"` in six server files (covered by setting `PUBLIC_SITE_URL`).
Recommended: derive them from `PUBLIC_SITE_URL`. Decide whether the app's marketing pages
stay indexable on `app.`; the landing page should be the only indexed homepage.

## 5. Cutover sequence

Pre-cutover
1. Complete section 1 and save every screenshot.
2. Lower TTL on the apex and `www` to 300 in Namecheap only if records will change (with both on Vercel they should not).
3. Baseline: on the live site, sign in, open the portal, submit nothing, and note the current behaviour.

App subdomain (the apex keeps serving the app throughout)
4. Merge and deploy the reconciliation branch to branching-builder `main` (after review).
5. Vercel: add `app.macksstudios.org` to the branching-builder project. Namecheap: add the `app` CNAME. Wait for SSL.
6. Supabase Auth: add `https://app.macksstudios.org/**` to redirects. Keep the apex entries.
7. Turnstile: add `app.macksstudios.org`.
8. PostHog and Sentry: add the host if restricted.
9. Vercel env: set `PUBLIC_SITE_URL=https://app.macksstudios.org`; redeploy.
10. Run the SQL in section 2. Submit one test intake from `app.` and confirm the admin notification arrives.
11. On `app.`: signup, email confirm, login, password reset, magic link, portal invite, `/foundation/reserve` (test entry only), admin console.

Landing page
12. First commit of the landing repository; push to its own GitHub repository.
13. Create a Vercel project for it: framework none, output `public/`, the `vercel.json` from section 3, and the SEO changes from section 4.
14. Verify on the Vercel preview URL: page, assets, booking link, guide.

Cutover
15. Vercel: remove `macksstudios.org` and `www.macksstudios.org` from branching-builder and add them to the landing project (apex primary, `www` redirecting).
16. Verify SSL on both, the landing page on the apex, `www` → apex, `/login` → `app.…/login`, `/portal/x` → `app.…/portal/x`, booking → Cal.com.
17. Supabase Site URL: set to `https://app.macksstudios.org` once everything passes.

Post-cutover
18. Maren's checklist (`cutover-plan.md` section 8).
19. Real iPhone Safari check (`cutover-plan.md` section 7).
20. Re-test auth, one notification, booking, and reservation on `app.`.
21. Watch Vercel logs and Sentry for 404s and auth errors for 24 hours.

## 6. Rollback

| Failure | Action |
|---|---|
| Landing page broken after step 15 | Move `macksstudios.org` and `www` back to the branching-builder project. The app is back on the apex within minutes; nothing in the app changed. |
| Auth fails on `app.` (steps 6–11) | Stop; the apex still serves the app. Fix the Supabase allowlist or email templates and retry. |
| Supabase links in emails point at the wrong host | Restore the Site URL and templates from the screenshots. |
| Turnstile fails on `app.` | Add the hostname; until then the apex still works. |
| Webhook notifications fail | Run the rollback SQL (apex URLs) while the apex still serves the app; after step 15, fix the app URLs instead of rolling back, because the apex no longer hosts the API. |
| Root redirects fail | Fix `vercel.json` in the landing project and redeploy; or roll back step 15. |

Data, pricing, and auth users live in Supabase and are never touched by domain moves.

## 7. Repository state for the app-subdomain migration (2026-09-23)

| Repository | Branch | Commit | State |
|---|---|---|---|
| `Mxcks/branching-builder` (renamed `macks-studios-lead-net`) | `reconcile/studio-foundation-singular` | `777f4d0` fix: align Studio Foundation public journey | pushed; not merged; `main` still `476ed3a` |
| same | `prepare/app-subdomain` (on top of `777f4d0`) | `5cd334e` chore: read public site URL from configuration | local only |
| landing page | `master` | `8fea12f` baseline, plus this docs commit | local only; **no remote configured** |
| landing page | `cutover/root-domain` | SEO tags, robots, sitemap, `vercel.json` redirects | local only; merge on cutover day |

Merging `reconcile/studio-foundation-singular` into `main` deploys to production on
Vercel. Do it as step 4 of section 5, after review.

`prepare/app-subdomain` makes canonical, Open Graph, and sitemap URLs follow
`VITE_PUBLIC_SITE_URL` / `PUBLIC_SITE_URL` (default `https://macksstudios.org`, so no
change until set). Set **both** variables to the same value: `VITE_` is baked in at build
time for client rendering, `PUBLIC_SITE_URL` is read at runtime by server code.

The landing redirect rules were tested with path-to-regexp 6.2.1 (Vercel's matcher):
26 app paths redirect with their path intact; `/`, `/assets/*`, `/site.webmanifest`,
`/robots.txt`, `/sitemap.xml`, `/favicon.ico`, bare `/about`, bare `/foundation`, and
look-alikes such as `/loginx` do not.

## 8. Production-setting changes (fill "current" from section 1 before acting)

No production value could be read from this machine (no Vercel CLI or login, no Supabase
CLI or link, no dashboard access). "Current" values marked *expected* come from code and
migrations and must be confirmed.

| # | Setting | Current | Proposed | Reason | Verify | Rollback |
|---|---|---|---|---|---|---|
| 1 | Vercel domains, branching-builder project | *expected* `macksstudios.org`, `www.macksstudios.org` | add `app.macksstudios.org` (keep existing) | serve the app on the subdomain | `https://app.macksstudios.org/` loads with valid SSL | remove the `app` domain |
| 2 | Namecheap DNS | no `app` record | `CNAME app` → value shown by Vercel in step 1, TTL 300 | point the subdomain at Vercel | `dig app.macksstudios.org` returns the Vercel target | delete the `app` record |
| 3 | Supabase Auth redirect allowlist | unknown | add `https://app.macksstudios.org/**`, keep apex entries | signup, magic link, reset, invites use the current origin | password reset and magic link from `app.` land on `app.` | remove the added entry |
| 4 | Supabase Auth Site URL | unknown (*expected* `https://macksstudios.org`) | `https://app.macksstudios.org`, **after** root cutover | default link host in auth emails | a fresh invite email links to `app.` | restore screenshot value |
| 5 | Supabase email templates | unknown | replace any hard-coded apex with `{{ .SiteURL }}` or `app.` | email links | send one of each template to a test inbox | restore screenshots |
| 6 | Turnstile allowed hostnames | unknown | add `app.macksstudios.org` | `/start` and `/signup` challenge | complete the challenge on `app.` | remove hostname |
| 7 | PostHog authorized URLs / Sentry allowed domains | unknown | add `app.macksstudios.org` if lists exist | analytics and error capture | event and test error appear | remove hostname |
| 8 | Vercel env `PUBLIC_SITE_URL` and `VITE_PUBLIC_SITE_URL` | unknown (*expected* unset) | both `https://app.macksstudios.org`, then redeploy | invite, message, Telegram links; canonical URLs (needs `prepare/app-subdomain` merged) | admin invite email links to `app.`; page source canonical on `app.` | restore previous values, redeploy |
| 9 | `private.app_config` webhook URLs (4) | *expected* `https://macksstudios.org/api/public/{leads,signups,project-requests,intakes}/notify` | same paths on `https://app.macksstudios.org` (SQL in section 2) | pg_net notifications must reach the app | one test intake triggers the admin notification | rollback SQL in section 2 |
| 10 | Vercel domains after cutover | apex and `www` on branching-builder | apex and `www` on the landing project | root-domain switch (next phase) | Maren's checklist | move domains back |

Explicit approval is required before rows 3–10 are changed, and row 9 is a production
database update.
