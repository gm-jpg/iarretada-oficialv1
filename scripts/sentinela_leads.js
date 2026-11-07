/**
 * IArretada — Agente Sentinela de Leads Locais (Focado em WhatsApp)
 * Mapeia estabelecimentos locais (Porto Seguro, Arraial, Trancoso, Caraíva, Eunápolis, Cabrália),
 * detecta reclamações de demora no atendimento (TripAdvisor e Google) e gera links diretos de WhatsApp.
 */

const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'database_leads.json');
const PRODUTOS_FILE = path.join(__dirname, 'database_produtos.json');
const OUTPUT_SUMMARY = path.join(__dirname, 'leads_para_whatsapp.json');

function carregarDados() {
  const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  const produtos = JSON.parse(fs.readFileSync(PRODUTOS_FILE, 'utf8'));
  return { leads, produtos };
}

function processarLeadsWhatsApp() {
  const { leads, produtos } = carregarDados();
  console.log(`\n============================================================`);
  console.log(`🟢 AGENTE SENTINELA IARRETADA — CENTRAL DE LEADS WHATSAPP`);
  console.log(`============================================================`);
  console.log(`📊 Total de estabelecimentos no radar: ${leads.length}`);

  const relatorio = leads.map((lead, idx) => {
    const waUrl = `https://wa.me/${lead.phone}?text=${encodeURIComponent(lead.icebreaker)}`;
    return {
      index: idx + 1,
      id: lead.id,
      name: lead.name,
      city: lead.city,
      sector: lead.sector,
      rating_tripadvisor: lead.rating_tripadvisor,
      rating_google: lead.rating_google,
      pain: lead.pain,
      complaint: lead.complaint_snippet,
      solution: `${lead.solution_name} (${lead.solution_price})`,
      whatsapp_link: waUrl,
      icebreaker: lead.icebreaker
    };
  });

  fs.writeFileSync(OUTPUT_SUMMARY, JSON.stringify(relatorio, null, 2), 'utf8');
  console.log(`✅ Base de contatos pronta em: ${OUTPUT_SUMMARY}`);
  console.log(`📱 Todos os contatos possuem link direto de disparo de 1 clique no WhatsApp.`);
  return relatorio;
}

if (require.main === module) {
  processarLeadsWhatsApp();
}

module.exports = { processarLeadsWhatsApp };
