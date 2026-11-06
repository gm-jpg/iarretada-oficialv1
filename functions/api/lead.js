export async function onRequestPost({ request, env }) {
  const json = (payload, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
    });

  try {
    if (!env?.DB) return json({ success: false, message: 'Serviço temporariamente indisponível.' }, 503);

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return json({ success: false, message: 'Formato de envio inválido.' }, 415);
    }

    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ success: false, message: 'Dados inválidos.' }, 400);
    }
    const string = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    const nome = string(body.name || body.nome, 120);
    const email = string(body.email, 254) || 'nao-informado@iarretada.com.br';
    const whatsapp = string(body.whatsapp || body.phone, 30);
    const setor = string(body.sector || body.setor || body.business_type || body.interest, 120) || 'Geral';
    const mensagem = string(body.message || body.mensagem || body.improvement_need, 4000);
    const consent = body.consent === true || body.lgpd === true;

    // Honeypot field names from both the homepage and older forms.
    if (string(body.website_hp || body.website, 500)) {
      return json({ success: true, message: 'Recebido.' });
    }

    if (!consent) {
      return json({ success: false, message: 'É necessário autorizar o contato e aceitar a política de privacidade.' }, 400);
    }
    if (nome.length < 2 || whatsapp.replace(/\D/g, '').length < 10 || mensagem.length < 5) {
      return json({ success: false, message: 'Informe nome, WhatsApp com DDD e descrição da sua necessidade.' }, 400);
    }

    // Pseudonymous per-IP abuse throttle; do not store raw IP addresses.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const ipHash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
    const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const rate = await env.DB.prepare(
      'SELECT COUNT(*) AS count FROM leads WHERE ip_hash = ? AND created_at > ?'
    ).bind(ipHash, cutoff).first();
    if (Number(rate?.count || 0) >= 3) {
      return json({ success: false, message: 'Limite de envios atingido. Aguarde 15 minutos.' }, 429);
    }

    await env.DB.prepare(
      'INSERT INTO leads (nome, email, whatsapp, setor, mensagem, lgpd_accepted, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(nome, email, whatsapp, setor, mensagem, 1, ipHash, new Date().toISOString()).run();

    return json({ success: true, message: 'Mensagem recebida com sucesso!' });
  } catch (error) {
    console.error('Lead submission failed', error instanceof Error ? error.name : 'unknown');
    return json({ success: false, message: 'Não foi possível enviar agora. Tente novamente.' }, 500);
  }
}
