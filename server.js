import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ==============================
// Setup básico
// ==============================
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// Middlewares
// ==============================
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==============================
// Importação das rotas (API)
// ==============================
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';
import forgotPasswordHandler from './api/forgot-password.js';
import getPasswordsHandler from './api/get-passwords.js';
import savePasswordHandler from './api/save-password.js';
import progressHandler from './api/progress.js'; // 👈 IMPORT CORRETO

// ==============================
// Rotas de autenticação
// ==============================
app.post('/api/auth/register', registerHandler);
app.post('/api/register', registerHandler);

app.post('/api/auth/login', loginHandler);
app.post('/api/login', loginHandler);

app.post('/api/auth/forgot-password', forgotPasswordHandler);
app.post('/api/forgot-password', forgotPasswordHandler);

// ==============================
// Rotas de senhas
// ==============================
app.get('/api/passwords', getPasswordsHandler);
app.post('/api/passwords', savePasswordHandler);

// ==============================
// Rotas de progresso (HTTP → handler)
// ==============================
app.get('/api/progress', progressHandler);
app.post('/api/progress', progressHandler);

// ==============================
// Health check
// ==============================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'express' });
});

// ==============================
// Frontend (React / HTML)
// ==============================

// 1️⃣ Produção (public_html)
app.use(express.static(path.join(__dirname, 'public_html')));

// 2️⃣ Build local (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all (React Router)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }

  const publicIndex = path.join(__dirname, 'public_html', 'index.html');
  const distIndex = path.join(__dirname, 'dist', 'index.html');

  res.sendFile(publicIndex, err => {
    if (err) {
      res.sendFile(distIndex, err2 => {
        if (err2) {
          res.status(404).send(
            'Frontend não encontrado. Gere o build ou verifique o public_html.'
          );
        }
      });
    }
  });
});

// ==============================
// Start server
// ==============================
app.listen(PORT, () => {
  console.log('\n🚀 Server rodando');
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`📝 Register: http://localhost:${PORT}/api/auth/register`);
  console.log('✅ Pronto para receber requisições\n');
});
