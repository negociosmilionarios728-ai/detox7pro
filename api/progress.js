import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  try {
    // 🔹 BUSCAR progresso
    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT * FROM user_progress WHERE user_id = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        // cria progresso inicial
        const created = await pool.query(
          `INSERT INTO user_progress 
           (id, user_id, current_day, completed_days, progress_percent, started_at, updated_at)
           VALUES (gen_random_uuid(), $1, 1, 0, 0, now(), now())
           RETURNING *`,
          [userId]
        );

        return res.json(created.rows[0]);
      }

      return res.json(result.rows[0]);
    }

    // 🔹 ATUALIZAR progresso
    if (req.method === "POST") {
      const { current_day, completed_days, progress_percent } = req.body;

      await pool.query(
        `UPDATE user_progress
         SET current_day = $1,
             completed_days = $2,
             progress_percent = $3,
             updated_at = now()
         WHERE user_id = $4`,
        [current_day, completed_days, progress_percent, userId]
      );

      return res.json({ success: true });
    }

    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro no progresso" });
  }
}
