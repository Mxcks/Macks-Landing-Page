/**
 * Macks Studios public website – discovery guide.
 *
 * A browser-only questionnaire that helps a visitor put their situation into
 * words and copy a short summary to bring to a call.
 *
 * Privacy contract (do not break without an explicit owner decision):
 *   - answers live only in the DOM of this page while it is open;
 *   - nothing is stored in the browser (no localStorage, cookies, or IndexedDB);
 *   - nothing is transmitted while answering or reviewing. The ONLY request is
 *     one POST to Supabase when the visitor presses "Send my answers", and only
 *     when MACKS_CONFIG.GUIDE_SUBMISSION is configured. It carries the four
 *     answers, the optional note, a random submission id, the guide version,
 *     and the source; no cookies, credentials, or referrer;
 *   - no personal contact details are asked for.
 *
 * State model: `currentStep` indexes the visible <fieldset class="step">.
 * All four steps are single-choice questions and must have a selection to
 * advance. The last step also carries an optional free-text note. After the
 * last step the form is hidden and the review panel shows a plain-text summary
 * built from the answers currently in the DOM.
 *
 * Sending: off unless GUIDE_SUBMISSION has a URL and a publishable key. When
 * off, the send button and the [data-guide-send] copy stay hidden and the guide
 * is browser-only. A submission id is generated per distinct answer set, so a
 * retry after a lost response is stored once (the server answers 409). After a
 * successful send the button is removed until the page is reloaded.
 */
(() => {
  'use strict';

  const form = document.querySelector('#guide-form');
  if (!form) return;

  const steps = [...form.querySelectorAll('.step')];
  const progress = document.querySelector('#progress-label');
  const segments = [...document.querySelectorAll('.progress-track span')];
  const back = document.querySelector('#back-button');
  const next = document.querySelector('#continue-button');
  const error = document.querySelector('#step-error');
  const review = document.querySelector('#review');
  const reviewHeading = document.querySelector('#review-heading');
  const summary = document.querySelector('#summary');
  const copyStatus = document.querySelector('#copy-status');
  const notesField = form.elements.namedItem('notes');
  const sendButton = document.querySelector('#send-button');
  const sendStatus = document.querySelector('#send-status');

  /** Names of the single-choice questions, in step order, and their summary labels. */
  const CHOICE_FIELDS = ['situation', 'friction', 'starting', 'help'];
  const CHOICE_LABELS = ['Situation', 'Where it hurts most', 'Starting point', 'Looking for'];

  /** Must match the checks in supabase/migrations/20260923200000_guide_submissions.sql. */
  const GUIDE_VERSION = '2026-09-23';
  const SOURCE = 'landing-page-guide';
  const SEND_TIMEOUT_MS = 15000;

  let currentStep = 0;
  const endpoint = resolveSubmissionEndpoint();
  let sending = false;
  /** The last answer set a send was attempted for, and the id it was sent under. */
  let attempt = null;
  let sent = false;

  /**
   * Returns { url, headers } for the Supabase insert, or null when sending is
   * switched off or misconfigured. Never accepts a secret or service-role key.
   */
  function resolveSubmissionEndpoint() {
    const settings = window.MACKS_CONFIG && window.MACKS_CONFIG.GUIDE_SUBMISSION;
    if (!settings) return null;
    const rawUrl = typeof settings.SUPABASE_URL === 'string' ? settings.SUPABASE_URL.trim() : '';
    const key = typeof settings.SUPABASE_PUBLISHABLE_KEY === 'string' ? settings.SUPABASE_PUBLISHABLE_KEY.trim() : '';
    if (!rawUrl || !key) return null;
    if (isPrivilegedKey(key)) {
      console.error('[Macks] GUIDE_SUBMISSION key is not a publishable key. Sending has been disabled.');
      return null;
    }
    let url = null;
    try { url = new URL(rawUrl); } catch { /* handled below */ }
    const isLocal = url && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if (!url || !(url.protocol === 'https:' || isLocal)) {
      console.error('[Macks] GUIDE_SUBMISSION.SUPABASE_URL is missing or invalid. Sending has been disabled.');
      return null;
    }
    const headers = { 'Content-Type': 'application/json', apikey: key, Prefer: 'return=minimal' };
    // Legacy anon keys are JWTs and must also be sent as a bearer token.
    if (key.split('.').length === 3) headers.Authorization = `Bearer ${key}`;
    return { url: `${url.origin}/rest/v1/guide_submissions`, headers };
  }

  /** True for secret keys and for any JWT whose role is not "anon". */
  function isPrivilegedKey(key) {
    if (key.startsWith('sb_secret_')) return true;
    const parts = key.split('.');
    if (parts.length !== 3) return false;
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.role !== 'anon';
    } catch {
      return true;
    }
  }

  // The form never submits anywhere; Enter in a field behaves like "Continue".
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    next.click();
  });

  function showStep(index) {
    currentStep = index;
    steps.forEach((step, position) => { step.hidden = position !== index; });
    segments.forEach((segment, position) => {
      segment.classList.toggle('active', position <= index);
    });
    progress.textContent = `Question ${index + 1} of ${steps.length}`;
    back.hidden = index === 0;
    next.textContent = index === steps.length - 1 ? 'Review answers' : 'Continue';
    error.hidden = true;
    steps[index].querySelector('legend').focus();
  }

  function validStep() {
    // Every step needs one choice; the notes field on the last step is optional.
    const selected = steps[currentStep].querySelector('input:checked');
    if (selected) return true;
    error.textContent = 'Choose one option to continue.';
    error.hidden = false;
    steps[currentStep].querySelector('input').focus();
    return false;
  }

  function selectedText(name) {
    const input = form.querySelector(`input[name="${name}"]:checked`);
    return input ? input.value : '';
  }

  function buildSummary() {
    const lines = ['Macks Studios conversation notes', ''];
    CHOICE_FIELDS.forEach((name, i) => {
      lines.push(`${CHOICE_LABELS[i]}: ${selectedText(name)}`);
    });
    const notes = notesField ? notesField.value.trim() : '';
    if (notes) lines.push(`Notes: ${notes}`);
    return lines.join('\n');
  }

  /** The answers exactly as they would be stored, or null if a question is unanswered. */
  function collectAnswers() {
    const answers = {};
    for (const name of CHOICE_FIELDS) {
      const value = selectedText(name);
      if (!value) return null;
      answers[name] = value;
    }
    const notes = notesField ? notesField.value.trim() : '';
    answers.notes = notes === '' ? null : notes;
    return answers;
  }

  function newSubmissionId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function showSendStatus(message, isError) {
    sendStatus.textContent = message;
    sendStatus.classList.toggle('is-error', isError);
    sendStatus.hidden = message === '';
  }

  /** Brings the send button and status in line with the answers now under review. */
  function renderSendState() {
    if (!endpoint) return;
    if (!sent) {
      sendButton.hidden = false;
      showSendStatus('', false);
      return;
    }
    sendButton.hidden = true;
    const answers = collectAnswers();
    const unchanged = answers && JSON.stringify(answers) === attempt.key;
    showSendStatus(unchanged
      ? 'Your answers have been sent. Thank you.'
      : 'Your earlier answers were sent. The changes since then have not been sent; copy them or mention them on your call.', false);
  }

  async function sendAnswers() {
    if (!endpoint || sending || sent) return;
    const answers = collectAnswers();
    if (!answers) {
      showSendStatus('Answer all four questions before sending. Choose "Edit answers" to finish.', true);
      return;
    }
    const key = JSON.stringify(answers);
    if (!attempt || attempt.key !== key) attempt = { key, id: newSubmissionId() };

    sending = true;
    sendButton.setAttribute('aria-disabled', 'true');
    sendButton.textContent = 'Sending…';
    showSendStatus('Sending your answers…', false);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: endpoint.headers,
        body: JSON.stringify({ id: attempt.id, guide_version: GUIDE_VERSION, source: SOURCE, ...answers }),
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: controller.signal
      });
      // 409: this answer set was already stored by an attempt whose response was lost.
      if (!response.ok && response.status !== 409) throw new Error(`HTTP ${response.status}`);
      sent = true;
      renderSendState();
    } catch {
      showSendStatus('Your answers could not be sent. They are still here: try again, copy them, or bring them to your call.', true);
    } finally {
      clearTimeout(timer);
      sending = false;
      sendButton.removeAttribute('aria-disabled');
      sendButton.textContent = 'Send my answers';
    }
  }

  if (endpoint) {
    document.querySelectorAll('[data-guide-local]').forEach((el) => { el.hidden = true; });
    document.querySelectorAll('[data-guide-send]').forEach((el) => { el.hidden = false; });
    // Sending becomes the one primary action on the review screen.
    document.querySelector('#copy-button').classList.add('secondary');
    sendButton.addEventListener('click', sendAnswers);
  }

  next.addEventListener('click', () => {
    if (!validStep()) return;
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }
    summary.value = buildSummary();
    renderSendState();
    form.hidden = true;
    review.hidden = false;
    reviewHeading.focus();
  });

  back.addEventListener('click', () => showStep(currentStep - 1));
  form.addEventListener('change', () => { error.hidden = true; });

  document.querySelector('#edit-button').addEventListener('click', () => {
    if (sending) return;
    copyStatus.textContent = '';
    review.hidden = true;
    form.hidden = false;
    showStep(steps.length - 1);
  });

  document.querySelector('#copy-button').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.value);
      copyStatus.textContent = 'Copied to clipboard.';
    } catch {
      summary.focus();
      summary.select();
      copyStatus.textContent = 'Select and copy the highlighted text.';
    }
  });
})();
