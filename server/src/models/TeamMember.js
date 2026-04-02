import { query } from '../config/db.js';

export const TeamMember = {
  async findByTeamId(teamId) {
    const { rows } = await query(
      `SELECT tm.id, tm.team_id, tm.user_id, tm.role, tm.position, tm.joined_at,
              u.email, u.display_name, u.avatar_data, u.roast_paragraphs
       FROM team_members tm
       JOIN users u ON u.id = tm.user_id
       WHERE tm.team_id = $1
       ORDER BY tm.joined_at ASC`,
      [teamId]
    );
    return rows;
  },

  async addMember(teamId, userId, role = 'player') {
    const { rows } = await query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [teamId, userId, role]
    );
    return rows[0];
  },

  async updateRole(teamId, userId, role) {
    const { rows } = await query(
      `UPDATE team_members SET role = $3
       WHERE team_id = $1 AND user_id = $2
       RETURNING *`,
      [teamId, userId, role]
    );
    return rows[0] || null;
  },

  async updatePosition(teamId, userId, position) {
    const { rows } = await query(
      `UPDATE team_members SET position = $3
       WHERE team_id = $1 AND user_id = $2
       RETURNING *`,
      [teamId, userId, position]
    );
    return rows[0] || null;
  },

  async removeMember(teamId, userId) {
    const { rows } = await query(
      `DELETE FROM team_members
       WHERE team_id = $1 AND user_id = $2
       RETURNING *`,
      [teamId, userId]
    );
    return rows[0] || null;
  },

  async findMembership(teamId, userId) {
    const { rows } = await query(
      `SELECT * FROM team_members
       WHERE team_id = $1 AND user_id = $2`,
      [teamId, userId]
    );
    return rows[0] || null;
  },

  async countMembers(teamId) {
    const { rows } = await query(
      'SELECT COUNT(*)::int AS count FROM team_members WHERE team_id = $1',
      [teamId]
    );
    return rows[0].count;
  },
};
