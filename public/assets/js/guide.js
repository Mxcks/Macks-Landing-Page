/**
 * Macks Studios public website – discovery guide.
 *
 * A browser-only questionnaire that helps a visitor put their situation into
 * words and copy a short summary to bring to a call.
 *
 * Privacy contract (do not break without an explicit owner decision):
 *   - answers live only in the DOM of this page while it is open;
 *   - nothing is stored (no localStorage, cookies, or IndexedDB);
 *   - nothing is transmitted (no fetch, XHR, beacon, or form submission);
 *   - no personal contact details are asked for.
 *
 * State model: `currentStep` indexes the visible <fieldset class="step">.
 * All four steps are single-choice questions and must have a selection to
 * advance. The last step also carries an optional free-text note. After the
 * last step the form is hidden and the review panel shows a plain-text summary
 * built from the answers currently in the DOM.
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

  /** Names of the single-choice questions, in step order, and their summary labels. */
  const CHOICE_FIELDS = ['situation', 'friction', 'starting', 'help'];
  const CHOICE_LABELS = ['Situation', 'Where it hurts most', 'Starting point', 'Looking for'];

  let currentStep = 0;

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

  next.addEventListener('click', () => {
    if (!validStep()) return;
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }
    summary.value = buildSummary();
    form.hidden = true;
    review.hidden = false;
    reviewHeading.focus();
  });

  back.addEventListener('click', () => showStep(currentStep - 1));
  form.addEventListener('change', () => { error.hidden = true; });

  document.querySelector('#edit-button').addEventListener('click', () => {
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
