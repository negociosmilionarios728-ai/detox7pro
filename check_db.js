import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_Z1Vlpmj6CeyT@ep-curly-cloud-ahr5vfbr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const res1 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
  console.log('users columns:', res1.rows);

  const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_progress'");
  console.log('user_progress columns:', res2.rows);
  
  process.exit(0);
}
check();
