import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// =======================
// Rotas API (EXISTENTES)
// =======================
import progressHandler from './api/progress.js';
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';

const app = express();
const PORT = process.env.PORT || 8080;

// =======================
// Resolver __dirname (ESM)
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// Middlewares
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROTAS DE API
// =======================
app.post('/api/login', loginHandler);
app.post('/api/register', registerHandler);

// Progresso (GET e POST)
app.get('/api/progress', progressHandler);
app.post('/api/progress', progressHandler);

// Health check (Railway)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// =======================
// SERVIR FRONTEND (VITE)
// =======================
app.use(express.static(path.join(__dirname, 'dist')));

// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
