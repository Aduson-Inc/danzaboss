import { query, pool } from '../config/db.js';

export const StatDispute = {
  async create(statId, sessionId, disputedBy, reason) {
    const { rows } = await query(
      `INSERT INTO stat_disputes (stat_id, session_id, disputed_by, reason)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [statId, sessionId, disputedBy, reason || null]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT sd.*, u.display_name AS disputed_by_name,
              gs.stat_type, gs.user_id AS stat_player_id,
              pu.display_name AS stat_player_name
       FROM stat_disputes sd
       JOIN users u ON u.id = sd.disputed_by
       JOIN game_stats gs ON gs.id = sd.stat_id
       JOIN users pu ON pu.id = gs.user_id
       WHERE sd.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findBySessionId(sessionId) {
    const { rows } = await query(
      `SELECT sd.*, u.display_name AS disputed_by_name,
              gs.stat_type, gs.user_id AS stat_player_id,
              pu.display_name AS stat_player_name
       FROM stat_disputes sd
       JOIN users u ON u.id = sd.disputed_by
       JOIN game_stats gs ON gs.id = sd.stat_id
       JOIN users pu ON pu.id = gs.user_id
       WHERE sd.session_id = $1
       ORDER BY sd.created_at DESC`,
      [sessionId]
    );
    return rows;
  },

  async findOpenByStatId(statId) {
    const { rows } = await query(
      `SELECT * FROM stat_disputes
       WHERE stat_id = $1 AND status = 'open'`,
      [statId]
    );
    return rows[0] || null;
  },

  async castVote(disputeId, userId, vote) {
    const { rows } = await query(
      `INSERT INTO dispute_votes (dispute_id, user_id, vote)
       VALUES ($1, $2, $3)
       ON CONFLICT (dispute_id, user_id) DO NOTHING
       RETURNING *`,
      [disputeId, userId, vote]
    );
    return rows[0] || null;
  },

  async getVotes(disputeId) {
    const { rows } = await query(
      `SELECT dv.*, u.display_name
       FROM dispute_votes dv
       JOIN users u ON u.id = dv.user_id
       WHERE dv.dispute_id = $1`,
      [disputeId]
    );
    return rows;
  },

  async getVoteCount(disputeId) {
    const { rows } = await query(
      `SELECT vote, COUNT(*)::int AS count
       FROM dispute_votes
       WHERE dispute_id = $1
       GROUP BY vote`,
      [disputeId]
    );
    const counts = { uphold: 0, overturn: 0 };
    rows.forEach((r) => { counts[r.vote] = r.count; });
    return counts;
  },

  async resolve(disputeId, status, resolvedBy) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: disputeRows } = await client.query(
        `UPDATE stat_disputes
         SET status = $2, resolved_by = $3, resolved_at = NOW()
         WHERE id = $1 AND status = 'open'
         RETURNING *`,
        [disputeId, status, resolvedBy]
      );
      const dispute = disputeRows[0];

      if (!dispute) {
        await client.query('ROLLBACK');
        return null;
      }

      if (status === 'overturned') {
        // Remove the stat if dispute is overturned
        await client.query(
          'DELETE FROM game_stats WHERE id = $1',
          [dispute.stat_id]
        );
      } else {
        // Clear disputed flag if upheld
        await client.query(
          'UPDATE game_stats SET disputed = FALSE WHERE id = $1',
          [dispute.stat_id]
        );
      }

      await client.query('COMMIT');
      return dispute;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};
