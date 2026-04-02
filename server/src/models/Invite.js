import { query } from '../config/db.js';

export const Invite = {
  async create(teamId, code, createdBy) {
    const { rows } = await query(
      `INSERT INTO invites (team_id, code, created_by, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '48 hours')
       RETURNING *`,
      [teamId, code, createdBy]
    );
    return rows[0];
  },

  async findByCode(code) {
    const { rows } = await query(
      `SELECT i.*, t.name AS team_name
       FROM invites i
       JOIN teams t ON t.id = i.team_id
       WHERE i.code = $1`,
      [code]
    );
    return rows[0] || null;
  },

  async markUsed(id, userId) {
    const { rows } = await query(
      `UPDATE invites SET used_by = $2
       WHERE id = $1
       RETURNING *`,
      [id, userId]
    );
    return rows[0] || null;
  },

  async findActiveByTeamId(teamId) {
    const { rows } = await query(
      `SELECT * FROM invites
       WHERE team_id = $1 AND used_by IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC`,
      [teamId]
    );
    return rows;
  },
};
