/* Review preview: keep each Cal.com event destination in config.js. */
(() => {
  'use strict';
  const raw = window.MACKS_CONFIG && window.MACKS_CONFIG.HORIZON_URL;
  let href = null;
  try {
    const url = new URL(raw);
    if (url.protocol === 'https:') href = url.href;
  } catch { /* show unavailable state below */ }
  document.querySelectorAll('[data-horizon-link]').forEach(link => {
    if (href) link.href = href;
    else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.textContent = 'Horizon booking unavailable';
    }
  });
})();
