import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const JWT_SECRET = process.env.JWT_SECRET || 'detox7pro-secret-2024';

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token não fornecido' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }

        // Buscar senhas do usuário
        const result = await pool.query(
            `SELECT id, password_text, category, length, uses_uppercase, uses_lowercase, uses_numbers, uses_special, created_at
             FROM generated_passwords
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 100`,
            [decoded.id]
        );

        const passwords = result.rows.map(row => ({
            id: row.id,
            text: row.password_text,
            category: row.category,
            length: row.length,
            config: {
                uppercase: row.uses_uppercase,
                lowercase: row.uses_lowercase,
                numbers: row.uses_numbers,
                special: row.uses_special
            },
            createdAt: row.created_at
        }));

        return res.status(200).json({
            success: true,
            count: passwords.length,
            passwords
        });

    } catch (error) {
        console.error('[GET-PASSWORDS] Erro:', error);
        return res.status(500).json({ success: false, message: 'Erro ao buscar senhas' });
    }
}
