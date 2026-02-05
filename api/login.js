import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const JWT_SECRET = process.env.JWT_SECRET || 'detox7pro-secret-2024';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { email, senha } = req.body;

        console.log('[LOGIN] Recebido:', { email });

        // Validação
        if (!email || !senha) {
            return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
        }

        const user = result.rows[0];

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.password_hash);

        if (!senhaValida) {
            return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('[LOGIN] Login bem-sucedido:', email);

        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                nome: user.full_name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('[LOGIN] Erro:', error);
        return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
    }
}
