import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8080

// APIs primeiro
import progressHandler from './api/progress.js'
import loginHandler from './api/login.js'
import registerHandler from './api/register.js'

app.use(express.json())

app.post('/api/login', loginHandler)
app.post('/api/register', registerHandler)
app.get('/api/progress', progressHandler)
app.post('/api/progress', progressHandler)

// FRONTEND (Vite build)
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback (ESSENCIAL)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`)
})
