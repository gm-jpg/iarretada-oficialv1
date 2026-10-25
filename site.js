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
      title: 'Hóspede insatisfeito com espera e recepção sobrecarregada',
      problemTitle: 'O Sintoma Aparente',
      problemText: 'A gerência achava que o problema era lentidão dos recepcionistas ao atender no balcão e responder WhatsApp de reservas.',
      investigationTitle: 'A Investigação Transversal',
      investigationText: 'A IArretada analisou os bastidores: governança e recepção usavam planilhas e papéis desconectados. O quarto estava limpo, mas a recepção não sabia. Além disso, 70% das dúvidas no balcão eram sobre horários de café e passeios que nunca foram enviados antes da viagem.',
      possibilityTitle: 'As Pontes Construídas',
      possibilityText: 'Integramos um checklist leve de governança que avisa a liberação do quarto em tempo real, criamos o Guia Digital de Pré-Estadia enviado 24h antes e automatizamos respostas de rotina com o tom acolhedor da pousada.',
      resultTitle: 'Cenário Ilustrativo de Transformação',
      resultText: 'Cenário ilustrativo: Fim das filas no saguão, liberação ágil de chaves, equipe com fôlego para receber de verdade e aumento consistente nas avaliações espontâneas dos hóspedes.'
    },
    alimentacao: {
      sectorTag: 'Alimentação & Restaurante',
      title: 'CMV descontrolado e perdas no final de semana',
      problemTitle: 'O Sintoma Aparente',
      problemText: 'O dono acreditava que os preços de compra estavam muito altos e cogitou cortar funcionários ou aumentar os preços bruscamente.',
      investigationTitle: 'A Investigação Transversal',
      investigationText: 'Descobrimos que não havia fichas técnicas dinâmicas: o porcionamento na cozinha variava conforme o cozinheiro e itens descartados venciam antes de virar prato porque o cardápio tinha itens pouco pedidos que exigiam ingredientes exclusivos.',
      possibilityTitle: 'As Pontes Construídas',
      possibilityText: 'Engenharia de cardápio para eliminar ingredientes reféns, fichas técnicas visuais para a equipe e planilha automatizada que sugere compras exatas baseadas nas vendas previstas.',
      resultTitle: 'Cenário Ilustrativo de Transformação',
      resultText: 'Cenário ilustrativo: Estancamento de perdas de insumos perecíveis, recuperação da margem líquida dos pratos principais e mise-en-place muito mais ágil e padronizado.'
    },
    comercio: {
      sectorTag: 'Comércio & Varejo',
      title: 'Estoque encalhado e clientes sumindo sem comprar',
      problemTitle: 'O Sintoma Aparente',
      problemText: 'A equipe achava que a concorrência na internet estava canibalizando as vendas da loja física.',
      investigationTitle: 'A Investigação Transversal',
      investigationText: 'O atendimento demorava para enviar fotos e preços de produtos solicitados por WhatsApp. Quando o cliente ia à loja, produtos complementares não ficavam juntos nem eram oferecidos no caixa.',
      possibilityTitle: 'As Pontes Construídas',
      possibilityText: 'Catálogo digital inteligente e leve para envio instantâneo, identificação de produtos que vendem juntos para criar combos e treinamento da equipe para sugestões no caixa.',
      resultTitle: 'Cenário Ilustrativo de Transformação',
      resultText: 'Cenário ilustrativo: Elevação do ticket médio com ofertas de balcão bem posicionadas, giro rápido de mercadorias paradas e resposta no WhatsApp em instantes.'
    },
    servicos: {
      sectorTag: 'Serviços Profissionais',
      title: 'Semana inteira montando propostas e poucas contratações',
      problemTitle: 'O Sintoma Aparente',
      problemText: 'O profissional achava que precisava abaixar o preço para competir no mercado.',
      investigationTitle: 'A Investigação Transversal',
      investigationText: 'As reuniões de briefing eram longas e confusas, cada proposta levava horas para ser escrita do zero e o cliente recebia um PDF genérico que não valorizava a autoridade técnica do trabalho.',
      possibilityTitle: 'As Pontes Construídas',
      possibilityText: 'Formulário inteligente pré-reunião para qualificar a demanda, gerador de propostas personalizadas e transparentes e régua elegante de acompanhamento (follow-up).',
      resultTitle: 'Cenário Ilustrativo de Transformação',
      resultText: 'Cenário ilustrativo: Elaboração de propostas no mesmo dia do briefing, clientes altamente qualificados e posicionamento de autoridade que defende o preço justo do trabalho.'
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
    initLeadForms();
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
