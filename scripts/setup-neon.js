import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('[v0] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('[v0] Current directory:', __dirname);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function setupDatabase() {
    console.log('🚀 Iniciando setup do banco de dados Neon...');
    
    try {
        // SQL statements embedded diretamente
        const sql = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generated_passwords (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_text VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    length INTEGER DEFAULT 16,
    uses_uppercase BOOLEAN DEFAULT true,
    uses_lowercase BOOLEAN DEFAULT true,
    uses_numbers BOOLEAN DEFAULT true,
    uses_special BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_generated_passwords_user_id ON generated_passwords(user_id);

CREATE INDEX IF NOT EXISTS idx_generated_passwords_created_at ON generated_passwords(created_at);
        `;

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
