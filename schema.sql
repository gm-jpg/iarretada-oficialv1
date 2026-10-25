-- Cloudflare D1 Table Creation Schema for IArretada Leads
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    setor TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lgpd_accepted INTEGER NOT NULL CHECK (lgpd_accepted IN (0, 1)),
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);
-- Index for rate-limiting performance
CREATE INDEX IF NOT EXISTS idx_leads_ip_created ON leads(ip_hash, created_at);
