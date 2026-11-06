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

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) {
      video.removeAttribute('autoplay');
      video.pause();
    }
    motionPreference.addEventListener('change', function (event) {
      if (event.matches) video.pause();
      else video.play().catch(function () {});
    });

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
        if (progressContainer) progressContainer.setAttribute('aria-valuenow', String(Math.round(percent)));
        if (timeDisplay) {
          timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
      }
    });

    video.addEventListener('play', function () {
      if (playCenterBtn) playCenterBtn.style.opacity = '0';
      if (playBarBtn) playBarBtn.setAttribute('aria-label', 'Pausar vídeo');
    });
    video.addEventListener('pause', function () {
      if (playCenterBtn) playCenterBtn.style.opacity = '1';
      if (playBarBtn) playBarBtn.setAttribute('aria-label', 'Reproduzir vídeo');
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
      cause: 'Pedidos chegam por canais diferentes e alguém precisa copiar os mesmos dados várias vezes. Vale mapear quais etapas se repetem antes de automatizar.',
      stepIndex: 3, // Automatizar
      recommendation: 'Organizar um fluxo de entrada e automatizar apenas respostas e lembretes que tenham regras claras.'
    },
    informacao: {
      title: 'A informação fica espalhada',
      cause: 'Uma informação importante pode estar no WhatsApp, outra numa planilha. A equipe perde o contexto ao trocar de turno.',
      stepIndex: 0, // Organizar
      recommendation: 'Definir onde cada solicitação é registrada, quem acompanha e qual informação precisa estar visível.'
    },
    espera: {
      title: 'Clientes estão esperando',
      cause: 'Quando uma solicitação chega sem responsável ou prazo, a pessoa precisa repetir a pergunta e esperar por uma resposta.',
      stepIndex: 2, // Simplificar
      recommendation: 'Criar um registro simples com responsável e próximo passo, preservando a decisão com a equipe.'
    },
    custo: {
      title: 'Estou gastando mais do que deveria',
      cause: 'Antes de propor ferramenta nova, é útil entender onde há retrabalho, compras sem registro ou serviços pouco usados.',
      stepIndex: 2, // Simplificar
      recommendation: 'Comparar o fluxo atual com alternativas mais simples e medir o custo real antes de mudar.'
    },
    ferramentas: {
      title: 'Tenho ferramentas, mas elas não conversam',
      cause: 'O mesmo pedido pode ser lançado em mais de um sistema. Isso cria trabalho duplicado e facilita erros.',
      stepIndex: 1, // Conectar
      recommendation: 'Verificar quais ferramentas permitem integração segura e conectar só os dados necessários.'
    },
    travando: {
      title: 'Não sei explicar. Só sei que alguma coisa está travando.',
      cause: 'Mesmo sem um diagnóstico pronto, podemos escolher uma tarefa concreta e acompanhar seu caminho do começo ao fim.',
      stepIndex: 0, // Organizar
      recommendation: 'Começar por uma conversa curta, identificar uma prioridade e propor um próximo passo verificável.'
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
      initA11y();
    });
  } else {
    initHeroVideo();
    initNeuralCore();
    initScrollKnot();
    initSectorsDeck();
    initA11y();
  }
})();
