import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET || 'detox7pro-secret-2024';

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
  } catch {
    return null;
  }
}

// GET /api/progress
export async function getProgress(req, res) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const userId = decoded.id;

    const result = await pool.query(
      'SELECT completed_days, current_day FROM user_progress WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        dias_concluidos: [],
        dia_atual: 1,
        porcentagem_conclusao: 0,
      });
    }

    const { completed_days, current_day } = result.rows[0];

    res.json({
      dias_concluidos: completed_days || [],
      dia_atual: current_day,
      porcentagem_conclusao: Math.round(((completed_days?.length || 0) / 30) * 100),
    });
  } catch (err) {
    console.error('[GET PROGRESS]', err);
    res.status(500).json({ message: 'Erro ao buscar progresso' });
  }
}

// POST /api/progress/complete
export async function completeDay(req, res) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const userId = decoded.id;
    const { dia } = req.body;

    const check = await pool.query(
      'SELECT completed_days FROM user_progress WHERE user_id = $1',
      [userId]
    );

    let completedDays = check.rows[0]?.completed_days || [];

    if (!completedDays.includes(dia)) {
      completedDays.push(dia);
    }

    const nextDay = completedDays.length + 1;

    await pool.query(
      `
      INSERT INTO user_progress (user_id, completed_days, current_day, last_updated)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        completed_days = $2,
        current_day = $3,
        last_updated = NOW()
      `,
      [userId, completedDays, nextDay]
    );

    res.json({
      success: true,
      dias_concluidos: completedDays,
      dia_atual: nextDay,
      porcentagem_conclusao: Math.round((completedDays.length / 30) * 100),
    });
  } catch (err) {
    console.error('[COMPLETE DAY]', err);
    res.status(500).json({ message: 'Erro ao salvar progresso' });
  }
}
