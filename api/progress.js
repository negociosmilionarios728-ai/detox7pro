import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function progressHandler(req, res) {
  const decoded = verifyToken(req);
  if (!decoded?.id) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const userId = decoded.id;

  try {
    // GET progresso
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT completed_days, current_day
         FROM user_progress
         WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        await pool.query(
          `INSERT INTO user_progress (user_id, completed_days, current_day, started_at)
           VALUES ($1, $2, $3, NOW())`,
          [userId, [], 1]
        );

        return res.json({
          dias_concluidos: [],
          dia_atual: 1,
          porcentagem_conclusao: 0
        });
      }

      const completed = result.rows[0].completed_days || [];
      const currentDay = result.rows[0].current_day || completed.length + 1;

      return res.json({
        dias_concluidos: completed,
        dia_atual: currentDay,
        porcentagem_conclusao: Math.round((completed.length / 30) * 100)
      });
    }

    // POST concluir dia
    if (req.method === 'POST') {
      const { dia } = req.body;

      if (!Number.isInteger(dia) || dia < 1 || dia > 30) {
        return res.status(400).json({ message: 'Dia inválido' });
      }

      const result = await pool.query(
        `SELECT completed_days FROM user_progress WHERE user_id = $1`,
        [userId]
      );

      let completedDays = result.rows[0]?.completed_days || [];

      if (!completedDays.includes(dia)) {
        completedDays = [...completedDays, dia].sort((a, b) => a - b);
      }

      const nextDay = Math.min(completedDays.length + 1, 30);

      await pool.query(
        `UPDATE user_progress
         SET completed_days = $2, current_day = $3
         WHERE user_id = $1`,
        [userId, completedDays, nextDay]
      );

      return res.json({
        success: true,
        dias_concluidos: completedDays,
        dia_atual: nextDay,
        porcentagem_conclusao: Math.round((completedDays.length / 30) * 100)
      });
    }

    return res.status(405).json({ message: 'Método não permitido' });

  } catch (err) {
    console.error('[PROGRESS ERROR]', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
}
