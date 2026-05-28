/* ============================================================
   NUTRI-BENEFIT — form.js
   Validación del formulario + envío Web3Forms
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successEl = document.getElementById('form-success');

  /* ── Validation helpers ─────────────────────────────────── */
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function setError(group, msg) {
    group.classList.add('has-error');
    const errEl = group.querySelector('.form-error-msg');
    if (errEl) errEl.textContent = msg;
    const input = group.querySelector('input, select, textarea');
    if (input) input.classList.add('error');
  }

  function clearError(group) {
    group.classList.remove('has-error');
    const input = group.querySelector('input, select, textarea');
    if (input) input.classList.remove('error');
  }

  function validateForm() {
    let valid = true;

    const nameGroup = form.querySelector('.group-name');
    const nameVal = form.querySelector('#name').value.trim();
    if (!nameVal) {
      setError(nameGroup, 'Por favor, introduce tu nombre.');
      valid = false;
    } else {
      clearError(nameGroup);
    }

    const emailGroup = form.querySelector('.group-email');
    const emailVal = form.querySelector('#email').value.trim();
    if (!emailVal) {
      setError(emailGroup, 'Por favor, introduce tu email.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      setError(emailGroup, 'Introduce un email válido.');
      valid = false;
    } else {
      clearError(emailGroup);
    }

    const rgpdGroup = form.querySelector('.group-rgpd');
    const rgpdChecked = form.querySelector('#rgpd').checked;
    if (!rgpdChecked) {
      setError(rgpdGroup, 'Debes aceptar la política de privacidad.');
      valid = false;
    } else {
      clearError(rgpdGroup);
    }

    return valid;
  }

  /* ── Clear errors on input ──────────────────────────────── */
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      const group = el.closest('.form-group, .form-checkbox-group');
      if (group) clearError(group);
    });
  });

  /* ── Submit ─────────────────────────────────────────────── */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const data = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('visible');

        if (typeof window.trackEvent === 'function') {
          window.trackEvent('form_submit');
        }
      } else {
        throw new Error(result.message || 'Error al enviar');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      const errorDiv = document.getElementById('form-send-error');
      if (errorDiv) {
        errorDiv.style.display = 'block';
        setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
      }
    }
  });
});
