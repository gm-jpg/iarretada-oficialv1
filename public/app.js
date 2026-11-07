"use strict";
(() => {
  const demos = {
    atendimento: {label:"Atendimento",title:"Da dúvida sobre um produto à conversa com quem pode vender.",description:"Um assistente para loja pode identificar a intenção de compra, consultar informações autorizadas e entregar o contexto ao vendedor. Preço e estoque só são confirmados quando a fonte está atualizada.",question:"Quero um ventilador 220V para retirar hoje. Tem algum disponível?",answer:"Posso ajudar a encontrar o modelo certo. Qual tamanho você procura? Vou passar sua preferência à loja para conferir estoque e retirada antes de confirmar.",records:[["Oportunidade","Cliente quer comprar e retirar hoje"],["Informações reunidas","Voltagem, tamanho e loja de retirada"],["Verificação necessária","Estoque e prazo na fonte da loja"],["Valor para a equipe","Vendedor recebe o pedido com contexto"]]},
    operacao: {label:"Operação",title:"Uma solicitação sai do WhatsApp e vira trabalho acompanhável.",description:"Para equipes que recebem pedidos por vários canais, a automação organiza dados, responsável e prazo em um único fluxo. A aprovação e a execução continuam com as pessoas.",question:"O ar-condicionado da sala 3 parou. Conseguem verificar antes da reunião de amanhã?",answer:"Registrei sala 3, problema e prazo desejado. Vou encaminhar à manutenção para avaliar a prioridade e informar uma previsão real.",records:[["Pedido","Verificar ar-condicionado da sala 3"],["Prazo desejado","Antes da reunião de amanhã"],["Responsável","Manutenção avalia prioridade"],["Valor para a equipe","Pedido rastreável, sem depender da memória do chat"]]},
    hotelaria: {label:"Hotelaria",title:"O hóspede chega com uma dúvida; a recepção recebe o contexto.",description:"Um assistente de pré-chegada pode reunir horário, reserva e necessidade especial, consultar regras da hospedagem e acionar a recepção quando uma confirmação humana é necessária.",question:"Meu voo atrasou e chego por volta das 23h. Como faço o check-in?",answer:"Entendi. Informe o nome da reserva e seu novo horário. Vou encaminhar à recepção para confirmar a entrada fora do horário e enviar a orientação correta.",records:[["Reserva","Identificação solicitada ao hóspede"],["Mudança","Chegada prevista às 23h"],["Regra a confirmar","Entrada fora do horário da recepção"],["Valor para a equipe","Recepção se prepara e responde com precisão"]]}
  };
  const phone = "5573999313401";
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const menu = document.querySelector("#menu");
  const toggle = document.querySelector(".menu-button");
  const header = document.querySelector(".site-header");
  const syncHeaderHeight = () => document.documentElement.style.setProperty("--header-height", header.getBoundingClientRect().height + "px");
  syncHeaderHeight();
  new ResizeObserver(syncHeaderHeight).observe(header);
  function closeMenu(){ menu.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); }
  toggle.addEventListener("click",()=>{const open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"){const open=menu.classList.contains("open");closeMenu();if(open)toggle.focus();}});
  document.addEventListener("click",event=>{if(!event.target.closest(".nav"))closeMenu();});
  window.matchMedia("(max-width: 800px)").addEventListener("change",closeMenu);
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));


  document.querySelectorAll("[data-image]").forEach(image=>{
    const fail=()=>image.parentElement.classList.add("media-failed");
    image.addEventListener("error",fail,{once:true});
    if(image.complete && image.naturalWidth===0)fail();
  });


  document.querySelectorAll(".demo-shell").forEach(shell=>{
    shell.addEventListener("click",event=>{
      const button=event.target.closest("[data-demo]");
      if(!button)return;
      const demo=demos[button.dataset.demo];if(!demo)return;
      shell.querySelectorAll("[data-demo]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
      const node=shell.querySelector("[data-demo-content]");
      node.innerHTML="<div class='demo-intro'><h3>"+escapeHTML(demo.title)+"</h3><p>"+escapeHTML(demo.description)+"</p></div><div class='demo-grid'><div class='demo-column'><h4>Na conversa</h4><div class='bubble'>"+escapeHTML(demo.question)+"</div><div class='bubble reply'>"+escapeHTML(demo.answer)+"</div></div><div class='demo-column'><h4>Para a equipe</h4>"+demo.records.map(([label,value])=>"<div class='record'><span>"+escapeHTML(label)+"</span><strong>"+escapeHTML(value)+"</strong></div>").join("")+"</div></div>";
      shell.querySelector("[data-demo-link]").href="/contato/?assunto="+encodeURIComponent(demo.label);
    });
  });


  const video=document.querySelector("#hero-video");
  if(video){
    const play=document.querySelector("[data-video-play]");
    const sound=document.querySelector("[data-video-sound]");
    video.controls=false;
    video.muted=true;
    video.loop=true;
    if(reduced()){ video.removeAttribute("autoplay"); video.pause(); }
    const update=()=>{play.textContent=video.ended?"Rever apresentação":video.paused?"Reproduzir apresentação":"Pausar apresentação";};
    play.addEventListener("click",async()=>{
      if(video.paused||video.ended){if(video.ended)video.currentTime=0;try{await video.play();}catch{video.controls=true;}}
      else video.pause();
      update();
    });
    sound.addEventListener("click",()=>{
      video.muted=!video.muted;
      sound.textContent=video.muted?"Ativar som":"Silenciar";
      sound.setAttribute("aria-pressed",String(!video.muted));
    });
    ["play","pause","ended"].forEach(name=>video.addEventListener(name,update));
    video.addEventListener("error",()=>{
      play.disabled=true;play.textContent="Vídeo indisponível";
      sound.disabled=true;
    },{once:true});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)video.pause();else if(!reduced()&&!navigator.connection?.saveData)video.play().catch(update);});
    if(!reduced() && !navigator.connection?.saveData){
      video.play().catch(update);
    }else{
      update();
    }
    // O vídeo definitivo do hero é uma animação silenciosa em loop.
  }


  const form=document.querySelector("#contact-form");
  if(form){
    let submitted=false;
    const subject=form.querySelector("#subject");
    subject.value=(new URLSearchParams(location.search).get("assunto")||"").slice(0,150);
    const sendStatus=form.querySelector("#send-status");
    const submit=form.querySelector('button[type="submit"]');
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      if(!form.reportValidity()||submit.disabled||submitted)return;
      const data=new FormData(form);
      const name=String(data.get("name")||"").trim();
      const whatsapp=String(data.get("whatsapp")||"").trim();
      const email=String(data.get("email")||"").trim();
      const context=String(data.get("context")||"").trim();
      const subjectText=String(data.get("subject")||"").trim();
      const challenge=String(data.get("challenge")||"").trim();
      const consent=data.get("consent")!==null;
      if(String(data.get("website_hp")||"").trim())return;
      if(name.length<2||whatsapp.replace(/\D/g,"").length<10||challenge.length<5||!consent){sendStatus.textContent="Confira nome, WhatsApp com DDD, necessidade e consentimento.";return;}
      submit.disabled=true;submit.textContent="Enviando...";
      sendStatus.textContent="";
      try{
        const res=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,whatsapp,email,business_type:context,improvement_need:(subjectText?subjectText+" — ":"")+challenge,consent,website_hp:""})});
        const result=await res.json();
        if(!res.ok||result.success!==true){sendStatus.textContent=result.message||"Não foi possível registrar sua solicitação. Tente novamente.";return;}
        sendStatus.textContent=result.message||"Solicitação registrada.";
        submitted=true;
        const message=["Olá, IArretada! Enviei uma solicitação pelo site.","Meu nome: "+name,"Contexto: "+context,"Assunto: "+subjectText,"O que quero desenrolar: "+challenge].filter(Boolean).join("\n");
        const box=form.querySelector("#message-box");
        form.querySelector("#message-preview").textContent=message;
        form.querySelector("#whatsapp-link").href="https://wa.me/"+phone+"?text="+encodeURIComponent(message);
        form.querySelector("#form-status").textContent="Solicitação registrada. Se quiser, continue a conversa pelo WhatsApp oficial.";
        box.hidden=false;box.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"nearest"});
        form.querySelector("#copy-message").onclick=async()=>{try{await navigator.clipboard.writeText(message);form.querySelector("#form-status").textContent="Mensagem copiada.";}catch{form.querySelector("#form-status").textContent="Selecione o texto para copiar.";}};
      }catch{sendStatus.textContent="Não foi possível conectar ao servidor. Tente novamente.";}
      finally{submit.disabled=submitted;submit.textContent=submitted?"Solicitação enviada":"Enviar solicitação →";}
    });
  }

  // Assistente virtual com respostas geradas no endpoint /api/chat.
  const topics = [
    {id:"servicos",label:"O que vocês fazem?",terms:["fazem","servico","solucao","oferece","atendimento","chatbot","assistente"],answer:"Criamos soluções de IA para atendimento, automações de rotina, organização de informações, sites e comunicação. Por exemplo: um assistente que acolhe uma dúvida, reúne o pedido e entrega o contexto à pessoa responsável. O escopo é definido para cada caso.",link:"/solucoes/",linkLabel:"Conhecer soluções"},
    {id:"automacao",label:"Automação de quê?",terms:["automacao","automatizar","repetitiva","rotina","tarefa","planilha"],answer:"Podemos automatizar o registro de pedidos, avisos de pendências, organização de documentos e passagem de tarefas entre responsáveis. Começamos pelo processo atual para definir o que pode ser automatizado e o que precisa de conferência humana.",link:"/servicos/automacoes/",linkLabel:"Ver automações"},
    {id:"preco",label:"Quanto custa?",terms:["preco","valor","custa","99","orcamento","investimento"],answer:"A automação pessoal anunciada custa R$ 99,99 e atende pessoas físicas dentro da oferta descrita. Soluções para empresas, integrações e atendimento personalizado são orçados depois de entendermos o escopo. Não há preço único para esses projetos.",link:"/servicos/automacoes/",linkLabel:"Entender a oferta"},
    {id:"hotelaria",label:"E para hotéis?",terms:["hotel","pousada","hospede","recepcao","check-in","turismo"],answer:"Para hotéis e pousadas, podemos orientar o hóspede com informações aprovadas pela hospedagem, registrar pedidos e encaminhar casos como chegada tardia à recepção. Disponibilidade, regras e exceções só são confirmadas pela fonte ou pela equipe responsável.",link:"/hotelaria/",linkLabel:"Ver hotelaria"},
    {id:"processo",label:"Como começa?",terms:["comeca","contratar","prazo","etapa","processo","funciona","projeto"],answer:"Você conta qual tarefa, atendimento ou comunicação quer melhorar. A gente entende a rotina e as ferramentas usadas, propõe um escopo com entregas e limites e só então combina preço e prazo. O primeiro passo é uma conversa.",link:"/contato/",linkLabel:"Falar do meu projeto"},
    {id:"privacidade",label:"Meus dados ficam seguros?",terms:["dados","privacidade","lgpd","seguranca","consentimento"],answer:"O formulário exige consentimento explícito e usa seus dados para responder à solicitação. As perguntas deste chat são processadas por Cloudflare Workers AI e não são registradas na base de leads. Leia a Política de Privacidade para saber mais e exercer seus direitos.",link:"/privacidade/",linkLabel:"Ler a política"}
  ];
  const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const related = {servicos:["automacao","hotelaria","processo"],automacao:["preco","processo","servicos"],preco:["automacao","processo","privacidade"],hotelaria:["servicos","processo","automacao"],processo:["preco","servicos","privacidade"],privacidade:["processo","servicos"]};
  const chat = document.createElement("aside");
  chat.className="iar-chat";
  chat.innerHTML='<button class="iar-chat-toggle" type="button" aria-expanded="false" aria-controls="iar-chat-panel"><span class="iar-chat-avatar" aria-hidden="true"><img src="/assets/iarretado/iarretado.webp" alt="" width="76" height="76"></span><span>IArretado <small>Pergunte ao assistente</small></span></button><section class="iar-chat-panel" id="iar-chat-panel" aria-label="Conversa com o IArretado" hidden><div class="iar-chat-head"><div><strong>IArretado</strong><small>Assistente virtual da IArretada</small></div><button type="button" class="iar-chat-close" aria-label="Fechar conversa">×</button></div><div class="iar-chat-character" aria-hidden="true"><span class="iar-chat-orbit"></span><img src="/assets/iarretado/iarretado.webp" alt="" width="150" height="150"></div><div class="iar-chat-messages" role="log" aria-live="polite" aria-relevant="additions"><p class="iar-chat-message bot">Oi! Sou o IArretado. Posso explicar nossas soluções e ajudar você a descobrir por onde começar. O que gostaria de saber?</p></div><div class="iar-chat-prompts"></div><form class="iar-chat-form"><label class="sr-only" for="iar-chat-input">Sua pergunta ao IArretado</label><input id="iar-chat-input" maxlength="500" placeholder="Escreva sua pergunta" required><button type="submit" aria-label="Enviar pergunta">→</button></form><p class="iar-chat-disclosure">Conversa gerada por IA. Evite dados pessoais. Confirme detalhes do projeto com a equipe.</p></section>';
  document.body.append(chat);
  const chatToggle=chat.querySelector(".iar-chat-toggle"), panel=chat.querySelector(".iar-chat-panel"), chatInput=chat.querySelector("#iar-chat-input"), messages=chat.querySelector(".iar-chat-messages");
  const prompts=chat.querySelector(".iar-chat-prompts");
  function showSuggestions(question=""){
    const query=normalize(question);
    const ranked=topics.map(topic=>({topic,score:topic.terms.reduce((total,term)=>total+(query.includes(term)?1:0),0)})).sort((a,b)=>b.score-a.score);
    const match=ranked[0]?.score>0?ranked[0].topic:null;
    const options=match?(related[match.id]||[]).map(id=>topics.find(topic=>topic.id===id)):topics.slice(0,3);
    prompts.replaceChildren();
    options.forEach(topic=>{const button=document.createElement("button");button.type="button";button.textContent=topic.label;button.addEventListener("click",()=>respond(topic.label));prompts.append(button);});
    const whatsapp=document.createElement("a");whatsapp.href="https://wa.me/"+phone+"?text="+encodeURIComponent("Olá, IArretada! Tenho uma dúvida sobre seus serviços.");whatsapp.target="_blank";whatsapp.rel="noopener noreferrer";whatsapp.textContent="Falar com a equipe →";prompts.append(whatsapp);
  }
  showSuggestions();
  function setChatOpen(open){panel.hidden=!open;chatToggle.setAttribute("aria-expanded",String(open));if(open)chatInput.focus();else chatToggle.focus();}
  chatToggle.addEventListener("click",()=>setChatOpen(panel.hidden));
  chat.querySelector(".iar-chat-close").addEventListener("click",()=>setChatOpen(false));
  chat.addEventListener("keydown",event=>{if(event.key==="Escape"&&!panel.hidden){event.stopPropagation();setChatOpen(false);}});
  function addMessage(value,kind,topic){
    const item=document.createElement("p");item.className="iar-chat-message "+kind;item.textContent=value;
    if(topic){const link=document.createElement("a");link.href=topic.link;link.textContent=topic.linkLabel+" →";item.append(link);}
    messages.append(item);messages.scrollTop=messages.scrollHeight;
  }
  const history=[];
  let answering=false;
  async function respond(question){
    if(answering)return;
    answering=true;
    addMessage(question,"visitor");
    const waiting=document.createElement("p");waiting.className="iar-chat-message bot";waiting.textContent="Pensando na melhor resposta…";messages.append(waiting);messages.scrollTop=messages.scrollHeight;
    const submit=chat.querySelector('.iar-chat-form button');submit.disabled=true;
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,history})});
      const result=await response.json();
      waiting.remove();
      if(!response.ok)throw new Error(result.message||'O IArretado está indisponível.');
      addMessage(result.message,"bot");
      history.push({role:"user",content:question},{role:"assistant",content:result.message});
      if(history.length>6)history.splice(0,history.length-6);
      showSuggestions(question);
    }catch(error){
      waiting.remove();
      addMessage(error.message||"Não consegui responder agora. Tente novamente ou fale com a equipe.","bot",{link:"/contato/",linkLabel:"Falar com a equipe"});
      showSuggestions("");
    }finally{answering=false;submit.disabled=false;chatInput.focus();}
  }
  chat.querySelector(".iar-chat-form").addEventListener("submit",event=>{event.preventDefault();const question=chatInput.value.trim();if(!question)return;chatInput.value="";respond(question);chatInput.focus();});
})();
