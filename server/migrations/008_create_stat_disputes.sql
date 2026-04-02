CREATE TABLE IF NOT EXISTS stat_disputes (
  id SERIAL PRIMARY KEY,
  stat_id INTEGER NOT NULL REFERENCES game_stats(id) ON DELETE CASCADE,
  session_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  disputed_by INTEGER NOT NULL REFERENCES users(id),
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'upheld', 'overturned')),
  resolved_by VARCHAR(20) CHECK (resolved_by IN ('vote', 'commissioner', NULL)),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_stat_disputes_session ON stat_disputes(session_id);
CREATE INDEX idx_stat_disputes_stat ON stat_disputes(stat_id);
