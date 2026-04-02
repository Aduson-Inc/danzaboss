import { query } from '../config/db.js';

export const User = {
  async create(email, passwordHash, displayName) {
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email, passwordHash, displayName]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT id, email, display_name, avatar_data, roast_paragraphs, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async updateProfile(id, { displayName, roastParagraphs }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (displayName !== undefined) {
      fields.push(`display_name = $${idx++}`);
      values.push(displayName);
    }
    if (roastParagraphs !== undefined) {
      fields.push(`roast_paragraphs = $${idx++}`);
      values.push(roastParagraphs);
    }

    if (fields.length === 0) return User.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}
       RETURNING id, email, display_name, avatar_data, roast_paragraphs, created_at, updated_at`,
      values
    );
    return rows[0];
  },
};
