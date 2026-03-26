import pool from '../db.js';

export default async function handler(req, res) {
  const dia = Number(req.params?.dia || req.query?.dia);

  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE day = $1',
      [dia]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
}
