import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function setupDatabase() {
    console.log('🚀 Iniciando setup do banco de dados Neon...');
    
    try {
        // Ler arquivo SQL
        const sqlFile = path.join(__dirname, 'init-db.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Executar cada comando SQL separado por ;
        const commands = sql
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

        for (const command of commands) {
            console.log(`Executando: ${command.substring(0, 50)}...`);
            await pool.query(command);
        }

        console.log('✅ Setup do banco de dados concluído com sucesso!');
        console.log('📊 Tabelas criadas:');
        console.log('  - users');
        console.log('  - generated_passwords');
        
    } catch (error) {
        console.error('❌ Erro ao setup do banco de dados:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();
