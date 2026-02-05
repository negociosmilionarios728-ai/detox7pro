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

// Handler para GET /api/progress/:userId
export async function getProgress(req, res) {
    try {
        const userId = req.params.userId;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token não fornecido' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded || decoded.id !== parseInt(userId)) {
            return res.status(403).json({ success: false, message: 'Acesso negado' });
        }

        const result = await pool.query(
            'SELECT completed_days, current_day FROM user_progress WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            // Se não tem progresso, retorna padrão
            return res.json({
                dias_concluidos: [],
                dia_atual: 1,
                porcentagem_conclusao: 0
            });
        }

        const progress = result.rows[0];
        const completedDays = progress.completed_days || [];

        return res.json({
            dias_concluidos: completedDays,
            dia_atual: progress.current_day,
            porcentagem_conclusao: (completedDays.length / 30) * 100
        });

    } catch (error) {
        console.error('[PROGRESS] Erro ao buscar progresso:', error);
        return res.status(500).json({ success: false, message: 'Erro ao buscar progresso' });
    }
}

// Handler para POST /api/progress/complete
export async function completeDay(req, res) {
    try {
        const { userId, dia } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token não fornecido' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded || decoded.id !== userId) {
            return res.status(403).json({ success: false, message: 'Acesso negado' });
        }

        // Verificar se já existe registro
        const checkResult = await pool.query(
            'SELECT completed_days FROM user_progress WHERE user_id = $1',
            [userId]
        );

        let completedDays = [];

        if (checkResult.rows.length > 0) {
            completedDays = checkResult.rows[0].completed_days || [];
        }

        // Adicionar dia se não estiver na lista
        if (!completedDays.includes(dia)) {
            completedDays.push(dia);
        }

        const nextDay = Math.max(...completedDays) + 1;

        // Upsert (Insert ou Update)
        await pool.query(
            `INSERT INTO user_progress (user_id, completed_days, current_day, last_updated)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET completed_days = $2, current_day = $3, last_updated = NOW()`,
            [userId, JSON.stringify(completedDays), nextDay]
        );

        return res.json({
            success: true,
            message: 'Dia concluído com sucesso!',
            dias_concluidos: completedDays,
            dia_atual: nextDay
        });

    } catch (error) {
        console.error('[PROGRESS] Erro ao atualizar progresso:', error);
        return res.status(500).json({ success: false, message: 'Erro ao atualizar progresso' });
    }
}
