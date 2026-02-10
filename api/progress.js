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

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    return jwt.verify(authHeader.substring(7), JWT_SECRET);
  } catch {
    return null;
  }
}

// ==============================
// GET / POST progress
// ==============================
export default async function progressHandler(req, res) {
  const decoded = verifyToken(req);

  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const userId = decoded.id;

  try {
    // ==========================
    // GET - Buscar progresso
    // ==========================
    if (req.method === 'GET') {
      let result = await pool.query(
        'SELECT completed_days, current_day FROM user_progress WHERE user_id = $1',
        [userId]
      );

      // 👉 CRIA O REGISTRO SE NÃO EXISTIR
      if (result.rows.length === 0) {
        await pool.query(
          `
          INSERT INTO user_progress (user_id, completed_days, current_day)
          VALUES ($1, $2, $3)
          `,
          [userId, [], 1]
        );

        return res.json({
          dias_concluidos: [],
          dia_atual: 1,
          porcentagem_conclusao: 0
        });
      }

      const progress = result.rows[0];
      const completed = progress.completed_days || [];

      return res.json({
        dias_concluidos: completed,
        dia_atual: progress.current_day || 1,
        porcentagem_conclusao: Math.round((completed.length / 30) * 100)
      });
    }

    // ==========================
    // POST - Concluir dia
    // ==========================
    if (req.method === 'POST') {
      const { dia } = req.body;

      const result = await pool.query(
        'SELECT completed_days FROM user_progress WHERE user_id = $1',
        [userId]
      );

      let completedDays = result.rows[0]?.completed_days || [];

      if (!completedDays.includes(dia)) {
        completedDays.push(dia);
      }

      const nextDay = completedDays.length + 1;

      await pool.query(
        `
        UPDATE user_progress
        SET completed_days = $1,
            current_day = $2,
            last_updated = NOW()
        WHERE user_id = $3
        `,
        [completedDays, nextDay, userId]
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
