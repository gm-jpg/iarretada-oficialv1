const reply = (status, message) => new Response(JSON.stringify({ message }), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

const system = `Você é o IArretado, assistente virtual da IArretada. Responda em português brasileiro, de forma breve, clara e acolhedora. A IArretada desenvolve soluções de IA para pessoas físicas e empresas: atendimento, automações, organização, sites e comunicação. Projetos empresariais têm escopo e orçamento personalizados. Não mencione preço, a menos que a pergunta atual peça preço ou trate especificamente de automação pessoal. Não invente disponibilidade, prazos, integrações, resultados, preços de serviços empresariais nem políticas. Quando faltar informação, diga que a equipe pode avaliar pelo formulário de contato ou WhatsApp oficial +55 73 99931-3401. Não peça dados pessoais na conversa. Perguntas fora do escopo: explique brevemente que ajuda com os serviços da IArretada.`;

export async function onRequestPost({ request, env }) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, 'Envie a pergunta em formato JSON.');
  if (Number(request.headers.get('content-length')) > 4096) return reply(413, 'Pergunta muito longa.');
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply(413, 'Pergunta muito longa.');
    body = JSON.parse(raw);
  } catch {
    return reply(400, 'Não foi possível ler sua pergunta.');
  }
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 500) return reply(400, 'Escreva uma pergunta de até 500 caracteres.');
  if (!env.DB?.prepare || !env.AI?.run) return reply(503, 'O assistente está indisponível no momento. Tente novamente mais tarde.');

  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const windowStart = Math.floor(Date.now() / 900000) * 900000;
    const expires = new Date(windowStart + 900000).toISOString();
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}:${windowStart}`));
    const key = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
    await env.DB.prepare('DELETE FROM chat_limits WHERE expires_at < ?').bind(new Date().toISOString()).run();
    const row = await env.DB.prepare('INSERT INTO chat_limits (ip_bucket_hash, request_count, expires_at) VALUES (?, 1, ?) ON CONFLICT(ip_bucket_hash) DO UPDATE SET request_count = request_count + 1 RETURNING request_count').bind(key, expires).first();
    if (Number(row?.request_count) > 10) return reply(429, 'Limite de perguntas atingido. Aguarde alguns minutos ou fale com a equipe.');

    const history = Array.isArray(body.history) ? body.history.slice(-6).filter(x => x && ['user', 'assistant'].includes(x.role) && typeof x.content === 'string').map(x => ({ role: x.role, content: x.content.slice(0, 500) })) : [];
    const priceContext = /pre[çc]o|valor|custa|quanto|99|automa[çc][aã]o pessoal/i.test(message);
    const guidance = priceContext ? `${system} A oferta de automação pessoal para pessoas físicas custa R$ 99,99; não aplique esse valor a projetos empresariais.` : system;
    const result = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
      messages: [{ role: 'system', content: guidance }, ...history, { role: 'user', content: message }],
      max_tokens: 240
    });
    const answer = typeof result?.response === 'string' ? result.response.trim() : '';
    if (!answer) throw new Error('Empty AI answer');
    return reply(200, answer);
  } catch (error) {
    console.error('Chat failed', error);
    return reply(503, 'Não consegui responder agora. Tente novamente ou fale com a equipe.');
  }
}
