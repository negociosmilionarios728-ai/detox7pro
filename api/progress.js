import jwt from 'jsonwebtoken';
import pool from '../db.js';

export default async function progressHandler(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (req.method === 'GET') {
      const result = await pool.query(
        `
        SELECT p.current_day, p.completed_days, p.started_at, u.has_paid_calories
        FROM user_progress p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        const newProgress = await pool.query(
          `
          INSERT INTO user_progress (user_id, current_day, completed_days, started_at)
          VALUES ($1, 1, '[]', NOW())
          RETURNING current_day, completed_days, started_at
          `,
          [userId]
        );

        return res.json(newProgress.rows[0]);
      }

      return res.json(result.rows[0]);
    }

    // =========================
    // POST
    // =========================
    if (req.method === 'POST') {
      const dia = Number(req.body.dia);

      const result = await pool.query(
        `
        SELECT current_day, completed_days
        FROM user_progress
        WHERE user_id = $1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        await pool.query(
          `
          INSERT INTO user_progress (user_id, current_day, completed_days, started_at)
          VALUES ($1, 1, '[]', NOW())
          `,
          [userId]
        );
      }

      const updatedResult = await pool.query(
        `
        SELECT current_day, completed_days
        FROM user_progress
        WHERE user_id = $1
        `,
        [userId]
      );

      let completedDays = updatedResult.rows[0].completed_days || [];

      if (!Array.isArray(completedDays)) {
        completedDays = [];
      }

      if (!completedDays.includes(dia)) {
        completedDays.push(dia);
      }

      const nextDay = Math.max(...completedDays, 1) + 1;

      await pool.query(
        `
        UPDATE user_progress
        SET completed_days = $1,
            current_day = $2
        WHERE user_id = $3
        `,
        [JSON.stringify(completedDays), nextDay, userId]
      );

      return res.json({ success: true });
    }

    res.status(405).end();
  } catch (err) {
    console.error('[API Progress]', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
