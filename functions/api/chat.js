const reply = (status, message, data = {}) => new Response(JSON.stringify({ message, ...data }), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

const system = `Você é o IArretado, assistente virtual oficial da IArretada. Responda sempre em português brasileiro com hospitalidade, calor humano, clareza e assertividade.
A IArretada desenvolve soluções sob medida de IA para pessoas físicas e empresas: atendimento inteligente, automações de rotina, organização de processos, sites modernos e comunicação.
REGRAS OBRIGATÓRIAS:
1. NUNCA mencione nem escreva números de telefone em formato legível de texto (+55 73..., 73 99931-3401, etc.). É terminantemente proibido exibir qualquer número de telefone como texto.
2. Quando faltar alguma informação ou o usuário quiser falar com uma pessoa, explique de forma calorosa que ele pode clicar no botão do WhatsApp logo abaixo para falar diretamente com José e nossa equipe, ou usar o formulário de contato do site.
3. Não invente disponibilidade, prazos ou preços empresariais (projetos têm orçamento personalizado após entender o escopo). Se perguntarem de automação pessoal para pessoa física, o valor anunciado é R$ 99,99.
4. Mantenha as respostas amigáveis, acolhedoras e afirmativas, oferecendo opções claras de como a IArretada pode ajudar.`;

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
    if (Number(row?.request_count) > 10) return reply(429, 'Limite de perguntas atingido. Aguarde alguns minutos ou fale com a equipe no WhatsApp abaixo.', { offerWhatsApp: true });

    const history = Array.isArray(body.history) ? body.history.slice(-6).filter(x => x && ['user', 'assistant'].includes(x.role) && typeof x.content === 'string').map(x => ({ role: x.role, content: x.content.slice(0, 500) })) : [];
    const priceContext = /pre[çc]o|valor|custa|quanto|99|automa[çc][aã]o pessoal/i.test(message);
    const guidance = priceContext ? `${system} A oferta de automação pessoal para pessoas físicas custa R$ 99,99; não aplique esse valor a projetos empresariais.` : system;
    const result = await env.AI.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
      messages: [{ role: 'system', content: guidance }, ...history, { role: 'user', content: message }],
      max_tokens: 280
    });
    let answer = typeof result?.response === 'string' ? result.response.trim() : '';
    if (!answer) throw new Error('Empty AI answer');

    // Sanitização rigorosa: NUNCA exibir telefone como texto
    answer = answer.replace(/(\+?55\s*)?(\(?73\)?\s*)?9?\d{4}[-\s]?\d{4}/g, 'nosso WhatsApp');
    answer = answer.replace(/\+55\s*73\s*99931-?3401/gi, 'nosso WhatsApp');

    const offerWhatsApp = /whatsapp|contato|equipe|falar|ligar|telefone|jos[ée]|or[çc]amento/i.test(message + ' ' + answer);
    return reply(200, answer, { offerWhatsApp });
  } catch (error) {
    console.error('Chat failed', error);
    return reply(503, 'Não consegui responder no momento. Mas você pode falar direto com a gente no botão do WhatsApp abaixo!', { offerWhatsApp: true });
  }
}
