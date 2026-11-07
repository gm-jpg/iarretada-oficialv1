"use strict";
(() => {
  const demos = {
    atendimento: {
      label: "Atendimento",
      title: "Da dúvida sobre um produto à conversa com quem pode vender.",
      description: "Um assistente inteligente acolhe o cliente com cordialidade, esclarece dúvidas, consulta o estoque e entrega o atendimento pronto para o vendedor fechar a venda.",
      question: "Quero um ventilador 220V para retirar hoje. Tem algum disponível?",
      answer: "Olá! Tudo bem? Sou o IArretado, seu assistente da IArretada! Que alegria falar com você.<br><br>Com certeza podemos te ajudar agora mesmo! Temos modelos de mesa (30cm e 40cm) e opções de coluna em 220V com estoque disponível para retirada hoje na nossa loja física do centro.<br><br><strong>Você sabia que com a IArretada, nós conseguimos te ajudar fazendo:</strong><br>• Atendimento automático e acolhedor 24h no WhatsApp sem deixar ninguém na espera;<br>• Consulta instantânea de estoque, voltagem e opções de produto com fotos em segundos;<br>• Encaminhamento do pedido prontinho com contexto para o vendedor separar para retirada?<br><br>Qual desses modelos você prefere? Posso já deixar reservado no seu nome!",
      records: [
        ["Oportunidade", "Cliente pronto para compra e retirada hoje"],
        ["Informações reunidas", "Voltagem 220V, modelo e loja mais próxima"],
        ["Solução IArretada", "Triagem com opções claras e encaminhamento ágil"],
        ["Valor para a equipe", "Vendedor recebe o cliente pronto para fechar"]
      ]
    },
    operacao: {
      label: "Operação",
      title: "Uma solicitação sai do WhatsApp e vira trabalho acompanhável.",
      description: "Para equipes que lidam com pedidos diários, a IA organiza prioridades, prazos e responsáveis em um único fluxo transparente, sem perder nada.",
      question: "O ar-condicionado da sala 3 parou. Conseguem verificar antes da reunião de amanhã?",
      answer: "Olá! Tudo bem? Sou o IArretado, seu assistente da IArretada! Que bom que você entrou em contato a tempo.<br><br>Fique tranquilo, já dei prioridade máxima ao seu chamado! A equipe de manutenção já foi notificada para realizar a inspeção e o reparo hoje mesmo no período da tarde, garantindo a sala 3 perfeita para a reunião de amanhã cedo.<br><br><strong>Você sabia que com a IArretada, nós conseguimos te ajudar fazendo:</strong><br>• Transformação automática de mensagens do WhatsApp em chamados com prioridade e responsável;<br>• Notificação instantânea dos técnicos sem ruído ou mensagens esquecidas;<br>• Acompanhamento em tempo real do status com previsão de conclusão transparente?<br><br>Gostaria de receber o aviso de conclusão direto no seu WhatsApp assim que finalizarem?",
      records: [
        ["Pedido urgente", "Manutenção do ar-condicionado na Sala 3"],
        ["Prazo priorizado", "Conclusão hoje antes da reunião de amanhã"],
        ["Solução IArretada", "Chamado registrado e equipe técnica acionada"],
        ["Valor para a equipe", "Operação sem atrito e ambiente pronto a tempo"]
      ]
    },
    hotelaria: {
      label: "Hotelaria",
      title: "O hóspede chega com uma dúvida; a recepção recebe o contexto.",
      description: "Um assistente de pré-chegada acolhe horários, preferências e reservas, acionando a recepção para uma experiência inesquecível.",
      question: "Meu voo atrasou e chego por volta das 23h. Como faço o check-in?",
      answer: "Olá! Tudo bem? Sou o IArretado, seu assistente da IArretada! Seja muito bem-vindo, e excelente viagem até aqui!<br><br>Pode vir sem pressa e com tranquilidade! Nossa recepção já foi avisada do seu novo horário às 23h. Sua chave e acomodação já estão sendo preparadas com carinho, e o recepcionista noturno estará no balcão a postos para o seu check-in expresso.<br><br><strong>Você sabia que com a IArretada, nós conseguimos te ajudar fazendo:</strong><br>• Pré-check-in acolhedor pelo WhatsApp com preferências e dados adiantados;<br>• Comunicação imediata com recepção e governança sobre imprevistos e horários especiais;<br>• Envio de dicas de passeios, rota de chegada e Wi-Fi com hospitalidade genuína?<br><br>Por favor, me informe o nome do titular da reserva para eu deixar tudo 100% pronto!",
      records: [
        ["Hóspede acolhido", "Atraso de voo comunicado com antecedência"],
        ["Horário previsto", "Recepção noturna a postos às 23h"],
        ["Solução IArretada", "Check-in expresso com acomodação preparada"],
        ["Valor para a equipe", "Hospitalidade nos detalhes e hóspede encantado"]
      ]
    }
  };

  const phone = "5573999313401";
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  // Mobile Menu
  const menu = document.querySelector("#menu");
  const toggle = document.querySelector(".menu-button");
  const header = document.querySelector(".site-header");
  const syncHeaderHeight = () => {
    if (header) {
      document.documentElement.style.setProperty("--header-height", header.getBoundingClientRect().height + "px");
    }
  };
  syncHeaderHeight();
  if (header) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  }
  function closeMenu(){
    if (menu && toggle) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const open = menu.classList.contains("open");
        closeMenu();
        if (open) toggle.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!event.target.closest(".nav")) closeMenu();
    });
    window.matchMedia("(max-width: 800px)").addEventListener("change", closeMenu);
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  }

  // Fallback de imagem
  document.querySelectorAll("[data-image]").forEach(image => {
    const fail = () => image.parentElement && image.parentElement.classList.add("media-failed");
    image.addEventListener("error", fail, { once: true });
    if (image.complete && image.naturalWidth === 0) fail();
  });

  // Interatividade das Demonstrações
  document.querySelectorAll(".demo-shell").forEach(shell => {
    shell.addEventListener("click", event => {
      const button = event.target.closest("[data-demo]");
      if (!button) return;
      const demo = demos[button.dataset.demo];
      if (!demo) return;
      shell.querySelectorAll("[data-demo]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
      const node = shell.querySelector("[data-demo-content]");
      if (node) {
        node.style.opacity = "0";
        node.style.transform = "translateY(6px)";
        setTimeout(() => {
          node.innerHTML = "<div class='demo-intro'><h3>" + escapeHTML(demo.title) + "</h3><p>" + escapeHTML(demo.description) + "</p></div><div class='demo-grid'><div class='demo-column'><h4>Na conversa</h4><div class='bubble'>" + escapeHTML(demo.question) + "</div><div class='bubble reply'>" + demo.answer + "</div></div><div class='demo-column'><h4>Para a equipe</h4>" + demo.records.map(([label, value]) => "<div class='record'><span>" + escapeHTML(label) + "</span><strong>" + escapeHTML(value) + "</strong></div>").join("") + "</div></div>";
          node.style.transition = "opacity 0.28s ease, transform 0.28s ease";
          node.style.opacity = "1";
          node.style.transform = "translateY(0)";
        }, 120);
      }
      const link = shell.querySelector("[data-demo-link]");
      if (link) {
        link.href = "/contato/?assunto=" + encodeURIComponent(demo.label);
      }
    });
  });

  // Controles do Vídeo Hero
  const video = document.querySelector("#hero-video");
  if (video) {
    const play = document.querySelector("[data-video-play]");
    const sound = document.querySelector("[data-video-sound]");
    video.controls = false;
    video.muted = true;
    video.loop = true;
    if (reduced()) { video.removeAttribute("autoplay"); video.pause(); }
    const update = () => {
      if (play) {
        play.textContent = video.ended ? "Rever apresentação" : video.paused ? "Reproduzir apresentação" : "Pausar animação";
      }
    };
    if (play) {
      play.addEventListener("click", async () => {
        if (video.paused || video.ended) {
          if (video.ended) video.currentTime = 0;
          try { await video.play(); } catch { video.controls = true; }
        } else {
          video.pause();
        }
        update();
      });
    }
    if (sound) {
      sound.addEventListener("click", () => {
        video.muted = !video.muted;
        sound.textContent = video.muted ? "Ativar som" : "Silenciar";
        sound.setAttribute("aria-pressed", String(!video.muted));
      });
    }
    ["play", "pause", "ended"].forEach(name => video.addEventListener(name, update));
    video.addEventListener("error", () => {
      if (play) { play.disabled = true; play.textContent = "Vídeo indisponível"; }
      if (sound) { sound.disabled = true; }
    }, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
      else if (!reduced() && !navigator.connection?.saveData) video.play().catch(update);
    });
    if (!reduced() && !navigator.connection?.saveData) {
      video.play().catch(update);
    } else {
      update();
    }
  }

  // Formulário de Contato
  const form = document.querySelector("#contact-form");
  if (form) {
    let submitted = false;
    const subject = form.querySelector("#subject");
    if (subject) {
      subject.value = (new URLSearchParams(location.search).get("assunto") || "").slice(0, 150);
    }
    const sendStatus = form.querySelector("#send-status");
    const submit = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity() || (submit && submit.disabled) || submitted) return;
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const whatsapp = String(data.get("whatsapp") || "").trim();
      const email = String(data.get("email") || "").trim();
      const context = String(data.get("context") || "").trim();
      const subjectText = String(data.get("subject") || "").trim();
      const challenge = String(data.get("challenge") || "").trim();
      const consent = data.get("consent") !== null;
      if (String(data.get("website_hp") || "").trim()) return;
      if (name.length < 2 || whatsapp.replace(/\D/g, "").length < 10 || challenge.length < 5 || !consent) {
        if (sendStatus) sendStatus.textContent = "Confira nome, WhatsApp com DDD, necessidade e consentimento.";
        return;
      }
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Enviando...";
      }
      if (sendStatus) sendStatus.textContent = "";
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, whatsapp, email, business_type: context, improvement_need: (subjectText ? subjectText + " — " : "") + challenge, consent, website_hp: "" })
        });
        const result = await res.json();
        if (!res.ok || result.success !== true) {
          if (sendStatus) sendStatus.textContent = result.message || "Não foi possível registrar sua solicitação. Tente novamente.";
          return;
        }
        if (sendStatus) sendStatus.textContent = result.message || "Solicitação registrada.";
        submitted = true;
        const message = ["Olá, IArretada! Enviei uma solicitação pelo site.", "Meu nome: " + name, "Contexto: " + context, "Assunto: " + subjectText, "O que quero desenrolar: " + challenge].filter(Boolean).join("\n");
        const box = form.querySelector("#message-box");
        if (box) {
          form.querySelector("#message-preview").textContent = message;
          form.querySelector("#whatsapp-link").href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
          form.querySelector("#form-status").textContent = "Solicitação registrada. Se quiser, continue a conversa pelo WhatsApp oficial.";
          box.hidden = false;
          box.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "nearest" });
        }
        const copyBtn = form.querySelector("#copy-message");
        if (copyBtn) {
          copyBtn.onclick = async () => {
            try {
              await navigator.clipboard.writeText(message);
              form.querySelector("#form-status").textContent = "Mensagem copiada.";
            } catch {
              form.querySelector("#form-status").textContent = "Selecione o texto para copiar.";
            }
          };
        }
      } catch {
        if (sendStatus) sendStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      } finally {
        if (submit) {
          submit.disabled = submitted;
          submit.textContent = submitted ? "Solicitação enviada" : "Enviar solicitação →";
        }
      }
    });
  }

  // =========================================================================
  // IARRETADO 3D WEBGL ENGINE (Totalmente 3D, Rotacionando e Piscando)
  // =========================================================================
  function createIArretado3D(container, size = 70) {
    const canvas = document.createElement("canvas");
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.display = "block";
    canvas.style.borderRadius = "50%";
    container.replaceChildren(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      const fallback = document.createElement("img");
      fallback.src = "/assets/iarretado/iarretado.webp";
      fallback.width = size;
      fallback.height = size;
      container.replaceChildren(fallback);
      return;
    }

    let angleX = 0.3;
    let angleY = 0;
    let angleZ = 0;
    let time = 0;
    let isBlinking = false;
    let blinkProgress = 0;
    let targetAngleX = 0.3;
    let targetAngleY = 0;

    // Interatividade com o mouse
    window.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      targetAngleY = dx * 1.2;
      targetAngleX = 0.3 + dy * 0.8;
    }, { passive: true });

    function render() {
      time += 0.035;
      angleY += 0.022; // Rotação contínua 3D
      angleX += (targetAngleX - angleX) * 0.05;

      // Piscar sincronizado com micro-pulsos
      const cycle = Math.sin(time * 0.85);
      if (cycle > 0.985 && !isBlinking) {
        isBlinking = true;
        blinkProgress = 0;
      }
      if (isBlinking) {
        blinkProgress += 0.15;
        if (blinkProgress >= Math.PI) {
          isBlinking = false;
          blinkProgress = 0;
        }
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = (w / 2) * 0.72;

      ctx.clearRect(0, 0, w, h);

      // 1. Aura e Brilho Atmosférico Fluido (Liquid Glow)
      const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.35);
      const pulseOpacity = 0.45 + Math.sin(time * 2.2) * 0.15;
      glowGrad.addColorStop(0, `rgba(33, 150, 243, ${pulseOpacity})`);
      glowGrad.addColorStop(0.55, `rgba(0, 212, 255, ${pulseOpacity * 0.4})`);
      glowGrad.addColorStop(1, "rgba(10, 25, 47, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Anéis Orbitais 3D Exteriores (Giro no espaço tridimensional)
      ctx.save();
      ctx.translate(cx, cy);
      
      // Anel 1 (Inclinado)
      ctx.save();
      ctx.rotate(angleY * 0.9);
      ctx.scale(1, Math.cos(angleX * 1.4));
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.15, r * 0.55, 0, 0, Math.PI * 2);
      ctx.lineWidth = 2.2 * window.devicePixelRatio;
      ctx.strokeStyle = "rgba(64, 196, 255, 0.75)";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10 * window.devicePixelRatio;
      ctx.stroke();
      ctx.restore();

      // Anel 2 (Cruzado)
      ctx.save();
      ctx.rotate(-angleY * 1.1 + Math.PI / 3);
      ctx.scale(Math.cos(angleX * 1.2), 1);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.6, r * 1.2, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1.8 * window.devicePixelRatio;
      ctx.strokeStyle = "rgba(0, 229, 255, 0.65)";
      ctx.shadowColor = "#2979ff";
      ctx.shadowBlur = 8 * window.devicePixelRatio;
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // 3. Esfera Central Metálica 3D com Sombreamento Esférico
      ctx.save();
      const lightX = cx - r * 0.35 + Math.sin(angleY) * (r * 0.15);
      const lightY = cy - r * 0.35 + Math.cos(angleX) * (r * 0.15);
      const sphereGrad = ctx.createRadialGradient(lightX, lightY, r * 0.05, cx, cy, r);
      sphereGrad.addColorStop(0, "#ffffff");
      sphereGrad.addColorStop(0.18, "#80d8ff");
      sphereGrad.addColorStop(0.45, "#0091ea");
      sphereGrad.addColorStop(0.75, "#0d47a1");
      sphereGrad.addColorStop(0.95, "#061838");
      sphereGrad.addColorStop(1, "#020a17");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Linhas de Latitude/Longitude Tecnológicas
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = "rgba(128, 222, 234, 0.3)";
      ctx.lineWidth = 1.2 * window.devicePixelRatio;
      for (let i = -2; i <= 2; i++) {
        const yOffset = (r / 3) * i;
        const radAtY = Math.sqrt(Math.max(0, r * r - yOffset * yOffset));
        ctx.beginPath();
        const squish = Math.sin(angleX + i * 0.3);
        ctx.ellipse(cx, cy + yOffset, radAtY, radAtY * Math.abs(squish) * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Olho / Núcleo Óptico Piscando (Blinking Core)
      const eyeScaleY = isBlinking ? Math.max(0.08, Math.cos(blinkProgress)) : (1 + Math.sin(time * 3) * 0.12);
      const eyeX = cx + Math.sin(angleY) * (r * 0.22);
      const eyeY = cy + Math.sin(angleX) * (r * 0.18);

      const eyeGlow = ctx.createRadialGradient(eyeX, eyeY, 1, eyeX, eyeY, r * 0.35);
      eyeGlow.addColorStop(0, "#ffffff");
      eyeGlow.addColorStop(0.4, "#00e5ff");
      eyeGlow.addColorStop(0.85, "rgba(0, 145, 234, 0.4)");
      eyeGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.save();
      ctx.translate(eyeX, eyeY);
      ctx.scale(1, eyeScaleY);
      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Pupila Brilhante / Foco de IA
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 12 * window.devicePixelRatio;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      if (!reduced()) {
        requestAnimationFrame(render);
      }
    }

    render();
  }

  // =========================================================================
  // ASSISTENTE VIRTUAL IARRETADO & COMPONENTE WHATSAPP DIRETO
  // =========================================================================
  const topics = [
    {
      id: "servicos",
      label: "O que vocês fazem?",
      terms: ["fazem", "servico", "solucao", "oferece", "atendimento", "chatbot", "assistente"],
      answer: "Olá! Sou o IArretado! Desenvolvemos soluções práticas de IA para atendimento no WhatsApp, automações de tarefas repetitivas, organização de processos internos, sites modernos e comunicação visual.<br><br><strong>Você sabia que com a IArretada, nós conseguimos te ajudar fazendo:</strong><br>• Atendimento inteligente que nunca dorme e acolhe cada cliente pelo nome;<br>• Conexão dos seus pedidos direto com a equipe sem ruídos;<br>• Economia de tempo para você focar no que mais importa: as pessoas?",
      link: "/solucoes/",
      linkLabel: "Conhecer todas as soluções"
    },
    {
      id: "automacao",
      label: "Automação de quê?",
      terms: ["automacao", "automatizar", "repetitiva", "rotina", "tarefa", "planilha"],
      answer: "Automatizamos tudo o que rouba o seu tempo no dia a dia: registro de pedidos do WhatsApp, emissão de avisos, triagem de clientes, controle de pendências e integração com suas planilhas e sistemas.<br><br><strong>Você sabia que com a IArretada, nós conseguimos te ajudar fazendo:</strong><br>• Eliminação de retrabalho e digitação manual repetitiva;<br>• Notificações imediatas no celular da equipe responsável;<br>• Organização impecável sem complicação técnica?",
      link: "/servicos/automacoes/",
      linkLabel: "Ver automações"
    },
    {
      id: "preco",
      label: "Quanto custa?",
      terms: ["preco", "valor", "custa", "99", "orcamento", "investimento"],
      answer: "Para pessoas físicas, nossa automação pessoal de rotina tem o valor acessível anunciado de R$ 99,99.<br><br>Já para empresas e projetos sob medida (como chatbots de WhatsApp, integrações de sistemas e hotelaria), o orçamento é montado especificamente para o tamanho da sua necessidade, cabendo no seu bolso.<br><br>Gostaria de falar direto com a gente para desenrolar uma proposta?",
      link: "/servicos/automacoes/",
      linkLabel: "Entender a oferta"
    },
    {
      id: "hotelaria",
      label: "E para hotéis?",
      terms: ["hotel", "pousada", "hospede", "recepcao", "check-in", "turismo"],
      answer: "Para hotéis e pousadas, a IArretada une tecnologia de ponta ao acolhimento baiano!<br><br><strong>Você sabia que com a IArretada, nós conseguimos te ajudar fazendo:</strong><br>• Pré-check-in ágil pelo WhatsApp para evitar filas no balcão;<br>• Atendimento de dúvidas sobre horários, café da manhã e passeios 24h;<br>• Encaminhamento automático de pedidos de governança e transfer para a equipe com contexto completo?",
      link: "/hotelaria/",
      linkLabel: "Ver soluções de hotelaria"
    },
    {
      id: "processo",
      label: "Como começa?",
      terms: ["comeca", "contratar", "prazo", "etapa", "processo", "funciona", "projeto"],
      answer: "Começar é simples e sem susto! Você nos conta onde o nó aperta na sua rotina. Nós entendemos o seu negócio, desenhamos uma solução sob medida e validamos cada detalhe com você antes de colocar no ar.<br><br>Bora bater um papo no WhatsApp para desenrolar a sua ideia?",
      link: "/contato/",
      linkLabel: "Iniciar meu projeto"
    },
    {
      id: "privacidade",
      label: "Meus dados ficam seguros?",
      terms: ["dados", "privacidade", "lgpd", "seguranca", "consentimento"],
      answer: "Totalmente seguros! Respeitamos a privacidade e a LGPD. Suas informações não são repassadas a terceiros e usamos criptografia e servidores seguros para processar suas mensagens.",
      link: "/privacidade/",
      linkLabel: "Ler política de privacidade"
    }
  ];

  const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const related = {
    servicos: ["automacao", "hotelaria", "processo"],
    automacao: ["preco", "processo", "servicos"],
    preco: ["automacao", "processo", "privacidade"],
    hotelaria: ["servicos", "processo", "automacao"],
    processo: ["preco", "servicos", "privacidade"],
    privacidade: ["processo", "servicos"]
  };

  // Helper para criar o Box Direto de WhatsApp (NUNCA expõe o número como texto)
  function createWhatsAppBox(ctaTitle = "Bora conversar no WhatsApp?") {
    const card = document.createElement("div");
    card.className = "iar-chat-wa-box";
    card.innerHTML = `
      <div class="iar-wa-box-header">
        <div class="iar-wa-icon-wrap" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.17 8.17 0 0 1-1.25-4.47c0-4.54 3.7-8.24 8.24-8.24z"/>
          </svg>
        </div>
        <div class="iar-wa-box-texts">
          <strong>${escapeHTML(ctaTitle)}</strong>
          <span>Atendimento direto com José e equipe IArretada</span>
        </div>
      </div>
      <a class="iar-wa-box-btn" href="https://wa.me/${phone}?text=${encodeURIComponent("Olá, IArretada! Gostaria de conversar sobre soluções de IA para o meu negócio.")}" target="_blank" rel="noopener noreferrer">
        <span>Conversar no WhatsApp</span>
        <span aria-hidden="true">↗</span>
      </a>
    `;
    return card;
  }

  // Sanitizador estrito: Remove qualquer número de telefone de textos
  function sanitizePhoneFromText(text) {
    if (!text) return "";
    return text
      .replace(/(\+?55\s*)?(\(?73\)?\s*)?9?\d{4}[-\s]?\d{4}/gi, "")
      .replace(/\+55\s*73\s*99931-?3401/gi, "")
      .replace(/ligue para [^.,\n]*/gi, "clique no botão abaixo")
      .replace(/pelo WhatsApp[:\s]*(\+?\d[\d\s-]+)?/gi, "pelo nosso WhatsApp abaixo:")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  // Montagem do Widget IArretado
  const chat = document.createElement("aside");
  chat.className = "iar-chat";
  chat.innerHTML = `
    <button class="iar-chat-toggle" type="button" aria-expanded="false" aria-controls="iar-chat-panel">
      <span class="iar-chat-avatar" id="iarAvatarMini" aria-hidden="true"></span>
      <span class="iar-chat-toggle-text">
        <strong>IArretado</strong>
        <small>Pergunte ao assistente</small>
      </span>
    </button>
    <section class="iar-chat-panel" id="iar-chat-panel" aria-label="Conversa com o IArretado" hidden>
      <div class="iar-chat-head">
        <div class="iar-chat-head-info">
          <strong>IArretado</strong>
          <small>Assistente Oficial • IArretada</small>
        </div>
        <button type="button" class="iar-chat-close" aria-label="Fechar conversa">×</button>
      </div>
      <div class="iar-chat-character" aria-hidden="true">
        <div class="iar-3d-character-stage" id="iarCharacter3D"></div>
      </div>
      <div class="iar-chat-messages" role="log" aria-live="polite" aria-relevant="additions">
        <div class="iar-chat-message bot">
          <p>Olá! Tudo bem? Sou o <strong>IArretado</strong>, seu assistente da IArretada!<br>Estou aqui para tirar suas dúvidas, apresentar soluções práticas de IA e te ajudar a desenrolar a sua ideia. O que você gostaria de saber?</p>
        </div>
      </div>
      <div class="iar-chat-prompts"></div>
      <form class="iar-chat-form">
        <label class="sr-only" for="iar-chat-input">Sua pergunta ao IArretado</label>
        <input id="iar-chat-input" maxlength="500" placeholder="Digite sua pergunta aqui..." required autocomplete="off">
        <button type="submit" aria-label="Enviar pergunta">→</button>
      </form>
      <p class="iar-chat-disclosure">Conversa com IA. Para atendimento humano direto, clique no botão de WhatsApp.</p>
    </section>
  `;
  document.body.append(chat);

  // Inicializar Esferas 3D
  const avatarMini = chat.querySelector("#iarAvatarMini");
  const character3D = chat.querySelector("#iarCharacter3D");
  if (avatarMini) createIArretado3D(avatarMini, 52);
  if (character3D) createIArretado3D(character3D, 76);

  const chatToggle = chat.querySelector(".iar-chat-toggle");
  const panel = chat.querySelector(".iar-chat-panel");
  const chatInput = chat.querySelector("#iar-chat-input");
  const messages = chat.querySelector(".iar-chat-messages");
  const prompts = chat.querySelector(".iar-chat-prompts");

  function showSuggestions(question = "") {
    const query = normalize(question);
    const ranked = topics.map(topic => ({
      topic,
      score: topic.terms.reduce((total, term) => total + (query.includes(term) ? 1 : 0), 0)
    })).sort((a, b) => b.score - a.score);
    const match = ranked[0]?.score > 0 ? ranked[0].topic : null;
    const options = match ? (related[match.id] || []).map(id => topics.find(t => t.id === id)).filter(Boolean) : topics.slice(0, 3);
    prompts.replaceChildren();
    options.forEach(topic => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = topic.label;
      button.addEventListener("click", () => respond(topic.label));
      prompts.append(button);
    });
    const whatsapp = document.createElement("a");
    whatsapp.href = "https://wa.me/" + phone + "?text=" + encodeURIComponent("Olá, IArretada! Tenho uma dúvida sobre seus serviços de IA.");
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.innerHTML = "Falar no WhatsApp ↗";
    prompts.append(whatsapp);
  }
  showSuggestions();

  function setChatOpen(open) {
    panel.hidden = !open;
    chatToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      chatInput.focus();
    } else {
      chatToggle.focus();
    }
  }

  chatToggle.addEventListener("click", () => setChatOpen(panel.hidden));
  chat.querySelector(".iar-chat-close").addEventListener("click", () => setChatOpen(false));
  chat.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) {
      event.stopPropagation();
      setChatOpen(false);
    }
  });

  function addMessage(value, kind, options = {}) {
    const item = document.createElement("div");
    item.className = "iar-chat-message " + kind;
    const p = document.createElement("p");
    p.innerHTML = value;
    item.append(p);

    if (options.link) {
      const link = document.createElement("a");
      link.href = options.link;
      link.className = "iar-chat-link";
      link.innerHTML = (options.linkLabel || "Ver mais") + " →";
      item.append(link);
    }

    if (options.showWhatsAppBox) {
      item.append(createWhatsAppBox(options.whatsAppTitle || "Bora conversar no WhatsApp?"));
    }

    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
  }

  const history = [];
  let answering = false;

  async function respond(question) {
    if (answering) return;
    answering = true;
    addMessage(escapeHTML(question), "visitor");

    const waiting = document.createElement("div");
    waiting.className = "iar-chat-message bot iar-chat-waiting";
    waiting.innerHTML = "<p>Pensando com carinho na resposta…</p>";
    messages.append(waiting);
    messages.scrollTop = messages.scrollHeight;

    const submit = chat.querySelector('.iar-chat-form button');
    if (submit) submit.disabled = true;

    // Verificar se a pergunta coincide com tópicos locais imediatos
    const query = normalize(question);
    const localMatch = topics.find(t => t.terms.some(term => query.includes(term)));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history })
      });
      const result = await response.json();
      waiting.remove();

      if (!response.ok) throw new Error(result.message || 'O IArretado está indisponível no momento.');

      let cleanMsg = sanitizePhoneFromText(result.message);
      const shouldOfferWa = Boolean(result.offerWhatsApp) || /whatsapp|contato|falar|equipe|ligar|proposta|orcamento|atendimento humano/i.test(question + " " + cleanMsg);

      addMessage(cleanMsg, "bot", {
        showWhatsAppBox: shouldOfferWa,
        whatsAppTitle: "Conversar com a Equipe IArretada"
      });

      history.push({ role: "user", content: question }, { role: "assistant", content: cleanMsg });
      if (history.length > 6) history.splice(0, history.length - 6);
      showSuggestions(question);
    } catch (error) {
      waiting.remove();
      const fallbackText = localMatch ? localMatch.answer : "Não consegui consultar meus sistemas agora, mas não te deixo na mão! Nossa equipe está pronta para te atender com o maior prazer no WhatsApp:";
      addMessage(fallbackText, "bot", {
        link: localMatch ? localMatch.link : "/contato/",
        linkLabel: localMatch ? localMatch.linkLabel : "Página de Contato",
        showWhatsAppBox: true,
        whatsAppTitle: "Falar direto no WhatsApp"
      });
      showSuggestions("");
    } finally {
      answering = false;
      if (submit) submit.disabled = false;
      chatInput.focus();
    }
  }

  chat.querySelector(".iar-chat-form").addEventListener("submit", event => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = "";
    respond(question);
    chatInput.focus();
  });
})();
