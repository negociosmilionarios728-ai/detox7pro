import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET;

// ==============================
// Token helper
// ==============================
function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ==============================
// PROGRESS HANDLER (DEFAULT)
// ==============================
export default async function progressHandler(req, res) {
  const decoded = verifyToken(req);

  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const userId = decoded.id;

  try {
    // ==========================
    // GET progresso
    // ==========================
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT completed_days, current_day
         FROM user_progress
         WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.json({
          dias_concluidos: [],
          dia_atual: 1,
          porcentagem_conclusao: 0
        });
      }

      const { completed_days = [], current_day = 1 } = result.rows[0];

      return res.json({
        dias_concluidos: completed_days,
        dia_atual: current_day,
        porcentagem_conclusao: Math.round((completed_days.length / 30) * 100)
      });
    }

    // ==========================
    // POST concluir dia
    // ==========================
    if (req.method === 'POST') {
      const { dia } = req.body;

      const check = await pool.query(
        `SELECT completed_days
         FROM user_progress
         WHERE user_id = $1`,
        [userId]
      );

      let completedDays = check.rows[0]?.completed_days || [];

      if (!completedDays.includes(dia)) {
        completedDays.push(dia);
      }

      const nextDay = completedDays.length + 1;

      await pool.query(
        `
        INSERT INTO user_progress (user_id, completed_days, current_day, started_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET
          completed_days = EXCLUDED.completed_days,
          current_day = EXCLUDED.current_day
        `,
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

  } catch (error) {
    console.error('[PROGRESS ERROR]', error);
    return res.status(500).json({ message: 'Erro interno' });
  }
}
