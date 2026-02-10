import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Rotas API
import progressHandler from './api/progress.js';
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';
import tasksHandler from './api/tasks.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Resolver __dirname no ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// =======================
// ROTAS DE API
// =======================
app.post('/api/login', loginHandler);
app.post('/api/register', registerHandler);
app.get('/api/progress', progressHandler);
app.post('/api/progress', progressHandler);
app.get('/api/tasks/:dia', tasksHandler);

// =======================
// SERVIR FRONTEND (VITE)
// =======================
app.use(express.static(path.join(__dirname, 'dist')));

// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
