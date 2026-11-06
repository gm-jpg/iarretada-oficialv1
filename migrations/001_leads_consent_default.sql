ALTER TABLE leads RENAME TO leads_old;
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  setor TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lgpd_accepted INTEGER NOT NULL DEFAULT 0 CHECK (lgpd_accepted IN (0, 1)),
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
INSERT INTO leads (id,nome,email,whatsapp,setor,mensagem,lgpd_accepted,ip_hash,created_at)
SELECT id,nome,email,whatsapp,setor,mensagem,lgpd_accepted,ip_hash,created_at FROM leads_old;
DROP TABLE leads_old;
CREATE INDEX idx_leads_ip_created ON leads(ip_hash,created_at);
