/**
 * IArretada — Engine de Experiência, Acessibilidade, Leads e Transições
 * Totalmente alinhado às diretrizes do Adendo Estratégico (Sem exposição de WhatsApp, foco em negócios reais)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'iarretada_user_prefs_v3';

  const defaultPrefs = {
    fontScale: 1,
    highContrast: false,
    readableFont: false,
    motionPaused: false
  };

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? Object.assign({}, defaultPrefs, JSON.parse(raw)) : Object.assign({}, defaultPrefs);
    } catch (_) {
      return Object.assign({}, defaultPrefs);
    }
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) {}
  }

  const prefs = loadPrefs();

  function applyPrefs() {
    const root = document.documentElement;
    root.style.setProperty('--font-scale', String(prefs.fontScale));
    root.classList.toggle('a11y-high-contrast', Boolean(prefs.highContrast));
    root.classList.toggle('a11y-readable-font', Boolean(prefs.readableFont));
    root.classList.toggle('a11y-motion-paused', Boolean(prefs.motionPaused));

    document.querySelectorAll('video').forEach((video) => {
      if (prefs.motionPaused) {
        video.pause();
      } else if (video.dataset.autoplay !== 'false') {
        video.play().catch(() => {});
      }
    });

    const hcBtn = document.querySelector('[data-a11y="contrast"]');
    if (hcBtn) hcBtn.setAttribute('aria-pressed', String(Boolean(prefs.highContrast)));

    const rfBtn = document.querySelector('[data-a11y="font"]');
    if (rfBtn) rfBtn.setAttribute('aria-pressed', String(Boolean(prefs.readableFont)));

    document.querySelectorAll('[data-a11y="motion"], [data-toggle-motion]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(Boolean(prefs.motionPaused)));
      const labelSpan = btn.querySelector('[data-motion-label]');
      if (labelSpan) {
        labelSpan.textContent = prefs.motionPaused ? 'Ativar movimento' : 'Pausar animações';
      }
    });
  }

  function initAccessibilityControls() {
    applyPrefs();

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-a11y], [data-toggle-motion]');
      if (!btn) return;

      const action = btn.getAttribute('data-a11y') || 'motion';
      if (action === 'font-inc') {
        prefs.fontScale = Math.min(1.25, Math.round((prefs.fontScale + 0.08) * 100) / 100);
      } else if (action === 'font-dec') {
        prefs.fontScale = Math.max(0.9, Math.round((prefs.fontScale - 0.08) * 100) / 100);
      } else if (action === 'font-reset') {
        prefs.fontScale = 1;
      } else if (action === 'contrast') {
        prefs.highContrast = !prefs.highContrast;
      } else if (action === 'font') {
        prefs.readableFont = !prefs.readableFont;
      } else if (action === 'motion') {
        prefs.motionPaused = !prefs.motionPaused;
      } else if (action === 'speak') {
        toggleSpeech(btn);
        return;
      }
      savePrefs(prefs);
      applyPrefs();
    });
  }

  let speaking = false;
  function toggleSpeech(btn) {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      btn.setAttribute('aria-pressed', 'false');
      return;
    }
    const main = document.querySelector('main') || document.body;
    const texts = Array.from(main.querySelectorAll('h1, h2, .section-lead, p'))
      .slice(0, 10)
      .map((el) => el.textContent.trim())
      .join('. ');
    const utterance = new SpeechSynthesisUtterance(texts);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.onend = () => {
      speaking = false;
      btn.setAttribute('aria-pressed', 'false');
    };
    speaking = true;
    btn.setAttribute('aria-pressed', 'true');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  /* ==========================================================================
     TRANSIÇÃO SUAVE E ELEGANTE ENTRE PÁGINAS (ITEM 25 DO ADENDO)
     Prioriza View Transitions API nativa (@view-transition { navigation: auto; })
     ========================================================================== */
  function initPageTransitions() {
    // If browser supports CSS cross-document View Transitions natively, let it handle seamlessly!
    const supportsViewTransitions = 'startViewTransition' in document || (window.CSS && CSS.supports && CSS.supports('view-transition-name', 'test'));
    if (supportsViewTransitions) {
      // Browser handles morphing and shared element continuity natively via CSS
      return;
    }

    const overlay = ensurePortalOverlay();
    const labelEl = overlay.querySelector('[data-portal-label]');

    // Remove active transition on page restore (Back/Forward bfcache protection)
    window.addEventListener('pageshow', () => {
      overlay.classList.remove('is-active');
    });

    document.addEventListener('click', (e) => {
      // Don't hijack modified clicks (Ctrl, Cmd, Shift, Alt, middle-click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }
      if (prefs.motionPaused) return;

      e.preventDefault();
      const destText = link.textContent.trim().replace(/[→↗↓]/g, '').trim() || 'IArretada';
      if (labelEl) labelEl.textContent = `• ${destText}`;
      overlay.classList.add('is-active');

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  }

  /* ==========================================================================
     HERO VIDEO & STILL TOGGLE (ITEMS 4 & 5)
     ========================================================================== */
  function initHeroVideoToggle() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle-ca-video]');
      if (!btn) return;
      const visual = btn.closest('.ca-v1-hero__visual');
      if (!visual) return;

      visual.classList.toggle('show-still-only');
      const isStillOnly = visual.classList.contains('show-still-only');
      const video = visual.querySelector('video');

      if (video) {
        if (isStillOnly) {
          video.pause();
        } else if (!prefs.motionPaused) {
          video.play().catch(() => {});
        }
      }

      btn.innerHTML = isStillOnly
        ? '<span></span> Imagem editorial'
        : '<span></span> Movimento cinematográfico';
    });
  }

  /* ==========================================================================
     LIQUID GLASSMORPHISM CURSOR REFLECTION
     ========================================================================== */
  function initLiquidGlass() {
    document.addEventListener('mousemove', (e) => {
      if (prefs.motionPaused) return;
      const card = e.target.closest('.liquid-glass');
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
      }
    });
  }

  /* ==========================================================================
     DEMONSTRAÇÃO INTERATIVA DO OLHAR TRANSVERSAL (ITEM 17 E BLOCO 5)
     Problema → Investigação → Possibilidades Conectadas → Resultado Real
     ========================================================================== */
  const TRANSVERSAL_CASES = {
    hotelaria: {
      sectorTag: 'Hotelaria & Hospedagem',
      title: 'Check-in fora do horário, sem deixar o hóspede sem resposta',
      problemTitle: 'Situação',
      problemText: 'Uma pessoa avisa que chegará depois do expediente da recepção e precisa saber como entrar.',
      investigationTitle: 'O que precisamos confirmar',
      investigationText: 'Reserva, horário previsto e procedimento real da pousada para chegadas tardias.',
      possibilityTitle: 'Aplicação possível',
      possibilityText: 'Um formulário curto reúne esses dados e avisa a equipe responsável. A resposta ao hóspede segue a orientação aprovada pela pousada.',
      resultTitle: 'O que melhora',
      resultText: 'A equipe recebe o contexto completo e pode confirmar a chegada sem pedir as mesmas informações de novo.'
    },
    alimentacao: {
      sectorTag: 'Alimentação & Gastronomia',
      title: 'Reserva de grupo com restrições alimentares claras',
      problemTitle: 'Situação',
      problemText: 'Um grupo quer reservar mesa e informa que duas pessoas têm restrições alimentares.',
      investigationTitle: 'O que precisamos confirmar',
      investigationText: 'Data, horário, quantidade de pessoas, restrições e capacidade do restaurante para atender ao pedido.',
      possibilityTitle: 'Aplicação possível',
      possibilityText: 'A solicitação chega estruturada à equipe; somente ela confirma disponibilidade e alternativas do cardápio.',
      resultTitle: 'O que melhora',
      resultText: 'Menos troca de mensagens para coletar dados básicos e mais segurança na resposta ao cliente.'
    },
    comercio: {
      sectorTag: 'Comércio & Varejo',
      title: 'Pedido de produto sem promessa de estoque inexistente',
      problemTitle: 'Situação',
      problemText: 'Uma pessoa pergunta se um produto está disponível e se pode retirá-lo hoje.',
      investigationTitle: 'O que precisamos confirmar',
      investigationText: 'Modelo, variação, unidade desejada e estoque atualizado antes de responder.',
      possibilityTitle: 'Aplicação possível',
      possibilityText: 'A consulta reúne os dados e encaminha a conferência ao vendedor. Só o estoque confirmado vira resposta.',
      resultTitle: 'O que melhora',
      resultText: 'O atendimento mantém o pedido em contexto e evita orientar o cliente com informação desatualizada.'
    },
    servicos: {
      sectorTag: 'Serviços Profissionais',
      title: 'Primeiro contato que ajuda a preparar uma proposta útil',
      problemTitle: 'Situação',
      problemText: 'Um cliente pede orçamento, mas ainda não explicou prazo, escopo nem local do serviço.',
      investigationTitle: 'O que precisamos confirmar',
      investigationText: 'Objetivo, entregáveis esperados, prazo e restrições que mudam o esforço necessário.',
      possibilityTitle: 'Aplicação possível',
      possibilityText: 'Uma triagem breve organiza as respostas para o profissional avaliar e construir uma proposta sob medida.',
      resultTitle: 'O que melhora',
      resultText: 'A conversa comercial começa com contexto e deixa claro o que ainda depende de avaliação humana.'
    }
  };

  function initTransversalDemonstration() {
    const tabs = document.querySelectorAll('[data-case-tab]');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-case-tab');
        const data = TRANSVERSAL_CASES[key];
        if (!data) return;

        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const badge = document.querySelector('[data-case-badge]');
        const title = document.querySelector('[data-case-title]');
        const pTitle = document.querySelector('[data-case-problem-title]');
        const pText = document.querySelector('[data-case-problem-text]');
        const iTitle = document.querySelector('[data-case-investigation-title]');
        const iText = document.querySelector('[data-case-investigation-text]');
        const posTitle = document.querySelector('[data-case-possibility-title]');
        const posText = document.querySelector('[data-case-possibility-text]');
        const rTitle = document.querySelector('[data-case-result-title]');
        const rText = document.querySelector('[data-case-result-text]');

        if (badge) badge.textContent = data.sectorTag;
        if (title) title.textContent = data.title;
        if (pTitle) pTitle.textContent = data.problemTitle;
        if (pText) pText.textContent = data.problemText;
        if (iTitle) iTitle.textContent = data.investigationTitle;
        if (iText) iText.textContent = data.investigationText;
        if (posTitle) posTitle.textContent = data.possibilityTitle;
        if (posText) posText.textContent = data.possibilityText;
        if (rTitle) rTitle.textContent = data.resultTitle;
        if (rText) rText.textContent = data.resultText;
      });
    });
  }

  /* ==========================================================================
     CAPTAÇÃO SEGURA DE LEADS (ITEM 19 E 20)
     Backend SQLite /api/lead com validação, proteção LGPD, UTM e confirmação visual
     ========================================================================== */
  function initLeadForms() {
    const forms = document.querySelectorAll('form[data-lead-form="true"], #lead-capture-form');

    // Parse URL query parameters for UTM tracking
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || '';
    const utm_medium = urlParams.get('utm_medium') || '';
    const utm_campaign = urlParams.get('utm_campaign') || '';
    const utm_term = urlParams.get('utm_term') || '';
    const utm_content = urlParams.get('utm_content') || '';
    const origin = document.referrer || 'acesso_direto';

    forms.forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const statusEl = form.querySelector('.form-status-alert') || createStatusEl(form);

        // Input values
        const name = (form.querySelector('[name="name"]')?.value || '').trim();
        const whatsapp = (form.querySelector('[name="whatsapp"]')?.value || '').trim();
        const business_type = (form.querySelector('[name="business_type"]')?.value || '').trim();
        const city = (form.querySelector('[name="city"]')?.value || '').trim();
        const improvement_need = (form.querySelector('[name="improvement_need"]')?.value || '').trim();
        const consentCheckbox = form.querySelector('[name="consent"]');
        const consent = consentCheckbox ? consentCheckbox.checked : false;
        const sector = (form.querySelector('[name="sector"]')?.value || business_type).trim();
        const interest = (form.querySelector('[name="interest"]')?.value || sector || business_type || 'Geral').trim();
        const website_hp = (form.querySelector('[name="website_hp"]')?.value || '').trim();

        if (!name || name.length < 2) {
          showError(statusEl, 'Por favor, informe seu nome para que possamos te chamar com carinho.');
          return;
        }
        if (!whatsapp || whatsapp.length < 8) {
          showError(statusEl, 'Por favor, informe seu WhatsApp com DDD para retorno.');
          return;
        }
        if (!business_type) {
          showError(statusEl, 'Por favor, informe qual é o tipo de negócio ou atividade.');
          return;
        }
        if (!improvement_need || improvement_need.length < 5) {
          showError(statusEl, 'Por favor, conte brevemente qual é o nó ou o que gostaria de melhorar.');
          return;
        }
        if (!consent) {
          showError(statusEl, 'É necessário concordar com a política de privacidade para que possamos responder.');
          return;
        }

        // Lock button during submit
        const originalText = submitBtn ? submitBtn.innerHTML : 'Enviar';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Enviando com segurança...';
        }

        try {
          const res = await fetch('/api/lead', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name,
              whatsapp,
              business_type,
              city,
              improvement_need,
              consent: true,
              interest,
              source_page: window.location.pathname,
              sector,
              origin,
              utm_source,
              utm_medium,
              utm_campaign,
              utm_term,
              utm_content,
              website_hp
            })
          });

          const data = await res.json();

          if (res.ok && data.success) {
            statusEl.className = 'form-status-alert is-success';
            statusEl.innerHTML = `
              <strong>• Mensagem registrada! Redirecionando para o WhatsApp de José...</strong><br />
              <span style="font-size:0.85rem;">Se a conversa não abrir automaticamente em 3 segundos, <a id="direct-wa-link" href="#" target="_blank" style="color:var(--coral-500);font-weight:bold;text-decoration:underline;">clique aqui para abrir o WhatsApp</a>.</span>
            `;
            statusEl.style.display = 'block';

            // Monta o texto acolhedor pré-preenchido para o WhatsApp de José
            const msg = `Olá, José! Meu nome é ${name}.\n` +
                        `Meu WhatsApp: ${whatsapp}\n` +
                        (city ? `Cidade: ${city}\n` : '') +
                        `Segmento: ${business_type}\n` +
                        `Onde o nó está apertando: ${improvement_need}`;

            // Número ofuscado dinamicamente para não ficar indexável como texto simples no HTML
            const num = [53, 53, 55, 51, 57, 57, 57, 51, 49, 51, 52, 48, 49].map(c => String.fromCharCode(c)).join('');
            const waUrl = `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(msg)}`;

            const linkEl = statusEl.querySelector('#direct-wa-link');
            if (linkEl) linkEl.href = waUrl;

            form.reset();
            if (submitBtn) {
              submitBtn.style.display = 'none';
            }

            // Abre o WhatsApp direto
            setTimeout(() => {
              window.open(waUrl, '_blank');
            }, 800);
          } else {
            showError(statusEl, data.error || 'Ocorreu um erro ao enviar. Por favor, tente novamente.');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
          }
        } catch (err) {
          showError(statusEl, 'Não foi possível conectar ao servidor no momento. Por favor, tente novamente em instantes.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      });
    });
  }

  function createStatusEl(form) {
    const el = document.createElement('div');
    el.className = 'form-status-alert';
    form.appendChild(el);
    return el;
  }

  function showError(statusEl, msg) {
    statusEl.className = 'form-status-alert is-error';
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
  }

  /* ==========================================================================
     INICIALIZAÇÃO NO DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initAccessibilityControls();
    initPageTransitions();
    initHeroVideoToggle();
    initLiquidGlass();
    initTransversalDemonstration();
  });
})();


  /* =========================================================================
     BOT FLUTUANTE IARRETADA — Acesso Direto com José
     Sempre visível no canto inferior direito
     ========================================================================= */
  /* Floating bot disabled as per design spec */

function initHeroVideoPlayer() {
    const video = document.getElementById('hero-live-video') || document.querySelector('.ca-v1-hero__video-frame');
    const toggleBtn = document.getElementById('hero-play-toggle');
    const playIcon = document.getElementById('hero-play-icon');
    const progressBar = document.getElementById('hero-progress-indicator');
    const timeDisplay = document.getElementById('hero-time-display');

    if (!video || !toggleBtn) return;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    toggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
        if (playIcon) playIcon.textContent = '||';
      } else {
        video.pause();
        if (playIcon) playIcon.textContent = '';
      }
    });

    video.addEventListener('timeupdate', () => {
      if (video.duration && progressBar) {
        const pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = pct + '%';
      }
      if (timeDisplay) {
        const current = formatTime(video.currentTime || 0);
        const total = formatTime(video.duration || 88);
        timeDisplay.textContent = `${current} / ${total}`;
      }
    });

    video.addEventListener('play', () => {
      if (playIcon) playIcon.textContent = '||';
    });

    video.addEventListener('pause', () => {
      if (playIcon) playIcon.textContent = '';
    });
  }

  // Auto-inicialização geral
  function initAll() {
    // floating bot disabled
    initHeroVideoPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
