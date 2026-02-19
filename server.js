import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// ===== IMPORTAÇÃO DOS HANDLERS =====
import progressHandler from './api/progress.js'
import loginHandler from './api/login.js'
import registerHandler from './api/register.js'
import tasksHandler from './api/tasks.js'

const app = express()
const PORT = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// ==============================
// ===== ROTAS DA API =====
// ==============================

app.post('/api/login', loginHandler)
app.post('/api/register', registerHandler)

app.get('/api/progress', progressHandler)
app.post('/api/progress', progressHandler)

// ✅ ROTA CORRETA DE TASKS (AGORA USA O HANDLER REAL)
app.get('/api/tasks/:dia', tasksHandler)


// ==============================
// ===== FRONTEND (SPA) =====
// ==============================

app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`)
})
