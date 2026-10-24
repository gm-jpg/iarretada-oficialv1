const jsonResponse = (payload, status) => new Response(JSON.stringify(payload), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8" }
});

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, message: "Corpo da solicitação inválido." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ success: false, message: "Corpo da solicitação inválido." }, 400);
  }

  const { nome, email, whatsapp, setor, mensagem, lgpd, website } = body;
  if (typeof website === "string" && website.trim() !== "") {
    return jsonResponse({ success: false, message: "Bot detected" }, 400);
  }

  const requiredFields = [nome, email, whatsapp, setor, mensagem];
  if (requiredFields.some((value) => typeof value !== "string" || value.trim() === "") || lgpd !== true) {
    return jsonResponse({ success: false, message: "Preencha todos os campos obrigatórios." }, 400);
  }

  if (typeof website !== "undefined" && typeof website !== "string") {
    return jsonResponse({ success: false, message: "Corpo da solicitação inválido." }, 400);
  }

  const normalizedEmail = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return jsonResponse({ success: false, message: "Informe um e-mail válido." }, 400);
  }

  try {
    const clientIP = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const ipBytes = new TextEncoder().encode(clientIP);
    const hashBuffer = await crypto.subtle.digest("SHA-256", ipBytes);
    const ipHash = Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const rateCheck = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM leads WHERE ip_hash = ? AND created_at > ?"
    ).bind(ipHash, fifteenMinutesAgo).first();

    if (Number(rateCheck?.count ?? 0) >= 3) {
      return jsonResponse({
        success: false,
        message: "Limite de envios atingido. Por favor, aguarde alguns minutos."
      }, 429);
    }

    const createdAt = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO leads (nome, email, whatsapp, setor, mensagem, lgpd_accepted, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(nome.trim(), normalizedEmail, whatsapp.trim(), setor.trim(), mensagem.trim(), 1, ipHash, createdAt).run();

    return jsonResponse({ success: true, message: "Lead cadastrado com sucesso!" }, 200);
  } catch {
    return jsonResponse({ success: false, message: "Erro interno no servidor." }, 500);
  }
}
