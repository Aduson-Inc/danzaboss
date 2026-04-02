CREATE TABLE IF NOT EXISTS game_session_players (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_game_session_players_session ON game_session_players(session_id);
