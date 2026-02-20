import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// ===== IMPORTAÇÃO DOS HANDLERS =====
import progressHandler from './api/progress.js'
import loginHandler from './api/login.js'
import registerHandler from './api/register.js'
import tasksHandler from './api/tasks.js'
import { calculateMeal } from './api/NutritionCalculator.js'

const app = express()
const PORT = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ==============================
// ===== MIDDLEWARES =====
// ==============================

app.use(cors())
app.use(express.json())

// ==============================
// ===== SERVIR EBOOK (STATIC) =====
// ==============================

// 🔥 Serve arquivos da pasta public/ebook
app.use('/ebook', express.static(path.join(__dirname, 'public/ebook')))

// ==============================
// ===== ROTAS DA API =====
// ==============================

app.post('/api/login', loginHandler)
app.post('/api/register', registerHandler)

app.get('/api/progress', progressHandler)
app.post('/api/progress', progressHandler)

app.get('/api/tasks/:dia', tasksHandler)

app.post('/api/calcular-manual', (req, res) => {
  try {
    const { descricao, peso } = req.body

    if (!descricao) {
      return res.status(400).json({
        error: 'Descrição do prato é obrigatória'
      })
    }

    const resultado = calculateMeal(descricao, peso)

    if (!resultado) {
      return res.status(404).json({
        error: 'Alimento não encontrado na base interna'
      })
    }

    return res.json(resultado)

  } catch (err) {
    console.error('❌ [API Nutrição]', err)
    return res.status(500).json({
      error: 'Erro interno no servidor'
    })
  }
})

// ==============================
// ===== FRONTEND (SPA VITE) =====
// ==============================

// 🔥 Serve o build do Vite
app.use(express.static(path.join(__dirname, 'dist')))

// 🔥 React Router fallback (Express 5 seguro)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// ==============================
// ===== START SERVER =====
// ==============================

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`)
})