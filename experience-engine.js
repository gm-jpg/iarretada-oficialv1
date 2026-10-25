/**
 * IArretada — Immersive Experience Engine
 * Conforme Adendo Técnico Avançado (DOM-First, WebGL procedural, Magnetic UI, System Twins, Interactive Demos)
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. AMBIENT PROCEDURAL CANVAS (60 FPS, DPR Capped, Low-GPU Overhead)
     ========================================================================== */
  function initAmbientCanvas() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.documentElement.classList.contains('a11y-motion-paused')) return;

    let canvas = document.getElementById('ambient-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ambient-canvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const PARTICLE_COUNT = Math.min(window.innerWidth > 900 ? 32 : 16, 40);
    let animId = null;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    function createParticles() {
      particles = [];
      const colors = [
        'rgba(226, 194, 117, 0.45)', // Ouro mineral
        'rgba(233, 109, 81, 0.28)',  // Coral sutil
        'rgba(20, 41, 31, 0.18)',    // Floresta leve
        'rgba(244, 239, 228, 0.6)'   // Luz creme
      ];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(Math.random() * 0.4 + 0.1),
          alpha: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * 0.03 + 0.01
        });
      }
    }

    function render() {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Scroll response
      const currentScrollY = window.scrollY;
      scrollVelocity = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy - scrollVelocity * 0.5;
        p.x += p.vx;

        // Wrap around viewport
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    }, { passive: true });

    resize();
    createParticles();
    animId = requestAnimationFrame(render);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
      } else {
        lastScrollY = window.scrollY;
        animId = requestAnimationFrame(render);
      }
    });
  }

  /* ==========================================================================
     2. MAGNETIC BUTTONS (Subtle 8px cursor attraction)
     ========================================================================== */
  function initMagneticButtons() {
    if (window.innerWidth < 900) return; // Touch screens disabled
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const btns = document.querySelectorAll('.btn-cta-coral, .btn-glass-explore, .btn-magnetic');

    btns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 80) {
          const deltaX = (e.clientX - centerX) * 0.16;
          const deltaY = (e.clientY - centerY) * 0.16;
          btn.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  /* ==========================================================================
     3. PHYSICAL LIQUID GLASS SPECULAR TRACKER
     ========================================================================== */
  function initLiquidGlassPhysical() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.liquid-glass-physical, .liquid-glass');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left - 40 &&
          e.clientX <= rect.right + 40 &&
          e.clientY >= rect.top - 40 &&
          e.clientY <= rect.bottom + 40
        ) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
          card.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
        }
      });
    }, { passive: true });
  }

  /* ==========================================================================
     4. INTERACTIVE CHATBOT LOGIC TREE DEMO (ITEM 16)
     Customer → Intent → Knowledge Base → Business Rule → Outcome
     ========================================================================== */
  const CHATBOT_SCENARIOS = {
    pet: {
      question: '“Vocês aceitam pet de pequeno porte?”',
      step1: 'Classificação de Intenção',
      step1Desc: 'Detecta `politicas_hospedagem.pet` com 99.4% de confiança.',
      step2: 'Consulta Base de Conhecimento',
      step2Desc: 'Recupera manual de hospitalidade: aceita até 12kg, exige vacinação.',
      step3: 'Aplicação de Regras de Negócio',
      step3Desc: 'Valida se quarto reservado possui varanda térrea (categoria permitida).',
      step4: 'Resultado Gerado',
      step4Desc: 'Resposta imediata personalizada + envio do Guia Pet IArretada.',
      badgeType: 'auto',
      badgeLabel: '• Resposta Automatizada Completa (1.2s)'
    },
    early_checkin: {
      question: '“Posso entrar às 9h da manhã em vez das 14h?”',
      step1: 'Classificação de Intenção',
      step1Desc: 'Detecta `estadia.checkin_antecipado` com parâmetros de horário.',
      step2: 'Consulta Base de Conhecimento',
      step2Desc: 'Consulta API do Gêmeo Operacional: Quarto 104 desocupado ontem?',
      step3: 'Aplicação de Regras de Negócio',
      step3Desc: 'Regra: Se quarto limpo, libera cortesia; se ocupado, oferece sala de malas e café.',
      step4: 'Resultado Gerado',
      step4Desc: 'Resposta contextual com opções claras e registro na recepção.',
      badgeType: 'auto',
      badgeLabel: '• Resposta Condicional com Consulta Interna'
    },
    wedding: {
      question: '“Preciso fechar 12 quartos para casamento em novembro.”',
      step1: 'Classificação de Intenção',
      step1Desc: 'Detecta `comercial.evento_bloqueio` (alto valor e complexidade).',
      step2: 'Consulta Base de Conhecimento',
      step2Desc: 'Identifica necessidade de bloqueio de datas e tarifas negociadas.',
      step3: 'Aplicação de Regras de Negócio',
      step3Desc: 'REGRA MANDATÓRIA: Bloqueios > 4 quartos NUNCA são automatizados sem humano.',
      step4: 'Transbordo Inteligente',
      step4Desc: 'Briefing pré-estruturado enviado direto ao WhatsApp do Gerente Comercial com dados do noivo.',
      badgeType: 'human',
      badgeLabel: '• Transbordo Humano Prioritário com Pré-Qualificação'
    }
  };

  function initChatbotDemo() {
    const box = document.querySelector('[data-chatbot-demo]');
    if (!box) return;

    const buttons = box.querySelectorAll('[data-scenario]');
    const qEl = box.querySelector('[data-cb-question]');
    const s1Title = box.querySelector('[data-cb-s1-title]');
    const s1Desc = box.querySelector('[data-cb-s1-desc]');
    const s2Title = box.querySelector('[data-cb-s2-title]');
    const s2Desc = box.querySelector('[data-cb-s2-desc]');
    const s3Title = box.querySelector('[data-cb-s3-title]');
    const s3Desc = box.querySelector('[data-cb-s3-desc]');
    const s4Title = box.querySelector('[data-cb-s4-title]');
    const s4Desc = box.querySelector('[data-cb-s4-desc]');
    const badgeEl = box.querySelector('[data-cb-badge]');
    const steps = box.querySelectorAll('.chatbot-flow-step');

    function loadScenario(key) {
      const data = CHATBOT_SCENARIOS[key];
      if (!data) return;

      buttons.forEach((b) => b.classList.toggle('is-active', b.getAttribute('data-scenario') === key));

      if (qEl) qEl.textContent = data.question;
      if (s1Title) s1Title.textContent = data.step1;
      if (s1Desc) s1Desc.textContent = data.step1Desc;
      if (s2Title) s2Title.textContent = data.step2;
      if (s2Desc) s2Desc.textContent = data.step2Desc;
      if (s3Title) s3Title.textContent = data.step3;
      if (s3Desc) s3Desc.textContent = data.step3Desc;
      if (s4Title) s4Title.textContent = data.step4;
      if (s4Desc) s4Desc.textContent = data.step4Desc;

      if (badgeEl) {
        badgeEl.textContent = data.badgeLabel;
        badgeEl.className = `chatbot-outcome-badge chatbot-outcome-badge--${data.badgeType}`;
      }

      // Pulse sequence
      steps.forEach((step, idx) => {
        step.classList.remove('is-highlighted');
        setTimeout(() => {
          step.classList.add('is-highlighted');
        }, idx * 140);
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        loadScenario(btn.getAttribute('data-scenario'));
      });
    });

    loadScenario('pet');
  }

  /* ==========================================================================
     5. INTERACTIVE AUTOMATION PIPELINE DEMO (ITEM 17)
     ========================================================================== */
  function initPipelineDemo() {
    const box = document.querySelector('[data-pipeline-demo]');
    if (!box) return;

    const triggerBtn = box.querySelector('[data-trigger-pipeline]');
    const nodes = box.querySelectorAll('.pipeline-node');
    const logEl = box.querySelector('[data-pipeline-log]');
    let isRunning = false;

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        triggerBtn.disabled = true;
        triggerBtn.textContent = 'Executando fluxo em tempo real...';

        nodes.forEach((n) => n.classList.remove('is-active'));
        if (logEl) logEl.textContent = '• Disparo recebido: Novo lead qualificado no site...';

        const logs = [
          '• 00.1s: Formulário sanitizado e validado contra bots.',
          '• 00.4s: Contato registrado no CRM com tag #hotelaria_direta.',
          '• 00.8s: Lead score atribuído: 85 pontos (Alta prioridade).',
          '• 01.1s: Alerta privado enviado à equipe com resumo do nó.',
          '• 01.5s: Agendamento automático sugerido via calendário.',
          '• 01.9s: Métrica refletida instantaneamente no painel gerencial.'
        ];

        nodes.forEach((node, i) => {
          setTimeout(() => {
            node.classList.add('is-active');
            if (logEl) logEl.textContent = logs[i];

            if (i === nodes.length - 1) {
              setTimeout(() => {
                isRunning = false;
                triggerBtn.disabled = false;
                triggerBtn.textContent = 'Simular Novo Disparo de Automação ↺';
              }, 400);
            }
          }, (i + 1) * 320);
        });
      });
    }
  }

  /* ==========================================================================
     6. OPERATIONAL DIGITAL TWIN / SYSTEM MAP PROGRESSIVE DISCLOSURE (ITEM 7)
     ========================================================================== */
  function initSystemTwinDisclosure() {
    const twins = document.querySelectorAll('[data-system-twin]');
    twins.forEach((twin) => {
      const cards = twin.querySelectorAll('.system-node-card');
      const panel = twin.querySelector('.system-disclosure-panel');
      const titleEl = panel ? panel.querySelector('[data-twin-title]') : null;
      const descEl = panel ? panel.querySelector('[data-twin-desc]') : null;
      const pillsContainer = panel ? panel.querySelector('[data-twin-pills]') : null;
      const solutionEl = panel ? panel.querySelector('[data-twin-solution]') : null;

      cards.forEach((card) => {
        card.addEventListener('click', () => {
          cards.forEach((c) => c.classList.remove('is-active'));
          card.classList.add('is-active');

          const title = card.getAttribute('data-node-title') || card.querySelector('.system-node-card__title')?.textContent || '';
          const desc = card.getAttribute('data-node-desc') || '';
          const pillsRaw = card.getAttribute('data-node-pills') || '';
          const solution = card.getAttribute('data-node-solution') || '';

          if (titleEl) titleEl.textContent = `Nó Operacional: ${title.trim()}`;
          if (descEl) descEl.textContent = desc;
          if (solutionEl) solutionEl.textContent = solution;

          if (pillsContainer) {
            pillsContainer.innerHTML = '';
            if (pillsRaw) {
              pillsRaw.split(',').forEach((p) => {
                const span = document.createElement('span');
                span.className = 'system-sublayer-pill';
                span.textContent = `• ${p.trim()}`;
                pillsContainer.appendChild(span);
              });
            }
          }

          if (panel) {
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    });
  }

  /* ==========================================================================
     7. UNIVERSAL INTERACTIVE DISCOVERY & COMPUTATIONAL CORE (ITENS 20 A 40)
     "Às vezes o problema que aparece não é o problema de verdade. Vamos seguir o fio?"
     ========================================================================== */
  const UNIVERSAL_DISCOVERY_DATA = {
    tempo: {
      tag: 'Investigação de Rotina & Tempo',
      title: '“Estou perdendo muito tempo.”',
      subpaths: [
        { key: 'procurando', label: 'Procurando informações', default: true },
        { key: 'repetindo', label: 'Repetindo tarefas manuais' },
        { key: 'respondendo', label: 'Respondendo as mesmas dúvidas' },
        { key: 'conferindo', label: 'Conferindo erros e retrabalho' },
        { key: 'esperando', label: 'Esperando aprovações e retornos' },
        { key: 'nao_sei', label: 'Não sei exatamente onde ele vai' }
      ],
      details: {
        procurando: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Talvez o problema não seja falta de tempo. Talvez seja informação espalhada entre WhatsApp, planilhas, papéis e na cabeça de quem opera.',
          diagram: 'Documento disperso + WhatsApp do colega + Planilha antiga -> Ruptura de fluxo -> Equipe gasta 40 minutos para achar o que precisava em 5 segundos.',
          steps: ['Centralizar a informação em base leve', 'Padronizar checklists de acesso', 'Conectar busca instantânea', 'Automatizar lembretes de rotina', 'Manter pessoas focadas no cliente']
        },
        repetindo: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Digitar dados de um sistema para o outro ou preencher o mesmo formulário todo dia drena a energia da equipe e gera erros invisíveis.',
          diagram: 'Pedido no WhatsApp -> Digitação manual na planilha -> Cópia para o financeiro -> Cansaço mental e falhas de cadastro.',
          steps: ['Mapear os pontos de digitação repetida', 'Criar integrações silenciosas', 'Eliminar retrabalho manual', 'Validar dados com regras automáticas', 'Liberar a equipe para o atendimento']
        },
        respondendo: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Dúvida repetida não é preguiça do cliente. É sinal evidente de que a informação básica não está no lugar certo ou no momento em que ele mais precisa.',
          diagram: 'Cliente pergunta preço/horário -> Espera 2 horas por resposta -> Desiste ou liga irritado -> Recepção sobrecarregada.',
          steps: ['Criar guia prévio com respostas claras', 'Implantar catálogo/cardápio instantâneo', 'Automatizar triagem com tom acolhedor', 'Transbordar casos complexos para pessoas']
        },
        conferindo: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Se você precisa conferir tudo o que a equipe faz, o problema é a falta de padrão visual e de processos que se auto-verificam.',
          diagram: 'Tarefa executada sem checklist -> Erro passa despercebido -> Chega ao cliente -> Retrabalho urgente e estresse.',
          steps: ['Fichas técnicas e procedimentos visuais', 'Checklists com confirmação de 1 toque', 'Validação automática de etapas', 'Autonomia com responsabilidade clara']
        },
        esperando: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Gargalo de aprovação: quando tudo depende da palavra final do gestor, a operação fica em marcha lenta esperando decisões simples.',
          diagram: 'Equipe pronta -> Dependência de resposta do dono -> Cliente esperando -> Oportunidades perdidas no dia.',
          steps: ['Definir limites claros de autonomia', 'Automatizar aprovações de baixo risco', 'Alertas diretos para exceções reais', 'Fluxo contínuo sem travas desnecessárias']
        },
        nao_sei: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'A sensação de apagar incêndios o dia todo sem saber onde o tempo foi. Isso acontece quando a rotina é reativa em vez de estruturada.',
          diagram: 'Dia começa com imprevistos -> Sem priorização clara -> Fim do expediente sem concluir o importante -> Exaustão.',
          steps: ['Mapear 3 dias típicos de operação', 'Identificar os 3 maiores ladrões de tempo', 'Criar rotinas de abertura e fechamento', 'Implementar melhorias sem descaracterizar']
        }
      }
    },
    perguntas: {
      tag: 'Comunicação & Atendimento',
      title: '“As pessoas perguntam sempre a mesma coisa.”',
      subpaths: [
        { key: 'duvida_preco', label: 'Preços, cardápio ou taxas', default: true },
        { key: 'duvida_horario', label: 'Horários, localização ou regras' },
        { key: 'duvida_status', label: '“Onde está meu pedido / serviço?”' },
        { key: 'nao_sei', label: 'Dúvidas variadas e confusas' }
      ],
      details: {
        duvida_preco: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'O cliente precisa de clareza imediata para decidir. Quando não acha preço ou cardápio fácil, manda mensagem e se cansa na espera.',
          diagram: 'Cliente quer comprar -> Não encontra tabela clara -> Pergunta no WhatsApp -> Espera demorada esfria o interesse.',
          steps: ['Catálogo ou cardápio digital de carregamento em 0.5s', 'Respostas automáticas acolhedoras', 'Link direto com valores e diferenciais', 'Atendente humano focado em fechar a venda']
        },
        duvida_horario: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Informações fundamentais (endereço, estacionamento, horários, políticas) estão escondidas ou desatualizadas no Google e nas redes.',
          diagram: 'Google desatualizado -> Cliente vai na hora errada ou pergunta no balcão -> Atrito desnecessário.',
          steps: ['Atualizar e otimizar Google Meu Negócio', 'Guia prévio de chegada automatizado', 'FAQ inteligente na recepção', 'Paz para a equipe trabalhar']
        },
        duvida_status: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Falta de visibilidade: o cliente pergunta porque não sabe em qual fase o trabalho dele está.',
          diagram: 'Serviço em andamento -> Cliente no escuro -> Mensagens diárias cobrando posição -> Perda de tempo da equipe.',
          steps: ['Página de status simples e transparente', 'Avisos automáticos a cada etapa concluída', 'Tranquilidade para quem compra e para quem faz']
        },
        nao_sei: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'O tom de comunicação pode estar confuso, gerando ruído e interpretações erradas sobre o que a empresa realmente entrega.',
          diagram: 'Proposta genérica -> Cliente não entende o escopo -> Múltiplas dúvidas desencontradas.',
          steps: ['Clareza editorial na linguagem', 'Apresentação direta do que você resolve', 'Comunicação sem jargões corporativos']
        }
      }
    },
    informacao: {
      tag: 'Organização de Bastidores',
      title: '“A informação fica espalhada.”',
      subpaths: [
        { key: 'memoria', label: 'Fica na cabeça de quem faz', default: true },
        { key: 'whatsapp_solto', label: 'Perdida em conversas de WhatsApp' },
        { key: 'planilhas_muitas', label: 'Várias planilhas que não batem' },
        { key: 'papeis', label: 'Cadernos, blocos e papéis soltos' }
      ],
      details: {
        memoria: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Quando o negócio depende da memória das pessoas, qualquer falta, férias ou troca de turno vira um momento de caos.',
          diagram: 'Colaborador chave ausente -> Ninguém sabe como fazer -> Cliente prejudicado -> Sobrecarga do dono.',
          steps: ['Registrar procedimentos essenciais em linguagem simples', 'Checklists visuais fáceis de consultar', 'Autonomia real sem dependência exclusiva']
        },
        whatsapp_solto: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'WhatsApp é ótimo para conversar, péssimo para guardar histórico de decisões, pedidos e aprovações de clientes.',
          diagram: 'Mensagem importante perdida entre 50 conversas -> Promessa esquecida -> Cliente insatisfeito.',
          steps: ['Formulários leves que registram o pedido em CRM', 'Histórico unificado por cliente', 'WhatsApp usado para conversar, não para armazenar']
        },
        planilhas_muitas: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Planilha A diz uma coisa, Planilha B diz outra. O estoque nunca bate e o financeiro passa o dia reconciliando divergências.',
          diagram: 'Versão 1 da planilha vs Versão 3 da outra pasta -> Decisões tomadas com dados errados.',
          steps: ['Base de dados única e centralizada', 'Formulários que alimentam automaticamente', 'Fim das dezenas de arquivos soltos na área de trabalho']
        },
        papeis: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Pranchetas e bilhetes se perdem, molham e não geram indicadores para melhorar o negócio.',
          diagram: 'Comanda ou ficha de papel amassada -> Cozinha ou equipe erra o pedido -> Prejuízo.',
          steps: ['Telas ou smartphones simples na operação', 'Comunicação limpa e sem papel', 'Registro automático de tudo que foi feito']
        }
      }
    },
    espera: {
      tag: 'Experiência & Pontualidade',
      title: '“Clientes estão esperando.”',
      subpaths: [
        { key: 'passagem', label: 'Na passagem de turno / setor', default: true },
        { key: 'atendimento_inicial', label: 'Na primeira resposta de contato' },
        { key: 'aprovacao', label: 'Na aprovação de orçamentos' },
        { key: 'entrega', label: 'Na entrega final do produto/serviço' }
      ],
      details: {
        passagem: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'O atraso aparece no atendimento. Mas quase sempre começa na passagem de informação entre áreas desconectadas.',
          diagram: 'Pessoa A termina a parte dela -> Esquece de avisar a Pessoa B -> Ruptura silenciosa -> O cliente fica esperando no balcão.',
          steps: ['Notificação automática instantânea entre setores', 'Quarto liberado avisa recepção na hora', 'Cozinha pronta avisa garçom sem grito', 'Cliente atendido com tranquilidade e sorriso']
        },
        atendimento_inicial: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'O cliente pesquisa no calor do momento. Se a resposta demora 30 minutos, ele já fechou com o concorrente ao lado.',
          diagram: 'Lead chega interessado -> Ninguém vê a mensagem -> Resposta 3 horas depois -> Venda perdida.',
          steps: ['Triagem acolhedora em menos de 10 segundos', 'Perguntas básicas já respondidas', 'Alerta sonoro prioritário para a equipe comercial']
        },
        aprovacao: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Propostas comerciais demoradas e burocráticas que esfriam o desejo de contratação.',
          diagram: 'Briefing realizado -> 5 dias para enviar a proposta -> Cliente reavalia e desiste.',
          steps: ['Proposta estruturada enviada no mesmo dia', 'Valores transparentes e contratação em 1 clique', 'Agilidade que transmite competência técnica']
        },
        entrega: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Prazos estourados por falta de controle de gargalos no meio do caminho da produção.',
          diagram: 'Etapa 2 atrasa -> Ninguém ajusta o cronograma -> Entrega final estoura -> Quebra de reputação.',
          steps: ['Linha de produção com visualização clara de etapas', 'Identificação preventiva de atrasos', 'Prazos cumpridos com folga e segurança']
        }
      }
    },
    custo: {
      tag: 'Eficiência & Margem',
      title: '“Estou gastando mais do que deveria.”',
      subpaths: [
        { key: 'vazamentos', label: 'Desperdício e perdas invisíveis', default: true },
        { key: 'compras_caras', label: 'Compras mal planejadas / caras' },
        { key: 'estoque_parado', label: 'Estoque parado empatando caixa' },
        { key: 'ferramentas_pagas', label: 'Assinaturas de ferramentas inúteis' }
      ],
      details: {
        vazamentos: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Custo não é só aquilo que você compra na nota fiscal. Também é aquilo que se perde, se repete ou precisa ser refeito na rotina.',
          diagram: 'Insumo vence no depósito -> Porcionamento descalibrado serve 20% a mais -> Margem de lucro evapora sem o dono perceber.',
          steps: ['Fichas técnicas rigorosas e visuais', 'Registro ágil do motivo de cada descarte', 'Controle PEPS na despensa e câmara fria', 'Margem preservada no final do mês']
        },
        compras_caras: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Comprar sempre do mesmo fornecedor sem cotação histórica ou comprar com pressa no varejo quando o estoque acaba de surpresa.',
          diagram: 'Falta produto no feriado -> Compra emergencial 40% mais cara -> Lucro daquele dia vai embora.',
          steps: ['Histórico de cotação comparativa', 'Estoque mínimo de segurança com gatilho automático', 'Compras planejadas com antecedência e poder de barganha']
        },
        estoque_parado: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Dinheiro congelado em mercadorias que não giram enquanto falta caixa para pagar as contas básicas.',
          diagram: 'Comprar muito para ganhar desconto -> Produto fica 6 meses na prateleira -> Dinheiro preso e desvalorizado.',
          steps: ['Curva ABC de produtos', 'Identificação de itens de baixo giro', 'Promoções de combo para desovar e recuperar liquidez']
        },
        ferramentas_pagas: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Dezenas de mensalidades de plataformas e softwares que prometeram mundos e fundos, mas que ninguém usa na prática.',
          diagram: 'Assina SaaS da moda -> Equipe acha difícil e volta pro papel -> Mensalidade continua debitando no cartão.',
          steps: ['Auditoria de ferramentas e eliminação de custos supérfluos', 'Adoção apenas do que a equipe realmente consegue usar', 'Tecnologia que economiza dinheiro em vez de criar custo']
        }
      }
    },
    comunicacao: {
      tag: 'Branding & Posicionamento',
      title: '“Minha comunicação não está funcionando.”',
      subpaths: [
        { key: 'pouco_resultado', label: 'Posto muito e vendo pouco', default: true },
        { key: 'invisivel_google', label: 'Invisível nas buscas locais' },
        { key: 'marca_amadora', label: 'Minha identidade parece amadora' },
        { key: 'clientes_errados', label: 'Atraio apenas clientes que pedem desconto' }
      ],
      details: {
        pouco_resultado: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Comunicar bem não é postar todo dia. É falar com clareza para a pessoa certa na hora exata em que ela precisa do seu produto ou serviço.',
          diagram: 'Posts diários sem estratégia comercial -> Curtidas de amigos -> Zero ligações ou pedidos reais no WhatsApp.',
          steps: ['Focar em conteúdo que resolve dores reais de clientes', 'Página de aterrissagem estruturada para conversão', 'Posicionamento que atrai compradores maduros']
        },
        invisivel_google: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Quem está na sua cidade pesquisando exatamente pelo que você vende acaba achando o concorrente porque o seu SEO local não existe.',
          diagram: 'Cliente busca "pousada em porto seguro" ou "restaurante perto de mim" -> Concorrente aparece no topo -> Você perde o cliente.',
          steps: ['Otimização editorial de Google Meu Negócio', 'Palavras-chave semânticas de alta intenção', 'Depoimentos e avaliações que geram autoridade local']
        },
        marca_amadora: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'A qualidade do seu trabalho é excelente, mas a imagem visual da sua empresa não reflete esse padrão, gerando desconfiança de preço.',
          diagram: 'Logo desalinhado + Papéis mal formatados -> Percepção de menor valor -> Dificuldade de cobrar o preço justo.',
          steps: ['Identidade visual elegante e memorável', 'Materiais comerciais padronizados de alto nível', 'Design editorial que transmite segurança e seriedade']
        },
        clientes_errados: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Se o seu marketing comunica apenas "preço baixo", você atrai apenas caçadores de pechincha em vez de clientes fiéis.',
          diagram: 'Comunicação focada em promoção -> Público sensível a centavos -> Margens esmagadas e leilão de preços.',
          steps: ['Reposicionar a narrativa para a transformação e o cuidado', 'Filtrar contatos qualificados logo no primeiro formulário', 'Construir autoridade que sustenta sua margem']
        }
      }
    },
    ferramentas: {
      tag: 'Sistemas & Integração',
      title: '“Tenho ferramentas, mas elas não conversam.”',
      subpaths: [
        { key: 'digitacao_tripla', label: 'Digito os mesmos dados 3 vezes', default: true },
        { key: 'ninguem_usa', label: 'Sistemas caros que ninguém usa' },
        { key: 'whatsapp_isolado', label: 'WhatsApp isolado de tudo' },
        { key: 'sem_painel', label: 'Não consigo ver meus números juntos' }
      ],
      details: {
        digitacao_tripla: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Contratar mais um software raramente resolve. O segredo é fazer o que você já tem trocar dados sem exigir digitação humana repetitiva.',
          diagram: 'Sistema A não conversa com Sistema B -> Funcionário vira "ponte humana" copiando e colando o dia todo.',
          steps: ['Criar pontes automáticas de integração', 'Disparos de dados em tempo real', 'Fim do copia-e-cola manual entre plataformas']
        },
        ninguem_usa: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Software complexo demais, feito para multinacionais, que não respeita o ritmo nem a simplicidade da equipe real.',
          diagram: 'Tela cheia de 80 campos obrigatórios -> Equipe se recusa a preencher -> Sistema vira peso morto.',
          steps: ['Ferramentas sob medida enxutas', 'Apenas os 3 ou 4 campos que realmente importam', 'Interface acolhedora que qualquer pessoa opera sem medo']
        },
        whatsapp_isolado: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'O WhatsApp é onde o negócio acontece, mas as informações que chegam lá morrem no histórico do aparelho do vendedor.',
          diagram: 'Lead qualificado no WhatsApp -> Não entra no CRM -> Ninguém faz o follow-up -> Dinheiro deixado na mesa.',
          steps: ['Conexão direta de formulários com WhatsApp', 'Registro seguro de dados e consentimento LGPD', 'Histórico comercial acessível pela equipe']
        },
        sem_painel: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Para saber se a empresa deu lucro ou prejuízo, você precisa abrir 5 programas diferentes e passar o fim de semana somando.',
          diagram: 'Dados cegos -> Decisões tomadas no escuro ou na intuição -> Surpresas desagradáveis no fim do mês.',
          steps: ['Dashboard executivo com os 4 indicadores vitais', 'Métricas em tempo real no celular', 'Clareza total do rumo do negócio']
        }
      }
    },
    travando: {
      tag: 'Diagnóstico Aberto & Sem Rótulo',
      title: '“Não sei explicar. Só sei que alguma coisa está travando.”',
      subpaths: [
        { key: 'incendios', label: 'Apagando incêndios o dia todo', default: true },
        { key: 'delegar', label: 'Dificuldade de delegar tarefas' },
        { key: 'cansaco', label: 'Trabalho muito e não vejo o negócio andar' },
        { key: 'conversa_livre', label: 'Só quero conversar com calma' }
      ],
      details: {
        incendios: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Não tem problema nenhum não saber o nome técnico. A gente começa conversando sobre a sua rotina e seguindo o fio até achar onde está o nó.',
          diagram: 'A sensação de sobrecarga permanente não é fraqueza sua: é sintoma de um nó invisível entre processos, pessoas e ferramentas.',
          steps: ['Escuta aberta e sem preconceito', 'Mapeamento visual do dia a dia da empresa', 'Identificação dos gargalos reais que roubam a paz', 'Soluções simples que devolvem o fôlego para o dono']
        },
        delegar: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Quando os procedimentos não estão claros e visíveis, o dono vira escravo da própria empresa porque só ele sabe como fazer direito.',
          diagram: 'Tudo passa pelo dono -> Equipe insegura -> Gargalo permanente -> Dono sem tempo para viver.',
          steps: ['Criar procedimentos visuais que ensinam a equipe', 'Definir regras de decisão simples', 'Delegar com segurança e clareza de entrega']
        },
        cansaco: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'O negócio consome toda a sua vida e energia, mas o resultado financeiro ou a satisfação pessoal não aparecem no mesmo compasso.',
          diagram: 'Muito esforço físico e mental -> Retorno desproporcional -> Exaustão.',
          steps: ['Diagnóstico transversal completo', 'Cortar desperdícios de energia e dinheiro', 'Reorganizar o que funciona e descartar o que pesa', 'Retomar o controle e o prazer de empreender']
        },
        conversa_livre: {
          causeTitle: 'A Raiz Provável do Nó',
          causeText: 'Às vezes você só precisa de um olhar experiente de fora para olhar para a operação, fazer as perguntas certas e desenhar saídas.',
          diagram: 'Quem está dentro do furacão não enxerga o todo -> O olhar transversal da IArretada conecta os pontos.',
          steps: ['Agendar uma conversa sem compromisso nem fórmulas prontas', 'Contar como é o seu negócio na vida real', 'Descobrir possibilidades que você ainda não estava vendo']
        }
      }
    }
  };

  function initUniversalDiscovery() {
    const section = document.querySelector('[data-universal-discovery]');
    if (!section) return;

    const canvas = document.getElementById('core-neural-canvas');
    const symbol = section.querySelector('[data-central-symbol]');
    const statusBadge = section.querySelector('[data-core-status]');
    const choiceNodes = section.querySelectorAll('[data-discovery-choice]');
    const stage = section.querySelector('[data-unfolding-stage]');
    const stageTag = section.querySelector('[data-stage-tag]');
    const stageHeading = section.querySelector('[data-stage-heading]');
    const subpathsContainer = section.querySelector('[data-subpaths-nav]');
    const causeTitle = section.querySelector('[data-cause-title]');
    const causeText = section.querySelector('[data-cause-text]');
    const diagramText = section.querySelector('[data-diagram-text]');
    const stepsContainer = section.querySelector('[data-constructive-steps]');

    // Canvas Waves & Magnetic Lines Animation
    let ctx = null;
    let animId = null;
    let waves = [];
    let particles = [];
    let coreWidth = 0;
    let coreHeight = 0;
    let activeMode = 'idle';

    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx = canvas.getContext('2d');
      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const rect = canvas.getBoundingClientRect();
        coreWidth = rect.width || 800;
        coreHeight = rect.height || 380;
        canvas.width = Math.floor(coreWidth * dpr);
        canvas.height = Math.floor(coreHeight * dpr);
        if (ctx) ctx.scale(dpr, dpr);
      }

      function initParticles() {
        particles = [];
        const count = 36;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 160;
          particles.push({
            x: coreWidth / 2 + Math.cos(angle) * dist,
            y: coreHeight / 2 + Math.sin(angle) * dist,
            angle: angle,
            dist: dist,
            speed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.4 ? 'rgba(226, 194, 117, 0.65)' : 'rgba(233, 109, 81, 0.55)'
          });
        }
      }

      function renderCore() {
        if (!ctx) return;
        ctx.clearRect(0, 0, coreWidth, coreHeight);

        const cx = coreWidth / 2;
        const cy = coreHeight / 2;

        // Render expanding concentric shockwaves
        for (let i = waves.length - 1; i >= 0; i--) {
          const w = waves[i];
          w.r += w.speed;
          w.alpha -= 0.012;

          if (w.alpha <= 0) {
            waves.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
          ctx.strokeStyle = w.color.replace('ALPHA', w.alpha.toFixed(2));
          ctx.lineWidth = w.width;
          ctx.stroke();
        }

        // Render orbiting particles & dynamic magnetic field lines
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.angle += p.speed;
          p.x = cx + Math.cos(p.angle) * p.dist;
          p.y = cy + Math.sin(p.angle) * p.dist;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Connect nearby particles to central core
          if (p.dist < 120 && Math.random() > 0.6) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(cx + Math.cos(p.angle) * 45, cy + Math.sin(p.angle) * 45);
            ctx.strokeStyle = 'rgba(226, 194, 117, 0.15)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        animId = requestAnimationFrame(renderCore);
      }

      window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
      }, { passive: true });

      resizeCanvas();
      initParticles();
      renderCore();
    }

    function triggerCoreWave(color = 'rgba(226, 194, 117, ALPHA)') {
      if (!ctx) return;
      waves.push({ r: 45, speed: 4.2, alpha: 0.8, width: 2, color });
      waves.push({ r: 55, speed: 3.2, alpha: 0.6, width: 1.5, color });
      waves.push({ r: 65, speed: 2.2, alpha: 0.4, width: 1, color });
    }

    function selectChoice(key) {
      const data = UNIVERSAL_DISCOVERY_DATA[key];
      if (!data) return;

      choiceNodes.forEach((node) => {
        node.classList.toggle('is-selected', node.getAttribute('data-discovery-choice') === key);
      });

      if (symbol) {
        symbol.classList.add('is-active-pulse');
        setTimeout(() => symbol.classList.remove('is-active-pulse'), 800);
      }

      if (statusBadge) {
        statusBadge.textContent = `• Seguindo o fio: ${data.tag}`;
      }

      triggerCoreWave('rgba(233, 109, 81, ALPHA)');

      // Populate stage
      if (stageTag) stageTag.textContent = data.tag;
      if (stageHeading) stageHeading.textContent = data.title;

      // Populate subpaths
      if (subpathsContainer) {
        subpathsContainer.innerHTML = '';
        data.subpaths.forEach((sub, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `discovery-subpath-btn ${idx === 0 ? 'is-active' : ''}`;
          btn.textContent = `• ${sub.label}`;
          btn.addEventListener('click', () => {
            subpathsContainer.querySelectorAll('.discovery-subpath-btn').forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            renderSubpathDetails(data, sub.key);
            triggerCoreWave('rgba(226, 194, 117, ALPHA)');
          });
          subpathsContainer.appendChild(btn);
        });
      }

      // Initial subpath render
      const firstSub = data.subpaths[0]?.key || 'procurando';
      renderSubpathDetails(data, firstSub);

      if (stage) {
        stage.classList.add('is-open');
        stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    function renderSubpathDetails(data, subKey) {
      const detail = data.details[subKey] || Object.values(data.details)[0];
      if (!detail) return;

      if (causeTitle) causeTitle.textContent = detail.causeTitle;
      if (causeText) causeText.textContent = detail.causeText;
      if (diagramText) diagramText.textContent = detail.diagram;

      if (stepsContainer) {
        stepsContainer.innerHTML = '';
        detail.steps.forEach((step, i) => {
          const pill = document.createElement('span');
          pill.className = 'discovery-step-pill';
          pill.textContent = step;
          stepsContainer.appendChild(pill);

          if (i < detail.steps.length - 1) {
            const arrow = document.createElement('span');
            arrow.className = 'discovery-step-arrow';
            arrow.textContent = '->';
            stepsContainer.appendChild(arrow);
          }
        });
      }
    }

    choiceNodes.forEach((node) => {
      node.addEventListener('mouseenter', () => {
        if (symbol) {
          symbol.classList.add('is-accelerated');
          triggerCoreWave('rgba(226, 194, 117, 0.8)');
        }
      });
      node.addEventListener('mouseleave', () => {
        if (symbol) {
          symbol.classList.remove('is-accelerated');
        }
      });
      node.addEventListener('click', () => {
        selectChoice(node.getAttribute('data-discovery-choice'));
      });
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectChoice(node.getAttribute('data-discovery-choice'));
        }
      });
    });
  }

  /* ==========================================================================
     INICIALIZAÇÃO NO DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initMagneticButtons();
    initLiquidGlassPhysical();
    initUniversalDiscovery();
    initChatbotDemo();
    initPipelineDemo();
    initSystemTwinDisclosure();
  });
})();
