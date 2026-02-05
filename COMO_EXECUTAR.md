## Como Executar o DETOX 7PRO Corretamente

### Problema Identificado
O erro **"ECONNREFUSED 127.0.0.1:5000"** ocorre porque o **servidor backend não está rodando**. O frontend tenta se conectar na porta 5000, mas ninguém está respondendo.

### Solução: Rodar Backend + Frontend

#### **OPÇÃO 1: Windows**
```bash
.\start.bat
```
Abre dois terminais automaticamente:
- Terminal 1: Backend (porta 5000)
- Terminal 2: Frontend (porta 5173)

#### **OPÇÃO 2: macOS / Linux**
```bash
chmod +x start.sh
./start.sh
```

#### **OPÇÃO 3: Manual (Recomendado se você quer ver os logs)**

**Terminal 1 - Backend:**
```bash
npm install  # Primeira vez apenas
npm run server
```

Aguarde ver: `Servidor rodando na porta 5000`

**Terminal 2 - Frontend (NOVO TERMINAL):**
```bash
npm run dev
```

### Fluxo Correto
1. ✅ Backend iniciando em http://localhost:5000
2. ✅ Frontend iniciando em http://localhost:5173
3. ✅ Abrir http://localhost:5173 no navegador
4. ✅ Formulário conectando ao backend
5. ✅ Criar conta com sucesso

### Informações do Banco de Dados
- **Banco**: Neon PostgreSQL (gratuito vitalício)
- **Tabelas**: `users`, `user_sessions`
- **String de Conexão**: Definida em `DATABASE_URL`
- **Segurança**: Senhas com bcrypt, tokens JWT válidos por 7 dias

### Se Ainda Não Funcionar
1. Certifique-se de que `npm install` foi rodado
2. Verifique se as variáveis `DATABASE_URL` e `JWT_SECRET` estão configuradas (você deve ter recebido um prompt no v0)
3. Verifique os logs do terminal para erros específicos
4. Tente limpar o cache: `rm -rf node_modules package-lock.json && npm install`

### Endpoints Disponíveis
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login  
- `POST /api/auth/verify` - Verificar token
- `POST /api/auth/forgot-password` - Recuperar senha
