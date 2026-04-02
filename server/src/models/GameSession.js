import { query, pool } from '../config/db.js';

export const GameSession = {
  async create(teamId, createdBy) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: sessionRows } = await client.query(
        `INSERT INTO game_sessions (team_id, created_by, status)
         VALUES ($1, $2, 'waiting')
         RETURNING *`,
        [teamId, createdBy]
      );
      const session = sessionRows[0];

      // Creator auto-joins the session
      await client.query(
        `INSERT INTO game_session_players (session_id, user_id)
         VALUES ($1, $2)`,
        [session.id, createdBy]
      );

      await client.query('COMMIT');
      return session;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT gs.*, u.display_name AS created_by_name, t.name AS team_name
       FROM game_sessions gs
       JOIN users u ON u.id = gs.created_by
       JOIN teams t ON t.id = gs.team_id
       WHERE gs.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findActiveByTeamId(teamId) {
    const { rows } = await query(
      `SELECT gs.*, u.display_name AS created_by_name
       FROM game_sessions gs
       JOIN users u ON u.id = gs.created_by
       WHERE gs.team_id = $1 AND gs.status IN ('waiting', 'active')
       ORDER BY gs.created_at DESC
       LIMIT 1`,
      [teamId]
    );
    return rows[0] || null;
  },

  async findByTeamId(teamId, limit = 10) {
    const { rows } = await query(
      `SELECT gs.*, u.display_name AS created_by_name
       FROM game_sessions gs
       JOIN users u ON u.id = gs.created_by
       WHERE gs.team_id = $1
       ORDER BY gs.created_at DESC
       LIMIT $2`,
      [teamId, limit]
    );
    return rows;
  },

  async start(id) {
    const { rows } = await query(
      `UPDATE game_sessions
       SET status = 'active', started_at = NOW()
       WHERE id = $1 AND status = 'waiting'
       RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },

  async end(id) {
    const { rows } = await query(
      `UPDATE game_sessions
       SET status = 'completed', ended_at = NOW()
       WHERE id = $1 AND status = 'active'
       RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },

  async addPlayer(sessionId, userId) {
    const { rows } = await query(
      `INSERT INTO game_session_players (session_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (session_id, user_id) DO NOTHING
       RETURNING *`,
      [sessionId, userId]
    );
    return rows[0] || null;
  },

  async removePlayer(sessionId, userId) {
    const { rows } = await query(
      `DELETE FROM game_session_players
       WHERE session_id = $1 AND user_id = $2
       RETURNING *`,
      [sessionId, userId]
    );
    return rows[0] || null;
  },

  async getPlayers(sessionId) {
    const { rows } = await query(
      `SELECT gsp.*, u.display_name, u.email, u.avatar_data,
              tm.role, tm.position
       FROM game_session_players gsp
       JOIN users u ON u.id = gsp.user_id
       JOIN game_sessions gs ON gs.id = gsp.session_id
       LEFT JOIN team_members tm ON tm.team_id = gs.team_id AND tm.user_id = gsp.user_id
       WHERE gsp.session_id = $1
       ORDER BY gsp.joined_at ASC`,
      [sessionId]
    );
    return rows;
  },

  async isPlayerInSession(sessionId, userId) {
    const { rows } = await query(
      `SELECT id FROM game_session_players
       WHERE session_id = $1 AND user_id = $2`,
      [sessionId, userId]
    );
    return rows.length > 0;
  },
};
