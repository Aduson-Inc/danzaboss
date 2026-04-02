CREATE TABLE IF NOT EXISTS dispute_votes (
  id SERIAL PRIMARY KEY,
  dispute_id INTEGER NOT NULL REFERENCES stat_disputes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  vote VARCHAR(10) NOT NULL CHECK (vote IN ('uphold', 'overturn')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(dispute_id, user_id)
);

CREATE INDEX idx_dispute_votes_dispute ON dispute_votes(dispute_id);
