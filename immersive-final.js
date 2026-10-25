(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Spatial liquid-glass portals
  if (!reduceMotion) {
    document.querySelectorAll('[data-portal]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width;
        const y = (event.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.setProperty('--ry', `${(x - .5) * 9}deg`);
        card.style.setProperty('--rx', `${(.5 - y) * 8}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '20%');
      });
    });
  }

  const discoveryData = {
    tempo: {
      label: 'Seguindo o tempo perdido…',
      title: 'Tempo demais pode ser um sintoma, não a causa.',
      text: 'Antes de automatizar qualquer coisa, vale descobrir onde o tempo está indo: repetição, procura de informação, conferência, retrabalho, espera ou decisão.',
      flow: ['REPETIÇÃO', 'INFORMAÇÃO', 'CONFERÊNCIA', 'RETRABALHO', 'ESPERA', 'SIMPLIFICAR']
    },
    informacao: {
      label: 'Conectando os pontos…',
      title: 'Talvez o problema não seja falta de tempo. Talvez seja informação espalhada.',
      text: 'WhatsApp, planilha, e-mail, documento, sistema e memória de alguém podem conter pedaços da mesma história. O primeiro ganho pode ser simplesmente criar uma fonte clara.',
      flow: ['WHATSAPP', 'E-MAIL', 'PLANILHA', 'DOCUMENTO', 'FONTE CLARA', 'FLUXO']
    },
    espera: {
      label: 'Procurando onde a espera começa…',
      title: 'O atraso aparece no atendimento. A origem pode estar antes dele.',
      text: 'A espera pode nascer numa aprovação, numa passagem de informação, numa tarefa sem responsável ou numa resposta que depende de outra área.',
      flow: ['PESSOA A', 'INFORMAÇÃO', 'RUPTURA', 'PESSOA B', 'CLIENTE', 'FLUXO']
    },
    custo: {
      label: 'Mapeando vazamentos…',
      title: 'Custo não é só aquilo que você compra.',
      text: 'Também pode ser tempo perdido, estoque parado, compra emergencial, retrabalho, erro, desperdício, assinatura esquecida ou processo mal desenhado.',
      flow: ['TEMPO', 'ESTOQUE', 'COMPRA', 'ERRO', 'RETRABALHO', 'DESPERDÍCIO']
    },
    perguntas: {
      label: 'Observando as perguntas repetidas…',
      title: 'Quando todo mundo pergunta a mesma coisa, talvez a resposta esteja no lugar errado.',
      text: 'Pode faltar uma base de conhecimento simples, uma página melhor, uma mensagem mais clara, um chatbot limitado e confiável ou apenas uma informação mais fácil de encontrar.',
      flow: ['PERGUNTA', 'CONTEÚDO', 'REGRA', 'RESPOSTA', 'DÚVIDA', 'PESSOA']
    },
    comunicacao: {
      label: 'Separando mensagem de canal…',
      title: 'Comunicação que não funciona nem sempre é falta de divulgação.',
      text: 'Pode ser posicionamento confuso, promessa genérica, canal errado, prova fraca, site que não explica ou uma jornada que perde a pessoa antes do contato.',
      flow: ['MARCA', 'MENSAGEM', 'CANAL', 'CONFIANÇA', 'CONTATO', 'RETORNO']
    },
    ferramentas: {
      label: 'Vendo onde as ferramentas se encontram…',
      title: 'Ter tecnologia não significa ter um sistema.',
      text: 'Quando as ferramentas não conversam, pessoas passam o dia copiando, procurando, atualizando e conferindo. Às vezes a solução é integração; às vezes é remover uma ferramenta.',
      flow: ['FORMULÁRIO', 'CRM', 'AGENDA', 'E-MAIL', 'INTEGRAÇÃO', 'HUMANO']
    },
    travando: {
      label: 'Tudo bem não saber dar nome…',
      title: '“Algo está travando” já é um ótimo lugar para começar.',
      text: 'A investigação pode começar pelo que incomoda, pelo que se repete, pelo que depende demais de alguém ou pelo que você evita porque dá trabalho. Primeiro entendemos; depois damos nome.',
      flow: ['SINTOMA', 'PERGUNTA', 'PADRÃO', 'CONEXÃO', 'POSSIBILIDADE', 'PRÓXIMO PASSO']
    }
  };

  const choices = [...document.querySelectorAll('[data-choice]')];
  const insight = document.querySelector('[data-insight]');
  const insightTitle = document.querySelector('[data-insight-title]');
  const insightText = document.querySelector('[data-insight-text]');
  const insightFlow = document.querySelector('[data-insight-flow]');
  const coreLabel = document.querySelector('[data-core-label]');
  const stage = document.querySelector('[data-discovery-stage]');

  function selectChoice(button) {
    const key = button.dataset.choice;
    const data = discoveryData[key];
    if (!data) return;
    choices.forEach((b) => b.classList.toggle('is-active', b === button));
    if (coreLabel) coreLabel.textContent = data.label;
    if (insightTitle) insightTitle.textContent = data.title;
    if (insightText) insightText.textContent = data.text;
    if (insightFlow) {
      insightFlow.innerHTML = data.flow.map((item, i) => `<span>${item}</span>${i < data.flow.length - 1 ? '<i>→</i>' : ''}`).join('');
    }
    if (insight) insight.classList.add('is-visible');
    if (stage) {
      stage.dataset.active = key;
      stage.classList.remove('is-formulating');
      void stage.offsetWidth;
      stage.classList.add('is-formulating');
    }
  }
  choices.forEach((button) => button.addEventListener('click', () => selectChoice(button)));

  // Projected 3D particle field: lightweight, canvas-enhanced, no content dependency.
  const canvas = document.getElementById('if-core-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const points = Array.from({ length: 150 }, () => ({
      a: Math.random() * Math.PI * 2,
      b: Math.random() * Math.PI * 2,
      r: 90 + Math.random() * 125,
      speed: .0015 + Math.random() * .003,
      depth: Math.random() * 2 - 1,
      size: .6 + Math.random() * 1.7
    }));
    let w = 0, h = 0, dpr = 1, t = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function frame() {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const active = stage && stage.dataset.active;
      const pulse = active ? 1 + Math.sin(t * .06) * .045 : 1;

      const projected = points.map((p, idx) => {
        p.a += p.speed * (active ? 1.7 : 1);
        p.b += p.speed * .45;
        const x3 = Math.cos(p.a) * Math.sin(p.b) * p.r * pulse;
        const y3 = Math.sin(p.a) * p.r * .62;
        const z3 = Math.cos(p.b) * p.r + p.depth * 60;
        const perspective = 430 / (430 - z3);
        return { x: cx + x3 * perspective, y: cy + y3 * perspective, z: z3, s: p.size * perspective, idx };
      }).sort((a, b) => a.z - b.z);

      projected.forEach((p, i) => {
        const alpha = Math.max(.08, Math.min(.82, .26 + (p.z + 170) / 420));
        ctx.beginPath();
        ctx.fillStyle = i % 5 === 0 ? `rgba(217,185,104,${alpha})` : `rgba(125,207,168,${alpha * .72})`;
        ctx.arc(p.x, p.y, Math.max(.45, p.s), 0, Math.PI * 2);
        ctx.fill();
      });

      // magnetic / orbital field lines
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath();
        const rr = 95 + ring * 34 + Math.sin(t * .018 + ring) * 7;
        for (let i = 0; i <= 100; i++) {
          const a = (i / 100) * Math.PI * 2;
          const squeeze = .34 + ring * .055;
          const x = cx + Math.cos(a + t * .001 * (ring + 1)) * rr;
          const y = cy + Math.sin(a) * rr * squeeze;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = ring % 2 ? 'rgba(93,173,136,.14)' : 'rgba(217,185,104,.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  // Cinematic window depth response
  if (!reduceMotion) {
    const cinema = document.querySelector('.if-cinema-shell');
    const hero = document.querySelector('.if-cinema');
    if (cinema && hero) {
      hero.addEventListener('pointermove', (event) => {
        const r = hero.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - .5;
        const y = (event.clientY - r.top) / r.height - .5;
        cinema.style.transform = `rotateY(${(-2 + x * 3).toFixed(2)}deg) rotateX(${(.5 - y * 2).toFixed(2)}deg) translateZ(4px)`;
      });
      hero.addEventListener('pointerleave', () => { cinema.style.transform = 'rotateY(-2deg) rotateX(.5deg)'; });
    }
  }

  // Quick help navigation assistant
  const launcher = document.querySelector('[data-chat-launch]');
  const chat = document.querySelector('[data-chat]');
  const closer = document.querySelector('[data-chat-close]');
  function setChat(open) {
    if (!launcher || !chat) return;
    chat.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) chat.querySelector('a,button')?.focus();
  }
  launcher?.addEventListener('click', () => setChat(chat.hidden));
  closer?.addEventListener('click', () => setChat(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setChat(false); });

  // Pause hero video out of view / reduced motion.
  const video = document.querySelector('.if-cinema video');
  if (video) {
    if (reduceMotion) video.pause();
    else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {}); else video.pause();
      }, { threshold: .18 });
      observer.observe(video);
    }
  }
})();