import jwt from 'jsonwebtoken';
import pool from '../db.js';

export default async function progressHandler(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // 🔥 CORREÇÃO AQUI
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não encontrado no token' });
    }

    // =========================
    // GET PROGRESSO
    // =========================
    if (req.method === 'GET') {
      const result = await pool.query(
        `
        SELECT dias_concluidos, dia_atual, porcentagem_conclusao
        FROM progress
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
    // POST PROGRESSO
    // =========================
    if (req.method === 'POST') {
      const { dia } = req.body;

      if (!dia) {
        return res.status(400).json({ error: 'Dia não informado' });
      }

      // Buscar progresso atual
      const existing = await pool.query(
        'SELECT dias_concluidos FROM progress WHERE user_id = $1',
        [userId]
      );

      let diasConcluidos = [];

      if (existing.rows.length > 0) {
        diasConcluidos = existing.rows[0].dias_concluidos || [];
      }

      if (!diasConcluidos.includes(dia)) {
        diasConcluidos.push(dia);
      }

      const porcentagem = (diasConcluidos.length / 30) * 100;

      await pool.query(
        `
        INSERT INTO progress (user_id, dias_concluidos, dia_atual, porcentagem_conclusao)
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

    return res.status(405).end();

  } catch (err) {
    console.error('[API Progress ERROR]', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
