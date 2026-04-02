CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'player'
    CHECK (role IN ('commissioner', 'captain', 'goalie', 'player')),
  position VARCHAR(5) DEFAULT NULL
    CHECK (position IS NULL OR position IN ('LW', 'C', 'RW', 'LD', 'RD', 'G')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
