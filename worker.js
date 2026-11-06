import { onRequestPost } from './functions/api/lead.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/lead') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, message: 'Método não permitido.' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Allow': 'POST', 'Cache-Control': 'no-store' }
        });
      }
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  }
};
