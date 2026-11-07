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
  // IARRETADO 3D EMBLEM ENGINE (Símbolo Oficial 3D: Rodando, Piscando e Se Movendo Entre Si)
  // "o simbolo do iarretado seja esse se movendo entre si 3d, rodando e piscando"
  // =========================================================================
  function createIArretado3D(container, size = 80) {
    const canvas = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.display = "block";
    canvas.style.borderRadius = "50%";
    container.replaceChildren(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      const fallback = document.createElement("img");
      fallback.src = "/assets/brand/iarretada-mark.png";
      fallback.width = size;
      fallback.height = size;
      fallback.alt = "IArretado";
      container.replaceChildren(fallback);
      return;
    }

    // Camadas do símbolo oficial da IArretada
    const layers = {
      full: new Image(),
      blue: new Image(),
      lime: new Image(),
      dot: new Image()
    };
    layers.full.src = "/assets/brand/iarretada-mark-full.png";
    layers.blue.src = "/assets/brand/iarretada-mark-blue.png";
    layers.lime.src = "/assets/brand/iarretada-mark-lime.png";
    layers.dot.src = "/assets/brand/iarretada-mark-dot.png";

    let time = Math.random() * 20;
    let targetAngleX = 0;
    let targetAngleY = 0;
    let curAngleX = 0;
    let curAngleY = 0;
    let continuousSpin = 0;

    // Interatividade com o cursor/toque
    window.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (cy - e.clientY) / (window.innerHeight * 0.5);
      targetAngleY = Math.max(-0.6, Math.min(0.6, dx * 0.6));
      targetAngleX = Math.max(-0.5, Math.min(0.5, dy * 0.5));
    }, { passive: true });

    function render() {
      time += 0.038;
      continuousSpin += 0.024; // Rotação contínua ("rodando")
      curAngleX += (targetAngleX - curAngleX) * 0.08;
      curAngleY += (targetAngleY - curAngleY) * 0.08;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseDim = w * 0.88;

      ctx.clearRect(0, 0, w, h);

      // 1. Aura e Brilho Fluido (Liquid Glow de Fundo)
      const pulse = 0.42 + Math.sin(time * 2.5) * 0.2;
      const glowRad = baseDim * 0.75;
      const glowGrad = ctx.createRadialGradient(cx, cy, glowRad * 0.15, cx, cy, glowRad);
      glowGrad.addColorStop(0, `rgba(0, 229, 255, ${pulse * 0.6})`);
      glowGrad.addColorStop(0.4, `rgba(33, 59, 214, ${pulse * 0.4})`);
      glowGrad.addColorStop(0.75, `rgba(163, 230, 53, ${pulse * 0.25})`);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowRad, 0, Math.PI * 2);
      ctx.fill();

      // Se camadas isoladas ainda não carregaram, usa o símbolo mestre como fallback imediato
      const activeBlue = (layers.blue.complete && layers.blue.naturalWidth > 0) ? layers.blue : layers.full;
      const activeLime = (layers.lime.complete && layers.lime.naturalWidth > 0) ? layers.lime : layers.full;
      const activeDot = (layers.dot.complete && layers.dot.naturalWidth > 0) ? layers.dot : layers.full;

      // 2. Cinemática 3D Global: Rotação Ampla ("rodando")
      const globalYaw = Math.sin(continuousSpin) * 0.75 + curAngleY;
      const globalPitch = Math.cos(time * 0.9) * 0.35 + curAngleX;
      const globalRoll = Math.sin(time * 0.7) * 0.12;

      // 3. MOVIMENTO RELATIVO ENTRE SI (SE MOVENDO ENTRE SI 3D)
      // Fita Azul: torção e respiração
      const blueYawOffset = Math.sin(time * 1.6) * 0.22;
      const bluePitchOffset = Math.cos(time * 1.4) * 0.18;
      const blueZ = Math.sin(time * 1.6) * 28;
      const blueScale = 1.0 + Math.sin(time * 1.8) * 0.045;

      // Fita Verde Limão: ondulação fluida contraposta que transpassa a fita azul
      const limeYawOffset = -Math.sin(time * 1.6 + 0.8) * 0.25;
      const limePitchOffset = -Math.cos(time * 1.4 + 0.8) * 0.20;
      const limeZ = -Math.sin(time * 1.6) * 28;
      const limeScale = 1.0 + Math.cos(time * 1.8) * 0.055;

      // Ponto Flutuante (cubo verde topo direito): levitação livre 3D
      const dotFloatX = Math.cos(time * 2.4) * (baseDim * 0.07);
      const dotFloatY = Math.sin(time * 2.8) * (baseDim * 0.08);
      const dotZ = 34 + Math.sin(time * 2.2) * 16;
      const dotRoll = Math.sin(time * 2.2) * 0.25;

      const camDist = baseDim * 3.2;

      function draw3DLayer(img, localYaw, localPitch, localRoll, localZ, scaleMult, offsetX = 0, offsetY = 0, sheenPhase = 0) {
        if (!img.complete || img.naturalWidth === 0) return;
        ctx.save();
        const pScale = camDist / (camDist + localZ);
        const finalScale = pScale * scaleMult;
        const px = cx + offsetX * pScale;
        const py = cy + offsetY * pScale;

        ctx.translate(px, py);
        ctx.rotate(globalRoll + localRoll);

        const totalYaw = globalYaw + localYaw;
        const totalPitch = globalPitch + localPitch;

        ctx.scale(
          Math.cos(totalYaw) * finalScale,
          Math.cos(totalPitch) * finalScale
        );

        ctx.drawImage(img, -baseDim / 2, -baseDim / 2, baseDim, baseDim);

        // Brilho Líquido Especular
        if (sheenPhase > 0) {
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          const sheenAngle = time * 2.2 + sheenPhase;
          const sheenX = Math.sin(sheenAngle) * (baseDim * 0.5);
          const sheenY = Math.cos(sheenAngle) * (baseDim * 0.5);
          const sheenGrad = ctx.createRadialGradient(sheenX, sheenY, 0, sheenX, sheenY, baseDim * 0.45);
          sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
          sheenGrad.addColorStop(0.3, "rgba(0, 229, 255, 0.4)");
          sheenGrad.addColorStop(0.65, "rgba(163, 230, 53, 0.15)");
          sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = sheenGrad;
          ctx.beginPath();
          ctx.arc(0, 0, baseDim * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      }

      // Ordenação dinâmica de profundidade (Z-Sorting Real)
      const renderList = [
        {
          name: "blue",
          z: blueZ,
          draw: () => draw3DLayer(activeBlue, blueYawOffset, bluePitchOffset, 0, blueZ, blueScale, 0, 0, 0.5)
        },
        {
          name: "lime",
          z: limeZ,
          draw: () => draw3DLayer(activeLime, limeYawOffset, limePitchOffset, 0, limeZ, limeScale, 0, 0, 1.4)
        },
        {
          name: "dot",
          z: dotZ,
          draw: () => {
            ctx.save();
            ctx.beginPath();
            const shadowX = cx + (baseDim * 0.28) + dotFloatX * 0.6;
            const shadowY = cy - (baseDim * 0.22) + dotFloatY * 0.4 + 10;
            ctx.ellipse(shadowX, shadowY, baseDim * 0.12, baseDim * 0.06, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(10, 20, 60, 0.35)";
            ctx.fill();
            ctx.restore();

            draw3DLayer(activeDot, 0, 0, dotRoll, dotZ, 1.0, dotFloatX, dotFloatY, 2.5);
          }
        }
      ];

      renderList.sort((a, b) => a.z - b.z);
      renderList.forEach(layer => layer.draw());

      // 5. PISCAR CONFORME O VÍDEO DA LANDING (Pulso Óptico Cintilante / Blinking Pulse)
      const blinkCycle = Math.sin(time * 1.8);
      if (blinkCycle > 0.7) {
        const blinkPower = (blinkCycle - 0.7) / 0.3;
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        
        const blinkX = cx + Math.sin(time * 0.6) * (baseDim * 0.12);
        const blinkY = cy + Math.cos(time * 0.6) * (baseDim * 0.12) - baseDim * 0.08;
        const starGrad = ctx.createRadialGradient(blinkX, blinkY, 0, blinkX, blinkY, baseDim * 0.35 * blinkPower);
        starGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        starGrad.addColorStop(0.2, "rgba(0, 229, 255, 0.85)");
        starGrad.addColorStop(0.55, "rgba(163, 230, 53, 0.45)");
        starGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(blinkX, blinkY, baseDim * 0.35 * blinkPower, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${blinkPower * 0.9})`;
        ctx.lineWidth = 1.8 * window.devicePixelRatio;
        const rayLen = baseDim * 0.28 * blinkPower;
        ctx.beginPath();
        ctx.moveTo(blinkX - rayLen, blinkY);
        ctx.lineTo(blinkX + rayLen, blinkY);
        ctx.moveTo(blinkX, blinkY - rayLen);
        ctx.lineTo(blinkX, blinkY + rayLen);
        ctx.stroke();

        ctx.restore();
      }

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
  if (character3D) createIArretado3D(character3D, 86);

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

  // =========================================================================
  // SIMULADOR INTERATIVO DE ECONOMIA DE TEMPO
  // =========================================================================
  const calcContainer = document.querySelector("#calculadora");
  if (calcContainer) {
    const optButtons = calcContainer.querySelectorAll(".calc-opt");
    const sectorSelect = calcContainer.querySelector("#calc-sector");
    const hoursDisplay = calcContainer.querySelector("#calc-hours");
    const ctaBtn = calcContainer.querySelector("#calc-cta-btn");

    let currentMsgs = 35;

    function updateCalc() {
      // 3 minutos por mensagem repetitiva (digitação, conferência, envio de dados)
      // 30 dias por mês
      const hoursPerMonth = Math.round((currentMsgs * 3.5 * 30) / 60);
      const sectorName = sectorSelect ? sectorSelect.options[sectorSelect.selectedIndex].text : "Empresa";
      
      if (hoursDisplay) {
        hoursDisplay.textContent = `~${hoursPerMonth} horas`;
      }

      if (ctaBtn) {
        const msg = encodeURIComponent(`Olá José! Fiz a simulação no site para ${sectorName} (~ ${currentMsgs} msgs/dia) e vi que perco cerca de ${hoursPerMonth}h/mês. Gostaria de desenrolar uma automação [Origem: Calculadora]!`);
        ctaBtn.href = `https://wa.me/5573999313401?text=${msg}`;
        ctaBtn.textContent = `Economizar essas ${hoursPerMonth}h/mês no WhatsApp →`;
      }
    }

    optButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        optButtons.forEach(b => {
          b.classList.remove("active");
          b.style.background = "";
          b.style.color = "";
          b.style.borderColor = "";
        });
        btn.classList.add("active");
        btn.style.background = "var(--blue)";
        btn.style.color = "#fff";
        btn.style.borderColor = "var(--blue)";
        currentMsgs = Number(btn.dataset.val) || 35;
        updateCalc();
      });
    });

    if (sectorSelect) {
      sectorSelect.addEventListener("change", updateCalc);
    }

    updateCalc();
  }

})();