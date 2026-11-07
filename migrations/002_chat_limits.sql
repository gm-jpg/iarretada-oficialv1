CREATE TABLE IF NOT EXISTS chat_limits (
  ip_bucket_hash TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL
);
