import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function tasksHandler(req, res) {
  try {
    const dia = Number(req.params.dia);

    const result = await pool.query(
      `SELECT 
        id,
        day,
        title,
        description,
        exercise,
        recipe_name,
        ingredients,
        preparation,
        benefits
       FROM tasks
       WHERE day = $1`,
      [dia]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
