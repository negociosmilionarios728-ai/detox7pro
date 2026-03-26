import { config } from 'dotenv';
config();
import pool from './db.js';

async function listUsers() {
  const res = await pool.query('SELECT current_day, completed_days FROM user_progress ORDER BY started_at DESC LIMIT 5');
  console.log(res.rows);
  process.exit(0);
}
listUsers();
