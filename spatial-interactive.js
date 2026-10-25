/**
 * IArretada — Spatial Interactive & Optical Physics Engine
 * Handles Video Portal Expansion, Neural Diagnostic Live Core,
 * Scroll-bound Knot Unrolling, Horizontal Drag Deck, and Zero Emojis.
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. HERO VIDEO PORTAL EXPANSION & LIQUID GLASS CONTROLS
     ========================================================================== */
  function initHeroVideo() {
    const video = document.getElementById('heroLiveVideo');
    const playCenterBtn = document.getElementById('heroPlayCenterBtn');
    const playBarBtn = document.getElementById('heroBarPlayBtn');
    const progressFill = document.getElementById('heroProgressFill');
    const progressContainer = document.getElementById('heroProgressContainer');
    const timeDisplay = document.getElementById('heroTimeDisplay');
    const volumeBtn = document.getElementById('heroVolumeBtn');
    const fullscreenBtn = document.getElementById('heroFullscreenBtn');
    const videoViewport = document.getElementById('heroVideoViewport');

    if (!video) return;

    let isExpanded = false;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function togglePlay() {
      if (video.paused) {
        video.play().catch(function () {});
        if (playCenterBtn) playCenterBtn.style.opacity = '0';
        if (playBarBtn) playBarBtn.setAttribute('aria-label', 'Pausar vídeo');
      } else {
        video.pause();
        if (playCenterBtn) playCenterBtn.style.opacity = '1';
        if (playBarBtn) playBarBtn.setAttribute('aria-label', 'Reproduzir vídeo');
      }
    }

    // Portal expansion when clicking central play button
    if (playCenterBtn) {
      playCenterBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        video.muted = false; // un-mute on direct user play
        togglePlay();
        if (!isExpanded && videoViewport) {
          isExpanded = true;
          videoViewport.classList.add('is-portal-expanded');
        }
      });
    }

    if (playBarBtn) {
      playBarBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePlay();
      });
    }

    video.addEventListener('timeupdate', function () {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
        if (timeDisplay) {
          timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 88)}`;
        }
      }
    });

    if (progressContainer) {
      progressContainer.addEventListener('click', function (e) {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (video.duration) {
          video.currentTime = pos * video.duration;
        }
      });
    }

    if (volumeBtn) {
      volumeBtn.addEventListener('click', function () {
        video.muted = !video.muted;
        volumeBtn.setAttribute('aria-pressed', String(video.muted));
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          if (videoViewport.requestFullscreen) {
            videoViewport.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }
  }

  /* ==========================================================================
     2. NEURAL SPHERE & LIVE DIAGNOSTIC ENGINE (6 PAIN PILLS + 4 STEPS)
     ========================================================================== */
  const DIAGNOSTIC_DATA = {
    tempo: {
      title: 'Estou perdendo muito tempo',
      cause: 'Talvez o problema não seja falta de tempo. Talvez sejam tarefas manuais repetitivas sem automação.',
      stepIndex: 3, // Automatizar
      recommendation: 'Automatizar triagem de mensagens, confirmações de pedidos e rotinas que roubam 3 horas do seu dia.'
    },
    informacao: {
      title: 'A informação fica espalhada',
      cause: 'Talvez o problema não seja falta de tempo. Talvez seja informação espalhada entre planilhas e conversas soltas.',
      stepIndex: 0, // Organizar
      recommendation: 'Organizar uma base única de dados e procedimentos visuais para que ninguém precise adivinhar onde estão os arquivos.'
    },
    espera: {
      title: 'Clientes estão esperando',
      cause: 'O atraso no balcão quase sempre começa na passagem de informação entre bastidores desconectados.',
      stepIndex: 2, // Simplificar
      recommendation: 'Simplificar a passagem de bastão com notificações automáticas: quarto liberado, pedido pronto, cliente atendido na hora.'
    },
    custo: {
      title: 'Estou gastando mais do que deveria',
      cause: 'Custo invisível: compras descompassadas no varejo, insumos parados e assinaturas de softwares que ninguém usa.',
      stepIndex: 2, // Simplificar
      recommendation: 'Simplificar a esteira operacional, cortar softwares supérfluos e proteger a margem com estoque calibrado.'
    },
    ferramentas: {
      title: 'Tenho ferramentas, mas elas não conversam',
      cause: 'O gargalo não são as ferramentas; é a falta de pontes e integrações inteligentes entre elas.',
      stepIndex: 1, // Conectar
      recommendation: 'Conectar formulários, WhatsApp, CRM e financeiro para que a informação flua sem digitação manual.'
    },
    travando: {
      title: 'Não sei explicar. Só sei que alguma coisa está travando.',
      cause: 'Quando tudo parece embolado, a gente senta junto, mapeia o fluxo do início ao fim e desata o primeiro nó.',
      stepIndex: 0, // Organizar
      recommendation: 'Organizar uma escuta atenta, diagnosticar a raiz sem jargões e dar clareza imediata para a sua rotina.'
    }
  };

  function initNeuralCore() {
    const nucleus = document.getElementById('neuralNucleus');
    const pills = document.querySelectorAll('[data-pain-pill]');
    const beams = document.querySelectorAll('.discovery-beam-line');
    const summaryEl = document.getElementById('diagnosticSummary');
    const stepPills = document.querySelectorAll('[data-method-step]');

    if (!pills.length) return;

    function activatePain(pillKey) {
      const data = DIAGNOSTIC_DATA[pillKey];
      if (!data) return;

      // Highlight active pill
      pills.forEach(function (p) {
        const isActive = p.getAttribute('data-pain-pill') === pillKey;
        p.classList.toggle('is-active', isActive);
      });

      // Highlight matching beam
      beams.forEach(function (beam) {
        const matches = beam.getAttribute('data-beam-for') === pillKey;
        beam.classList.toggle('is-active', matches);
      });

      // Amplify nucleus vibration
      if (nucleus) {
        nucleus.classList.add('is-amplified');
        setTimeout(function () {
          nucleus.classList.remove('is-amplified');
        }, 1200);
      }

      // Update diagnostic text
      if (summaryEl) {
        summaryEl.style.opacity = '0';
        setTimeout(function () {
          summaryEl.textContent = data.cause;
          summaryEl.style.opacity = '1';
        }, 150);
      }

      // Highlight matching method step (0: Organizar, 1: Conectar, 2: Simplificar, 3: Automatizar)
      stepPills.forEach(function (st, idx) {
        st.classList.toggle('is-highlighted', idx === data.stepIndex);
      });
    }

    pills.forEach(function (pill) {
      const key = pill.getAttribute('data-pain-pill');
      pill.addEventListener('mouseenter', function () {
        activatePain(key);
      });
      pill.addEventListener('click', function () {
        activatePain(key);
      });
    });

    // Default activation
    activatePain('informacao');
  }

  /* ==========================================================================
     3. SCROLL-BOUND KNOT UNROLLING & JOURNEY PATH DRAWING
     ========================================================================== */
  function initScrollKnot() {
    const knotPath = document.getElementById('heroScrollKnot');
    const journeyLine = document.getElementById('journeySvgLine');

    if (!knotPath && !journeyLine) return;

    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

      if (knotPath) {
        // Rotate and straighten knot based on top scroll
        const knotProgress = Math.min(scrollY / 600, 1);
        knotPath.style.transform = `rotate(${knotProgress * 180}deg) scale(${1 - knotProgress * 0.15})`;
      }

      if (journeyLine) {
        const lineProgress = Math.min(Math.max((scrollY - 800) / 1200, 0), 1);
        const dashOffset = 100 - lineProgress * 100;
        journeyLine.style.strokeDashoffset = String(dashOffset);
      }
    }, { passive: true });
  }

  /* ==========================================================================
     4. HORIZONTAL DRAG DECK FOR 7 SECTORS
     ========================================================================== */
  function initSectorsDeck() {
    const deck = document.getElementById('sectorsDragDeck');
    const prevBtn = document.getElementById('deckPrevBtn');
    const nextBtn = document.getElementById('deckNextBtn');

    if (!deck) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    deck.addEventListener('mousedown', function (e) {
      isDown = true;
      deck.style.cursor = 'grabbing';
      startX = e.pageX - deck.offsetLeft;
      scrollLeft = deck.scrollLeft;
    });

    deck.addEventListener('mouseleave', function () {
      isDown = false;
      deck.style.cursor = 'grab';
    });

    deck.addEventListener('mouseup', function () {
      isDown = false;
      deck.style.cursor = 'grab';
    });

    deck.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - deck.offsetLeft;
      const walk = (x - startX) * 1.8;
      deck.scrollLeft = scrollLeft - walk;
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        deck.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        deck.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     5. LEAD FORM & DIRECT BACKEND INGESTION (CLOUD-READY / ZERO LEAKS)
     ========================================================================== */
  function initLeadForm() {
    const form = document.getElementById('directEscutaForm');
    if (!form) return;

    const alertBox = form.querySelector('.form-status-alert');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const hp = form.querySelector('input[name="website_hp"]');
      if (hp && hp.value) {
        // Honeypot trapped
        if (alertBox) {
          alertBox.textContent = 'Envio inválido detectado.';
          alertBox.style.color = '#e06d44';
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando com segurança...';
      }

      const payload = {
        name: (form.querySelector('input[name="name"]')?.value || '').trim(),
        whatsapp: (form.querySelector('input[name="whatsapp"]')?.value || '').trim(),
        email: (form.querySelector('input[name="email"]')?.value || '').trim(),
        business_type: (form.querySelector('select[name="business_type"]')?.value || '').trim(),
        improvement_need: (form.querySelector('textarea[name="improvement_need"]')?.value || '').trim(),
        consent: Boolean(form.querySelector('input[name="consent"]')?.checked),
        origin: window.location.href,
        source_page: window.location.pathname,
        sector: form.querySelector('select[name="business_type"]')?.value || 'Geral'
      };

      fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        return res.json().then(function (data) {
          return { status: res.status, data: data };
        });
      })
      .then(function (resObj) {
        if (resObj.status === 200 && resObj.data.success) {
          if (alertBox) {
            alertBox.textContent = 'Recebido com sucesso! Abrindo conversa direta...';
            alertBox.style.color = '#15382b';
          }
          if (resObj.data.redirect_url) {
            window.location.href = resObj.data.redirect_url;
          } else {
            form.reset();
            if (submitBtn) {
              submitBtn.textContent = 'Mensagem Enviada!';
            }
          }
        } else {
          if (alertBox) {
            alertBox.textContent = resObj.data.error || 'Ocorreu um erro ao enviar. Tente novamente.';
            alertBox.style.color = '#e06d44';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Tentar Novamente';
          }
        }
      })
      .catch(function () {
        if (alertBox) {
          alertBox.textContent = 'Erro de conexão. Verifique sua rede.';
          alertBox.style.color = '#e06d44';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Tentar Novamente';
        }
      });
    });
  }

  /* ==========================================================================
     6. ACCESSIBILITY TOGGLE SUITE (NO EMOJIS)
     ========================================================================== */
  function initA11y() {
    const contrastBtn = document.querySelector('[data-a11y="contrast"]');
    const fontBtn = document.querySelector('[data-a11y="font"]');
    const motionBtn = document.querySelector('[data-a11y="motion"]');

    if (contrastBtn) {
      contrastBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('a11y-high-contrast');
      });
    }

    if (fontBtn) {
      fontBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('a11y-readable-font');
      });
    }

    if (motionBtn) {
      motionBtn.addEventListener('click', function () {
        const isPaused = document.documentElement.classList.toggle('a11y-motion-paused');
        const label = motionBtn.querySelector('[data-motion-label]');
        if (label) {
          label.textContent = isPaused ? 'Ativar movimento' : 'Pausar movimento';
        }
      });
    }
  }

  // Initialize all spatial modules on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initHeroVideo();
      initNeuralCore();
      initScrollKnot();
      initSectorsDeck();
      initLeadForm();
      initA11y();
    });
  } else {
    initHeroVideo();
    initNeuralCore();
    initScrollKnot();
    initSectorsDeck();
    initLeadForm();
    initA11y();
  }
})();
