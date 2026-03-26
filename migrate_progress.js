import 'dotenv/config';
import pool from './db.js';

async function run() {
  try {
    await pool.query('ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMP WITH TIME ZONE;');
    console.log('Progress migration completed successfully.');
  } catch (err) {
    console.error('Error running progress migration:', err);
  } finally {
    await pool.end();
  }
}

run();
