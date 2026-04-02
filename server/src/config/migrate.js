import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function migrate() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const { rows } = await query(
        'SELECT id FROM _migrations WHERE name = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await query(sql);
      await query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      console.log(`Applied ${file}`);
    }

    console.log('All migrations complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
