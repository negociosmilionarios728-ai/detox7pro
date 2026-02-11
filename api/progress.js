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

    // =========================
    // GET
    // =========================
    if (req.method === 'GET') {
      const result = await pool.query(
        `
        SELECT dias_concluidos, dia_atual, porcentagem_conclusao
        FROM user_progress
        WHERE user_id = $1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.json({
          dias_concluidos: [],
          dia_atual: 1,
          porcentagem_conclusao: 0
        });
      }

      return res.json(result.rows[0]);
    }

    // =========================
    // POST
    // =========================
    if (req.method === 'POST') {
      const { dia } = req.body;

      const diasConcluidos = [dia];
      const porcentagem = (diasConcluidos.length / 30) * 100;

      await pool.query(
        `
        INSERT INTO user_progress (user_id, dias_concluidos, dia_atual, porcentagem_conclusao)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET
          dias_concluidos = EXCLUDED.dias_concluidos,
          dia_atual = EXCLUDED.dia_atual,
          porcentagem_conclusao = EXCLUDED.porcentagem_conclusao
        `,
        [userId, diasConcluidos, dia + 1, porcentagem]
      );

      return res.json({ success: true });
    }

    res.status(405).end();

  } catch (err) {
    console.error('[API Progress]', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
