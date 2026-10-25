export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { nome, email, whatsapp, setor, mensagem, lgpd } = body;
    
    // Honeypot anti-bot
    if (body.website && body.website.trim() !== "") {
      return new Response(JSON.stringify({ success: false, message: "Bot detected" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!nome || !email || !whatsapp || !setor || !mensagem || !lgpd) {
      return new Response(JSON.stringify({ success: false, message: "Preencha todos os campos obrigatórios." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    // Anonimização de IP para LGPD (SHA-256 Hash)
    const clientIP = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const msgUint8 = new TextEncoder().encode(clientIP);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Rate Limiting (Máx 3 envios por IP a cada 15 min)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const rateCheck = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM leads WHERE ip_hash = ? AND created_at > ?`
    ).bind(ipHash, fifteenMinsAgo).first();
    if (rateCheck && rateCheck.count >= 3) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Limite de envios atingido. Por favor, aguarde alguns minutos." 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }
    // Gravação no Cloudflare D1
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO leads (nome, email, whatsapp, setor, mensagem, lgpd_accepted, ip_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(nome, email, whatsapp, setor, mensagem, lgpd ? 1 : 0, ipHash, now).run();
    return new Response(JSON.stringify({ success: true, message: "Lead cadastrado com sucesso!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Erro interno no servidor.", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
