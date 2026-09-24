# Discovery guide submissions (Supabase)

Status (2026-09-23): implemented and tested locally against an isolated Supabase Postgres
+ PostgREST stack. **Not applied to any hosted Supabase project and not deployed.**
Sending is switched off in `public/assets/js/config.js` (empty values), so the site
currently behaves exactly as before.

## What it does

visitor answers four questions → reviews the summary → presses **Send my answers** →
one row is inserted into `public.guide_submissions` → success or failure is shown.

Nothing is sent while answering, reviewing, editing, or copying. The single request
happens only on that button press.

## Data model: `public.guide_submissions`

| Column | Why it exists |
|---|---|
| `id` uuid, PK | Generated in the browser per distinct answer set so that a retry after a lost response is stored once (server answers 409). Not stored in the browser, not reused across page loads, not a visitor identifier. |
| `created_at` timestamptz | When it was received. Server-set; visitors cannot supply it. |
| `guide_version` text | Which question set produced the answers. Only `2026-09-23` is accepted. |
| `source` text | Where the row came from. Only `landing-page-guide` is accepted. |
| `situation` | Q1 "Which of these sounds most like your business right now?" |
| `friction` | Q2 "Where does it cost you the most?" |
| `starting` | Q3 "What do you already have?" |
| `help` | Q4 "What would be most useful from a first conversation?" |
| `notes` | "Anything else worth knowing? (optional)". Trimmed; empty is stored as null; max 2000 characters. |

Answer columns accept only the exact option values in `public/index.html`, so stored
wording always matches the guide. Changing a question or option needs a new migration
that adds the new `guide_version` and values, plus the matching `GUIDE_VERSION` in
`guide.js`.

Not collected: name, email, phone, business name, IP address, user agent, cookies,
analytics or tracking identifiers, browser fingerprint, referrer.

## Security model

Direct insert from the browser through Supabase's REST API with the **publishable** key.
An Edge Function is not needed: it would add a deploy target and a secret without making
the write narrower than the database already makes it.

- RLS enabled; one policy: `INSERT` for `anon`.
- Supabase grants ALL on new `public` tables to `anon` and `authenticated` by default.
  The migration revokes that, then grants `anon` **column-level INSERT** on the eight
  visitor-supplied columns only (not `created_at`).
- `anon` has no SELECT, so it cannot read, list, or read back its own row
  (`Prefer: return=minimal`); no UPDATE, DELETE, or TRUNCATE. `authenticated` has nothing.
- Check constraints reject unknown values, missing answers, oversized notes, and extra
  columns.
- Staff read rows in the Supabase dashboard (table editor / SQL), which uses privileged
  roles on the server side. No key with read access exists in the browser.
- `guide.js` refuses to send (and logs an error) if the configured key is an
  `sb_secret_…` key or a JWT whose role is not `anon`.

Known limit: an anonymous insert endpoint can be spammed. Every row must still be a
valid answer set, so spam cannot store arbitrary content, but it can add noise. If that
happens, add rate limiting or a challenge in an Edge Function; do not add tracking.

## Configuration

`public/assets/js/config.js`:

```js
GUIDE_SUBMISSION: Object.freeze({
  SUPABASE_URL: "https://<project-ref>.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_…"
})
```

Both values are public. The site has no build step, so there are no Vercel environment
variables. Leave either value empty to switch sending off.

## Privacy impact

Before: the guide made zero requests. After (sending on), when and only when the
visitor presses Send my answers:

- one HTTPS POST to `https://<project-ref>.supabase.co/rest/v1/guide_submissions`;
- body: `id`, `guide_version`, `source`, `situation`, `friction`, `starting`, `help`,
  `notes`;
- headers: `apikey` (publishable), `Content-Type`, `Prefer`; the browser adds `Origin`
  and `User-Agent`. `credentials: 'omit'` and `referrerPolicy: 'no-referrer'`: no cookies,
  no Referer;
- stored in the Macks Studios Supabase project, table `guide_submissions`.

Supabase's own API gateway keeps request logs (including IP address) for its platform
log retention period. The table does not store them.

No cookies, localStorage, sessionStorage, or IndexedDB. No analytics. Reload clears the
guide.

The page copy states this when sending is on (`[data-guide-send]` elements in
`index.html`); the original browser-only copy (`[data-guide-local]`) shows when it is off.

## Verification

- `supabase/tests/guide_submissions_security.sql` checks RLS, grants, and anon/authenticated
  behavior inside a transaction that is rolled back. It is safe to run on production.
- Browser and API test scripts used for this phase are described in the phase report;
  they are not yet in the repository (see Testing in `architecture.md`).

## Deploy

1. Confirm the target Supabase project belongs to Macks Studios and holds nothing this
   change could affect.
2. Apply `supabase/migrations/20260923200000_guide_submissions.sql` (SQL editor, or
   `supabase db push` from a linked checkout).
3. Run `supabase/tests/guide_submissions_security.sql` and expect "all checks passed".
4. In Supabase → Project Settings → API, copy the project URL and the publishable key.
5. Put both in `config.js`, deploy a Vercel preview, send one test submission, confirm
   the row, delete it in the dashboard.
6. Promote to production.

## Rollback

- Fastest (no data loss): set both `GUIDE_SUBMISSION` values to `""` and redeploy. The
  guide returns to browser-only with the original copy.
- Or redeploy the previous Vercel deployment.
- Remove the database object only after exporting any rows you want to keep:
  `drop table public.guide_submissions;`
