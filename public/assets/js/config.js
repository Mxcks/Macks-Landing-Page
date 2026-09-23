/**
 * Macks Studios public website – site configuration.
 *
 * This is the ONLY place the booking destination and canonical site URL are
 * defined. Every booking call-to-action on the page must read BOOKING_URL from
 * here (Phase 4 will wire the markup to it). Do not hard-code these URLs
 * anywhere else in the codebase.
 *
 * Plain script, no build step: loaded with a normal <script src> tag before
 * any script that needs it. Values are frozen so they cannot be changed at
 * runtime by accident.
 */
window.MACKS_CONFIG = Object.freeze({
  /**
   * Studio Discovery booking destination.
   * Verified working on 2026-09-23 (HTTP 200).
   * https://booking.macksstudios.org/ is NOT production-ready: it has no DNS
   * record as of 2026-09-23 and must not be used until that changes.
   */
  BOOKING_URL: "https://cal.com/macks-studios/studio-discovery",

  /**
   * Canonical public origin. Used for <link rel="canonical"> and Open Graph
   * URLs at launch. Placeholder only: no domain or DNS change is implied by
   * this value, and the live macksstudios.org is currently served by a
   * separate application (see docs/development/architecture.md).
   */
  SITE_URL: "https://macksstudios.org"
});
