const json = (status, message, success = false) => new Response(
  JSON.stringify({ success, message }),
  { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }
);

const value = (input, max) => typeof input === 'string' ? input.trim().slice(0, max + 1) : '';

export async function onRequestPost({ request, env }) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json(415, 'Envie os dados em formato JSON.');
  }
  if (Number(request.headers.get('content-length')) > 8192) {
    return json(413, 'Mensagem muito grande. Resuma sua solicitação.');
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return json(413, 'Mensagem muito grande. Resuma sua solicitação.');
    body = JSON.parse(raw);
  } catch (_) {
    return json(400, 'Não foi possível ler os dados enviados.');
  }
  if (!body || Array.isArray(body) || typeof body !== 'object') return json(400, 'Dados inválidos.');
  if (value(body.website_hp || body.website, 100)) return json(400, 'Envio inválido.');
  if (body.consent !== true && body.lgpd !== true) return json(400, 'É necessário aceitar a Política de Privacidade.');

  const nome = value(body.nome ?? body.name, 120);
  const email = value(body.email, 254);
  const whatsapp = value(body.whatsapp ?? body.phone, 30);
  const setor = value(body.setor ?? body.sector ?? body.business_type, 120);
  const mensagem = value(body.mensagem ?? body.message ?? body.improvement_need, 2000);
  const digits = whatsapp.replace(/\D/g, '');
  if (nome.length < 2 || nome.length > 120 || !/^[\p{L}\p{M} .'-]+$/u.test(nome)) return json(400, 'Informe um nome válido.');
  if (digits.length < 10 || digits.length > 13 || whatsapp.length > 30) return json(400, 'Informe um WhatsApp com DDD válido.');
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return json(400, 'Informe um e-mail válido.');
  if (!setor || setor.length > 120) return json(400, 'Selecione o tipo de necessidade.');
  if (mensagem.length < 5 || mensagem.length > 2000) return json(400, 'Descreva sua necessidade em até 2.000 caracteres.');
  if (!env.DB?.prepare) return json(503, 'O envio está indisponível no momento. Tente novamente mais tarde.');

  try {
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const ipHash = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const recent = await env.DB.prepare('SELECT COUNT(*) AS count FROM leads WHERE ip_hash = ? AND created_at > ?').bind(ipHash, since).first();
    if (Number(recent?.count || 0) >= 3) return json(429, 'Limite de envios atingido. Aguarde 15 minutos antes de tentar novamente.');
    const result = await env.DB.prepare('INSERT INTO leads (nome, email, whatsapp, setor, mensagem, lgpd_accepted, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(nome, email, whatsapp, setor, mensagem, 1, ipHash, new Date().toISOString()).run();
    if (!result?.success) throw new Error('D1 insert failed');
    return json(201, 'Mensagem registrada. Entraremos em contato pelo WhatsApp informado.', true);
  } catch (error) {
    console.error('Lead storage failed', error);
    return json(503, 'Não foi possível registrar sua mensagem. Tente novamente mais tarde.');
  }
}
