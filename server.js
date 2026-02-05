import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import handlers from api folder
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';
import forgotPasswordHandler from './api/forgot-password.js';
import getPasswordsHandler from './api/get-passwords.js';
import savePasswordHandler from './api/save-password.js';
import { getProgress, completeDay } from './api/progress.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Helper to adapt Vercel/Next.js handlers (req, res) to Express
// Though in this case they are compatible enough, we just map them directly.

// Routes
// POST /api/auth/register AND /api/register
app.post('/api/auth/register', registerHandler);
app.post('/api/register', registerHandler);

// POST /api/auth/login AND /api/login
app.post('/api/auth/login', loginHandler);
app.post('/api/login', loginHandler);

// POST /api/auth/forgot-password AND /api/forgot-password
app.post('/api/auth/forgot-password', forgotPasswordHandler);
app.post('/api/forgot-password', forgotPasswordHandler);

// GET /api/passwords
app.get('/api/passwords', getPasswordsHandler);

// POST /api/passwords
app.post('/api/passwords', savePasswordHandler);

// Progress Routes
app.get('/api/progress/:userId', getProgress);
app.post('/api/progress/complete', completeDay);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'express-local' });
});

// -- ADICIONADO: Servir arquivos estáticos do React (dist) --
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Em produção, os arquivos estáticos ficam na mesma pasta (public_html) ou em 'dist' localmente
// Tenta servir do folder atual (para produção no Hostinger onde index.html está junto com server.js)
app.use(express.static(__dirname));
// Tenta servir de 'dist' (para desenvolvimento local "npm run server")
app.use(express.static(path.join(__dirname, 'dist')));

// Rota "catch-all" para React Router (qualquer rota não API)
// FIXED: Using regex /.*/ for Express 5 compatibility instead of '*'
app.get(/.*/, (req, res) => {
    // Se for requisição de API que não bateu em nada acima, retorna 404 JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API Route not found' });
    }

    // Tenta enviar o index.html da raiz (Produção)
    const prodIndex = path.join(__dirname, 'index.html');
    // Tenta enviar o index.html de dist (Local)
    const distIndex = path.join(__dirname, 'dist', 'index.html');

    res.sendFile(prodIndex, (err) => {
        if (err) {
            res.sendFile(distIndex, (err2) => {
                if (err2) {
                    res.status(404).send("Página não encontrada. Verifique se o build foi gerado (npm run build).");
                }
            });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`   - Login:    http://localhost:${PORT}/api/auth/login`);
    console.log(`   - Register: http://localhost:${PORT}/api/auth/register`);
    console.log('\nReady to accept requests.\n');
});
