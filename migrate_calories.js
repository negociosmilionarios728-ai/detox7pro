import 'dotenv/config';
import pool from './db.js';

async function run() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS has_paid_calories BOOLEAN DEFAULT FALSE;');
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await pool.end();
  }
}

run();
