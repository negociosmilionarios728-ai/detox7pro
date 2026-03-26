import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const { Pool } = pg;

// Pool de conexão com o Postgres (Railway)
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
    const { nome, email, senha } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter no mínimo 6 caracteres',
      });
    }

    // Verificar se o email já existe
    const checkEmail = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (checkEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Gerar UUID nativo do Node (sem dependências externas)
    const userId = crypto.randomUUID();

    // Inserir usuário (COLUNAS CERTAS DA SUA TABELA)
    const result = await pool.query(
      `
      INSERT INTO users (id, name, email, password, has_paid_calories)
      VALUES ($1, $2, $3, $4, false)
      RETURNING id, name, email, has_paid_calories
      `,
      [userId, nome, email, senhaHash]
    );

    const user = result.rows[0];

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        nome: user.name,
        email: user.email,
        has_paid_calories: user.has_paid_calories,
      },
    });
  } catch (error) {
    console.error('[REGISTER] Erro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar conta',
    });
  }
}
