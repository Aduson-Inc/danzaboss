import { query, pool } from '../config/db.js';

export const Team = {
  async create(name, commissionerId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: teamRows } = await client.query(
        `INSERT INTO teams (name, commissioner_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name, commissionerId]
      );
      const team = teamRows[0];

      await client.query(
        `INSERT INTO team_members (team_id, user_id, role)
         VALUES ($1, $2, 'commissioner')`,
        [team.id, commissionerId]
      );

      await client.query('COMMIT');
      return team;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT t.*, u.display_name AS commissioner_name, u.email AS commissioner_email
       FROM teams t
       JOIN users u ON u.id = t.commissioner_id
       WHERE t.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const { rows } = await query(
      `SELECT t.*, tm.role AS my_role
       FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE tm.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );
    return rows;
  },
};
