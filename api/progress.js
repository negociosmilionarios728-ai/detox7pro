import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET;

// ==============================
// Auth helper
// ==============================
function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;

  try {
    return jwt.verify(auth.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

// ==============================
// GET /api/progress/:userId
// ==============================
export async function getProgress(req, res) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const userId = decoded.id;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        COALESCE(array_length(completed_days, 1), 0) AS dias_concluidos,
        COALESCE(current_day, 1) AS dia_atual
      FROM user_progress
      WHERE user_id = $1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({
        dias_concluidos: 0,
        dia_atual: 1,
        porcentagem_conclusao: 0
      });
    }

    const dias = Number(rows[0].dias_concluidos);
    const diaAtual = Number(rows[0].dia_atual);

    return res.json({
      dias_concluidos: dias,
      dia_atual: diaAtual,
      porcentagem_conclusao: Math.round((dias / 30) * 100)
    });

  } catch (err) {
    console.error('[GET PROGRESS]', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

// ==============================
// POST /api/progress/complete
// ==============================
export async function completeDay(req, res) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const userId = decoded.id;
  const { dia } = req.body;

  if (!Number.isInteger(dia) || dia < 1 || dia > 30) {
    return res.status(400).json({ message: 'Dia inválido' });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO user_progress (user_id, completed_days, current_day)
      VALUES ($1, ARRAY[$2], GREATEST($2 + 1, 1))
      ON CONFLICT (user_id)
      DO UPDATE SET
        completed_days = (
          SELECT ARRAY(
            SELECT DISTINCT d
            FROM unnest(
              user_progress.completed_days || EXCLUDED.completed_days
            ) AS d
            ORDER BY d
          )
        ),
        current_day = GREATEST(
          user_progress.current_day,
          EXCLUDED.current_day
        ),
        last_updated = NOW()
      RETURNING
        array_length(completed_days, 1) AS dias_concluidos,
        current_day
      `,
      [userId, dia]
    );

    const dias = Number(rows[0].dias_concluidos);
    const diaAtual = Number(rows[0].current_day);

    return res.json({
      success: true,
      dias_concluidos: dias,
      dia_atual: diaAtual,
      porcentagem_conclusao: Math.round((dias / 30) * 100)
    });

  } catch (err) {
    console.error('[COMPLETE DAY]', err);
    return res.status(500).json({ message: 'Erro interno' });
  }
}
