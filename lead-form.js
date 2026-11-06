(function () {
  'use strict';

  document.querySelectorAll('#directEscutaForm, form[data-lead-form="true"]').forEach((form) => {
    const status = form.querySelector('.form-status-alert');
    const button = form.querySelector('button[type="submit"]');
    const original = button?.innerHTML;

    function report(message, ok) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status-alert ' + (ok ? 'is-success' : 'is-error');
      status.style.display = 'block';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (button?.disabled) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const whatsapp = String(data.get('whatsapp') || '').trim();
      const email = String(data.get('email') || '').trim();
      const business_type = String(data.get('business_type') || '').trim();
      const improvement_need = String(data.get('improvement_need') || '').trim();
      const consent = data.get('consent') !== null;
      if (String(data.get('website_hp') || '').trim()) return report('Envio inválido.', false);
      if (!form.reportValidity()) return;
      if (name.length < 2 || whatsapp.replace(/\D/g, '').length < 10 || !business_type || improvement_need.length < 5 || !consent) {
        return report('Confira nome, WhatsApp com DDD, necessidade e consentimento.', false);
      }
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando...';
      }
      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, whatsapp, email, business_type, improvement_need, consent, website_hp: '' })
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) {
          report(result.message || 'Não foi possível registrar sua mensagem. Tente novamente.', false);
          return;
        }
        report(result.message || 'Mensagem registrada.', true);
        form.reset();
        const url = 'https://wa.me/5573999313401?text=' + encodeURIComponent('Olá, IArretada! Enviei uma mensagem pelo site.');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Continuar a conversa pelo WhatsApp oficial';
        link.style.display = 'block';
        if (status) status.appendChild(link);
      } catch (_) {
        report('Não foi possível conectar ao servidor. Tente novamente.', false);
      } finally {
        if (button) {
          button.disabled = false;
          button.innerHTML = original;
        }
      }
    });
  });
})();
