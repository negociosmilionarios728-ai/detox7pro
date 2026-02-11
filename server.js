import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// API handlers
import progressHandler from './api/progress.js'
import loginHandler from './api/login.js'
import registerHandler from './api/register.js'

const app = express()
const PORT = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// ===== API =====
app.post('/api/login', loginHandler)
app.post('/api/register', registerHandler)
app.get('/api/progress', progressHandler)
app.post('/api/progress', progressHandler)

// ✅ NOVA ROTA DE TAREFAS
app.get('/api/tasks/:dia', (req, res) => {
  const { dia } = req.params

  const tarefas = {
    1: {
      titulo: "Beba 2L de água",
      descricao: "Hoje você deve beber pelo menos 2 litros de água."
    },
    2: {
      titulo: "Evite açúcar",
      descricao: "Evite alimentos com açúcar refinado."
    },
    3: {
      titulo: "Caminhe 20 minutos",
      descricao: "Faça uma caminhada leve de pelo menos 20 minutos."
    }
  }

  const tarefa = tarefas[dia]

  if (!tarefa) {
    return res.status(404).json({ error: 'Tarefa não encontrada' })
  }

  res.json(tarefa)
})

// ===== FRONTEND =====
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`)
})
