CREATE TABLE IF NOT EXISTS game_stats (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stat_type VARCHAR(20) NOT NULL CHECK (stat_type IN ('goal', 'assist', 'penalty')),
  recorded_by INTEGER NOT NULL REFERENCES users(id),
  disputed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_game_stats_session ON game_stats(session_id);
CREATE INDEX idx_game_stats_user ON game_stats(user_id);
