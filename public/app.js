"use strict";
(() => {
  const demos = {
    atendimento: {label:"Atendimento",title:"Uma pergunta simples, com resposta responsável.",question:"Vocês têm ventilador 220V para retirar hoje?",answer:"Qual modelo você procura? Vou verificar o estoque da loja antes de confirmar a retirada.",records:[["Produto","Ventilador 220V"],["Intenção","Retirar hoje"],["Falta confirmar","Modelo e estoque atualizado"],["Próximo passo","Vendedor verifica e responde"]]},
    operacao: {label:"Operação",title:"A equipe vê o que falta e quem decide.",question:"A manutenção do quarto 204 terminou. Já posso liberar para reserva?",answer:"Vou registrar a conclusão e pedir a conferência final da governança antes de atualizar a disponibilidade.",records:[["Local","Quarto 204"],["Etapa concluída","Manutenção"],["Pendente","Conferência da governança"],["Próximo passo","Responsável confirma e libera"]]},
    hotelaria: {label:"Hotelaria",title:"Chegada tardia com orientação clara.",question:"Meu voo chega às 23h. Posso fazer check-in depois desse horário?",answer:"Vou confirmar com a recepção o procedimento para sua reserva e enviar a orientação correta antes da chegada.",records:[["Assunto","Chegada às 23h"],["Contexto","Reserva e horário previsto"],["Falta confirmar","Procedimento da pousada"],["Próximo passo","Recepção orienta o hóspede"]]}
  };
  const phone = "5573999313401";
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const menu = document.querySelector("#menu");
  const toggle = document.querySelector(".menu-button");
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
      node.innerHTML="<h3>"+escapeHTML(demo.title)+"</h3><div class='demo-grid'><div class='demo-column'><h3>Na conversa</h3><div class='bubble'>"+escapeHTML(demo.question)+"</div><div class='bubble reply'>"+escapeHTML(demo.answer)+"</div></div><div class='demo-column'><h3>Para quem acompanha</h3>"+demo.records.map(([label,value])=>"<div class='record'><span>"+escapeHTML(label)+"</span><strong>"+escapeHTML(value)+"</strong></div>").join("")+"</div></div>";
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
    document.addEventListener("visibilitychange",()=>{if(document.hidden)video.pause();});
    if(!reduced() && !navigator.connection?.saveData){
      video.play().catch(update);
    }else{
      update();
    }
    // O vídeo definitivo do hero é uma animação silenciosa em loop.
  }


  const form=document.querySelector("#contact-form");
  if(form){
    const subject=form.querySelector("#subject");
    subject.value=(new URLSearchParams(location.search).get("assunto")||"").slice(0,150);
    const sendStatus=form.querySelector("#send-status");
    const submit=form.querySelector('button[type="submit"]');
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      if(!form.reportValidity()||submit.disabled)return;
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
        const message=["Olá, IArretada! Enviei uma solicitação pelo site.","Meu nome: "+name,"Contexto: "+context,"Assunto: "+subjectText,"O que quero desenrolar: "+challenge].filter(Boolean).join("\n");
        const box=form.querySelector("#message-box");
        form.querySelector("#message-preview").textContent=message;
        form.querySelector("#whatsapp-link").href="https://wa.me/"+phone+"?text="+encodeURIComponent(message);
        form.querySelector("#form-status").textContent="Solicitação registrada. Se quiser, continue a conversa pelo WhatsApp oficial.";
        box.hidden=false;box.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"nearest"});
        form.querySelector("#copy-message").onclick=async()=>{try{await navigator.clipboard.writeText(message);form.querySelector("#form-status").textContent="Mensagem copiada.";}catch{form.querySelector("#form-status").textContent="Selecione o texto para copiar.";}};
      }catch{sendStatus.textContent="Não foi possível conectar ao servidor. Tente novamente.";}
      finally{submit.disabled=false;submit.textContent="Enviar solicitação ↗";}
    });
  }
})();