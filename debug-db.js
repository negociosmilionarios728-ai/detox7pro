import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_Z1Vlpmj6CeyT@ep-curly-cloud-ahr5vfbr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    let userRes = await pool.query('SELECT * FROM users ORDER BY id DESC LIMIT 1');
    if (userRes.rows.length === 0) {
       userRes = await pool.query("INSERT INTO users (full_name, email, password_hash, has_paid_calories) VALUES ('test', 'test@test.com', '123', true) RETURNING *");
    }
    const user = userRes.rows[0];
    console.log('Selected User ID:', user.id);
    
    // Simulate user_progress insert
    await pool.query(`
          INSERT INTO user_progress (user_id, current_day, completed_days)
          VALUES ($1, 1, '[]')
          ON CONFLICT (user_id) DO NOTHING
    `, [user.id]);
    
    const getRes = await pool.query(`
        SELECT p.current_day, p.completed_days, u.has_paid_calories
        FROM user_progress p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
    `, [user.id]);
    console.log('GET Result:', getRes.rows);

    let completedDays = getRes.rows[0].completed_days;
    console.log('original completedDays from GET:', completedDays, Array.isArray(completedDays));

    const nextDay = 2;
    console.log('Attempting UPDATE with JSON.stringify([1])');
    await pool.query(`
        UPDATE user_progress
        SET completed_days = $1,
            current_day = $2
        WHERE user_id = $3
    `, [JSON.stringify([1]), nextDay, user.id]);
    console.log('UPDATE success (with JSON.stringify)!');
    
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    pool.end();
  }
}
run();
