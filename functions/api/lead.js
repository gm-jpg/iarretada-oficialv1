export async function onRequestPost(context) {
  const { request, env } = context;


  try {
    const body = await request.json();


    // Suporte híbrido aos nomes de campos em português ou inglês
    const nome = body.nome || body.name || "";
    const email = body.email || "nao-informado@iarretada.com.br";
    const whatsapp = body.whatsapp || body.phone || "";
    const setor = body.setor || body.sector || "Geral";
    const mensagem = body.mensagem || body.message || "";
    const lgpd = body.lgpd !== undefined ? (body.lgpd ? 1 : 0) : 1;


    // 1. Verificação Anti-Bot Honeypot (Mandamento 35)
    if (body.website && body.website.trim() !== "") {
      return new Response(JSON.stringify({ success: true, message: "Recebido." }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }


    // 2. Validação Obrigatória (Mandamento 34)
    if (!nome || !whatsapp || !mensagem) {
      return new Response(JSON.stringify({
        success: false,
        message: "Por favor, preencha seu nome, WhatsApp e a descrição do seu nó."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }


    // 3. Anonimização de IP em Hash SHA-256 para LGPD (Mandamento 37)
    const clientIP = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const msgUint8 = new TextEncoder().encode(clientIP);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");


    // 4. Rate Limiting: máximo de 3 envios a cada 15 minutos por IP (Mandamento 39)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const rateCheck = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM leads WHERE ip_hash = ? AND created_at > ?"
    ).bind(ipHash, fifteenMinsAgo).first();


    if (rateCheck && rateCheck.count >= 3) {
      return new Response(JSON.stringify({
        success: false,
        message: "Limite de envios atingido. Aguarde 15 minutos antes de enviar novamente."
      }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }


    // 5. Gravação Segura no Cloudflare D1 (Mandamento 38)
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO leads (nome, email, whatsapp, setor, mensagem, lgpd_accepted, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(nome, email, whatsapp, setor, mensagem, lgpd, ipHash, now).run();


    return new Response(JSON.stringify({
      success: true,
      message: "Lead cadastrado com sucesso!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Erro interno no servidor.",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}