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

// Log simples
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==============================
// Importação das APIs
// ==============================
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';
import forgotPasswordHandler from './api/forgot-password.js';
import getPasswordsHandler from './api/get-passwords.js';
import savePasswordHandler from './api/save-password.js';

// 🔥 IMPORT CORRETO (named exports)
import { getProgress, completeDay } from './api/progress.js';

// ==============================
// Rotas API
// ==============================

// Auth
app.post('/api/register', registerHandler);
app.post('/api/auth/register', registerHandler);

app.post('/api/login', loginHandler);
app.post('/api/auth/login', loginHandler);

app.post('/api/forgot-password', forgotPasswordHandler);
app.post('/api/auth/forgot-password', forgotPasswordHandler);

// Passwords
app.get('/api/passwords', getPasswordsHandler);
app.post('/api/passwords', savePasswordHandler);

// ✅ Progresso (BATENDO COM O FRONTEND)
app.get('/api/progress/:userId', getProgress);
app.post('/api/progress/complete', completeDay);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

// ==============================
// Frontend
// ==============================
const publicPath = path.join(__dirname, 'public_html');
const distPath = path.join(__dirname, 'dist');

app.use(express.static(publicPath));
app.use(express.static(distPath));

// ==============================
// Catch-all (SPA)
// ==============================
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  const indexFile = path.join(publicPath, 'index.html');

  res.sendFile(indexFile, err => {
    if (err) {
      res.status(404).send('Frontend não encontrado');
    }
  });
});

// ==============================
// Start server
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
