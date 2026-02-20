import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// ===== IMPORTAÇÃO DOS HANDLERS =====
import progressHandler from './api/progress.js'
import loginHandler from './api/login.js'
import registerHandler from './api/register.js'
import tasksHandler from './api/tasks.js'

// ✅ NOVO IMPORT DO CALCULADOR
import calcularNutricao from './api/nutritionCalculator.js'

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

app.get('/api/tasks/:dia', tasksHandler)

// ==============================
// ===== NOVA ROTA NUTRICIONAL =====
// ==============================

app.post('/api/calcular-manual', (req, res) => {
  try {
    const { descricao, peso } = req.body

    if (!descricao) {
      return res.status(400).json({
        error: 'Descrição do prato é obrigatória'
      })
    }

    const resultado = calcularNutricao(descricao, peso)

    if (resultado.erro) {
      return res.status(404).json(resultado)
    }

    res.json(resultado)

  } catch (err) {
    console.error('[API Nutrição]', err)
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

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
