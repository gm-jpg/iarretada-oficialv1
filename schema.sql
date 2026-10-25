-- Cloudflare D1 Schema Oficial Completo — Projeto IArretada (9 Colunas + Índice Rate-Limit)
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    setor TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lgpd_accepted INTEGER NOT NULL DEFAULT 1 CHECK (lgpd_accepted IN (0, 1)),
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);


CREATE INDEX IF NOT EXISTS idx_leads_ip_created ON leads(ip_hash, created_at);