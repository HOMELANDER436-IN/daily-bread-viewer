/**
 * Daily Bread — Viewer App — Counselling Form Controller
 */

import { submitCounselling } from './api.js';
import { t } from './i18n.js';
import { showToast } from './utils.js';

export function initCounsellingForm() {
  const form         = document.getElementById('counselling-form');
  const successScreen = document.getElementById('success-screen');
  const sendAnotherBtn = document.getElementById('send-another-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = form.querySelector('#submit-btn');
    const btnText   = form.querySelector('#submit-btn-text');
    const spinner   = form.querySelector('#submit-spinner');

    submitBtn.disabled = true;
    btnText.textContent = t('sending');
    if (spinner) spinner.style.display = 'block';

    const fullName      = document.getElementById('full-name').value.trim();
    const contactNumber = document.getElementById('contact-number').value.trim();
    const comment       = document.getElementById('comment').value.trim();

    try {
      await submitCounselling({ full_name: fullName, contact_number: contactNumber, comment: comment || null });
      // Show success screen
      form.closest('.counselling-card').style.display = 'none';
      successScreen.classList.add('show');
      form.reset();
    } catch (err) {
      showToast(err.message || t('submitError'), 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = t('sendRequest');
      if (spinner) spinner.style.display = 'none';
    }
  });

  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
      successScreen.classList.remove('show');
      form.closest('.counselling-card').style.display = 'block';
    });
  }

  // Real-time validation on blur
  document.getElementById('full-name')?.addEventListener('blur', () => validateField('full-name'));
  document.getElementById('contact-number')?.addEventListener('blur', () => validateField('contact-number'));
}

function validateForm() {
  const nameOk  = validateField('full-name');
  const phoneOk = validateField('contact-number');
  return nameOk && phoneOk;
}

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return true;

  const errEl = document.getElementById(`${fieldId}-error`);
  let valid = true;
  let errorMsg = '';

  field.classList.remove('error');
  if (errEl) errEl.classList.remove('show');

  if (fieldId === 'full-name') {
    if (!field.value.trim() || field.value.trim().length < 2) {
      valid = false;
      errorMsg = t('validFullName');
    }
  } else if (fieldId === 'contact-number') {
    const phone = field.value.trim().replace(/\s/g, '');
    if (!phone || phone.length < 6) {
      valid = false;
      errorMsg = t('validPhone');
    }
  }

  if (!valid) {
    field.classList.add('error');
    if (errEl) {
      errEl.textContent = errorMsg;
      errEl.classList.add('show');
    }
  }

  return valid;
}
