# DETOX 7PRO - Setup com Neon Database

## ✅ Configuração Concluída

Seu projeto foi configurado com um backend Node.js + Express + Neon Database (PostgreSQL gratuito vitalício).

---

## 🚀 Próximos Passos

### 1. **Criar Conta no Neon (Gratuito Vitalício)**
   - Acesse: https://console.neon.tech
   - Crie uma conta com seu email
   - Crie um novo projeto
   - Copie a **Connection String** (DATABASE_URL)

### 2. **Configurar Variáveis de Ambiente**
   - Crie um arquivo `.env` na raiz do projeto
   - Cole sua `DATABASE_URL` do Neon:
   ```
   DATABASE_URL=postgresql://[seu-usuario]:[sua-senha]@[seu-host]/[seu-database]?sslmode=require
   JWT_SECRET=seu-secret-key-aqui
   PORT=5000
   NODE_ENV=development
   ```

### 3. **Instalar Dependências**
   ```bash
   npm install
   ```

### 4. **Executar em Desenvolvimento**
   
   **Terminal 1 - Frontend (Vite):**
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:5173

   **Terminal 2 - Backend (Node.js):**
   ```bash
   npm run server
   ```
   O servidor rodará em: http://localhost:5000

### 5. **Testar o Sistema**
   - Abra http://localhost:5173
   - Clique em "Criar Conta"
   - Preencha os campos:
     - Nome: seu nome
     - Email: seu@email.com
     - Senha: mínimo 6 caracteres
   - Clique em "Criar Conta"
   - Você será autenticado automaticamente

---

## 📊 Banco de Dados - Estrutura

### Tabela: `users`
```sql
- id: SERIAL PRIMARY KEY (auto-incremento)
- nome: VARCHAR(255) - Nome do usuário
- email: VARCHAR(255) UNIQUE - Email único
- senha: VARCHAR(255) - Senha com hash bcrypt
- created_at: TIMESTAMP - Data de criação
- updated_at: TIMESTAMP - Data de atualização
```

---

## 🔒 Segurança Implementada

✅ **Hash de Senha**: Bcryptjs (10 rounds)
✅ **Autenticação**: JWT (JSON Web Tokens)
✅ **CORS**: Configurado
✅ **Validação**: Email único e senha mínima 6 caracteres
✅ **Tokens expirão em**: 7 dias

---

## 📡 Endpoints da API

### POST `/api/auth/register`
Criar novo usuário
```json
{
  "nome": "Lucas Menegatti",
  "email": "lucas@email.com",
  "senha": "123456"
}
```

### POST `/api/auth/login`
Fazer login
```json
{
  "email": "lucas@email.com",
  "senha": "123456"
}
```

### POST `/api/auth/verify`
Verificar token JWT
```
Headers: Authorization: Bearer [token]
```

### POST `/api/auth/forgot-password`
Recuperação de senha
```json
{
  "email": "lucas@email.com"
}
```

---

## 🎯 Plano Gratuito Neon - Benefícios

✅ **Gratuito Vitalício**
✅ **3GB de storage** (o suficiente para milhões de registros)
✅ **PostgreSQL gerenciado** (sem manutenção)
✅ **Backups automáticos**
✅ **SSL/TLS** (conexão segura)
✅ **Dimensionamento automático**

---

## 🐛 Solução de Problemas

### Erro: "Conectado ao banco de dados"
- Verifique se o `DATABASE_URL` no `.env` está correto
- Certifique-se de que criou o projeto no Neon

### Erro: "Failed to execute json"
- Certifique-se de que ambos os servidores estão rodando:
  - Frontend: `npm run dev` (porta 5173)
  - Backend: `npm run server` (porta 5000)

### Erro: "CORS policy"
- CORS já está configurado no servidor
- Se persisti, verifique se o backend está rodando

---

## 📝 Próximas Implementações Sugeridas

1. **Envio de Email**: Integrar SendGrid ou Resend para:
   - Confirmação de email
   - Recuperação de senha
   
2. **Perfil de Usuário**: Adicionar campos como:
   - Avatar
   - Bio
   - Data de nascimento
   - Objetivo (perda de peso, ganho muscular, etc.)

3. **Dashboard**: Criar página com:
   - Histórico de progresso
   - Gráficos de evolução
   - Plano de 30 dias

4. **Autenticação Social**: Google, GitHub, Facebook

---

## 📞 Suporte Neon

Documentação: https://neon.tech/docs

---

**Pronto para começar! 🚀**
