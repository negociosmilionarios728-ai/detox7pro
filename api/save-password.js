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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
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

        const {
            password_text,
            category = 'general',
            length = 16,
            uses_uppercase = true,
            uses_lowercase = true,
            uses_numbers = true,
            uses_special = true
        } = req.body;

        if (!password_text) {
            return res.status(400).json({ success: false, message: 'Senha é obrigatória' });
        }

        // Salvar senha gerada no banco
        const result = await pool.query(
            `INSERT INTO generated_passwords 
             (user_id, password_text, category, length, uses_uppercase, uses_lowercase, uses_numbers, uses_special)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [decoded.id, password_text, category, length, uses_uppercase, uses_lowercase, uses_numbers, uses_special]
        );

        const savedPassword = result.rows[0];

        return res.status(201).json({
            success: true,
            message: 'Senha salva com sucesso',
            password: {
                id: savedPassword.id,
                text: savedPassword.password_text,
                category: savedPassword.category,
                createdAt: savedPassword.created_at
            }
        });

    } catch (error) {
        console.error('[SAVE-PASSWORD] Erro:', error);
        return res.status(500).json({ success: false, message: 'Erro ao salvar senha' });
    }
}
