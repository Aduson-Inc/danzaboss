import { query } from '../config/db.js';

export const GameStat = {
  async create(sessionId, userId, statType, recordedBy) {
    const { rows } = await query(
      `INSERT INTO game_stats (session_id, user_id, stat_type, recorded_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sessionId, userId, statType, recordedBy]
    );
    return rows[0];
  },

  async findBySessionId(sessionId) {
    const { rows } = await query(
      `SELECT gs.*, u.display_name AS player_name, r.display_name AS recorded_by_name
       FROM game_stats gs
       JOIN users u ON u.id = gs.user_id
       JOIN users r ON r.id = gs.recorded_by
       WHERE gs.session_id = $1
       ORDER BY gs.created_at ASC`,
      [sessionId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT * FROM game_stats WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async markDisputed(id) {
    const { rows } = await query(
      `UPDATE game_stats SET disputed = TRUE
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },

  async clearDisputed(id) {
    const { rows } = await query(
      `UPDATE game_stats SET disputed = FALSE
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },

  async deleteStat(id) {
    const { rows } = await query(
      'DELETE FROM game_stats WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  async getSessionSummary(sessionId) {
    const { rows } = await query(
      `SELECT gs.user_id, u.display_name,
              COUNT(*) FILTER (WHERE gs.stat_type = 'goal' AND gs.disputed = FALSE) AS goals,
              COUNT(*) FILTER (WHERE gs.stat_type = 'assist' AND gs.disputed = FALSE) AS assists,
              COUNT(*) FILTER (WHERE gs.stat_type = 'penalty' AND gs.disputed = FALSE) AS penalties
       FROM game_stats gs
       JOIN users u ON u.id = gs.user_id
       WHERE gs.session_id = $1
       GROUP BY gs.user_id, u.display_name
       ORDER BY goals DESC, assists DESC`,
      [sessionId]
    );
    return rows;
  },
};
