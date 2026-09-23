/**
 * Macks Studios public website – general page behavior.
 *
 * Responsibilities:
 *   1. Wire every element carrying [data-booking-link] to MACKS_CONFIG.BOOKING_URL.
 *
 * No network requests, no analytics, no dependencies. Loaded after config.js.
 */
(() => {
  'use strict';

  /**
   * Returns the configured booking URL if it is a valid https URL, else null.
   * Booking must never point at a broken or non-https destination.
   */
  function resolveBookingUrl() {
    const config = window.MACKS_CONFIG;
    const raw = config && config.BOOKING_URL;
    if (typeof raw !== 'string' || raw.trim() === '') return null;
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function wireBookingLinks() {
    const links = document.querySelectorAll('[data-booking-link]');
    if (links.length === 0) return;
    const bookingUrl = resolveBookingUrl();

    if (!bookingUrl) {
      // Fail visibly rather than sending visitors to a dead link.
      console.error('[Macks] MACKS_CONFIG.BOOKING_URL is missing or invalid. Booking links have been disabled.');
      links.forEach((link) => {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('title', 'Booking is temporarily unavailable');
        if (!link.dataset.bookingLabel) {
          link.dataset.bookingLabel = link.textContent;
          link.textContent = `${link.textContent} (unavailable)`;
        }
      });
      return;
    }

    links.forEach((link) => {
      link.setAttribute('href', bookingUrl);
      link.removeAttribute('aria-disabled');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireBookingLinks);
  } else {
    wireBookingLinks();
  }
})();
