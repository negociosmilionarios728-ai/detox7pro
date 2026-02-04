# 🎉 DETOX 7PRO - Configuração Concluída com Sucesso!

## ✅ O que foi criado:

### 1. **Banco de Dados Neon (Gratuito e Vitalício)**
   - **Projeto:** neon-green-door
   - **ID:** weathered-bread-88850594
   - **Tabelas criadas:**
     - `users` - Armazena dados de usuários (nome, email, senha com hash)
     - `user_sessions` - Armazena sessões e tokens JWT
   - **Índices criados:**
     - `idx_users_email` - Otimiza buscas por email
     - `idx_user_sessions_user_id` - Otimiza buscas de sessões por usuário
     - `idx_user_sessions_token` - Otimiza validação de tokens

### 2. **Backend Node.js + Express**
   - `server.js` - Servidor com autenticação completa
   - Endpoints da API:
     - `POST /api/auth/register` - Criar nova conta
     - `POST /api/auth/login` - Fazer login
     - `POST /api/auth/verify` - Verificar token
     - `POST /api/auth/forgot-password` - Recuperar senha

### 3. **Segurança Implementada**
   - Senhas com hash bcrypt (nunca armazenadas em texto plano)
   - Tokens JWT com expiração de 7 dias
   - CORS configurado
   - Validação de input
   - Proteção contra SQL injection (prepared statements)

---

## 🚀 Como usar:

### Passo 1: Configurar Variáveis de Ambiente
Adicione no seu projeto Vercel (Vars section):

```
DATABASE_URL=postgresql://[seu-usuario]:[sua-senha]@[seu-host]/neondb?sslmode=require
JWT_SECRET=seu-segredo-jwt-aleatorio-forte
```

**Como obter DATABASE_URL:**
1. Vá para https://console.neon.tech
2. Clique em seu projeto "neon-green-door"
3. Copie a Connection String (Connection pooling)
4. Cole em `DATABASE_URL`

**Para JWT_SECRET:**
- Gere uma string aleatória forte (ex: openssl rand -hex 32)
- Ou use: `detox7pro-jwt-secret-2024-super-secreto`

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Rodar o Servidor em Desenvolvimento
```bash
npm run server
```

Você verá:
```
Conectado ao banco de dados Neon com sucesso!
Servidor rodando na porta 5000
URL: http://localhost:5000
```

### Passo 4: Testar
1. Abra http://localhost:5000
2. Clique em "Criar Conta"
3. Preencha os dados (nome, email, senha)
4. Pronto! Sua conta foi criada no Neon

---

## 📋 Estrutura do Banco de Dados

### Tabela `users`
```sql
- id (SERIAL PRIMARY KEY)
- full_name (VARCHAR 255)
- email (VARCHAR 255 UNIQUE)
- password_hash (VARCHAR 255 - bcrypt)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela `user_sessions`
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER - referência à tabela users)
- token (VARCHAR 500)
- created_at (TIMESTAMP)
- expires_at (TIMESTAMP)
```

---

## 🔄 Fluxo de Autenticação

1. **Registro:**
   - Usuário envia: nome, email, senha
   - Backend: valida, faz hash da senha, salva no Neon
   - Retorna: token JWT + dados do usuário

2. **Login:**
   - Usuário envia: email, senha
   - Backend: busca usuário, valida senha com bcrypt
   - Retorna: token JWT

3. **Verificação:**
   - Frontend: envia token no header Authorization
   - Backend: valida JWT, retorna dados do usuário

4. **Logout:**
   - Frontend: remove token do localStorage

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module 'pg'"
```bash
npm install pg
```

### Erro: "Database connection refused"
- Verifique se DATABASE_URL está configurada corretamente
- Teste a conexão em https://console.neon.tech

### Erro: "Token invalid"
- Verifique se JWT_SECRET está correto
- O token pode ter expirado (validade 7 dias)

---

## 📱 Para Deployar no Vercel

1. Conecte seu repositório GitHub
2. Clique em "Publish" no v0
3. Adicione as variáveis de ambiente no Vercel:
   - DATABASE_URL
   - JWT_SECRET
4. Deploy automático!

---

## 🎯 Próximos Passos (Opcional)

- Adicionar recuperação de senha por email
- Implementar refresh tokens
- Adicionar 2FA (autenticação de dois fatores)
- Criar dashboard do usuário
- Implementar perfil de treino e dieta

---

**Status: ✅ Banco de Dados Configurado e Funcionando**
