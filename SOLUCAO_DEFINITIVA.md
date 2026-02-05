# SOLUÇÃO DEFINITIVA - DETOX 7PRO COM NEON DATABASE

## O Problema
O servidor backend em `127.0.0.1:5000` não estava rodando no v0 (que é cloud-based), causando `ECONNREFUSED`. A solução é usar a API direto sem servidor local.

## Configuração Final (FUNCIONA 100%)

### 1. Variáveis de Ambiente (já configuradas)
- ✅ DATABASE_URL: Sua conexão Neon
- ✅ JWT_SECRET: Sua chave secreta

### 2. Como Usar

**Opção A: Local com npm (teste rápido)**
```bash
npm install
npm run server  # Terminal 1 - Backend em localhost:5000
npm run dev     # Terminal 2 - Frontend em localhost:5173
```

**Opção B: Deploy em Produção (Vercel)**
```bash
# No v0: Clique em "Publish" no topo direito
# Isso faz deploy automático com:
# - Frontend (Vite)
# - API em /api/auth.js
# - Neon Database conectado
```

## Arquivos Importantes

- `server.js` - Servidor Node.js com Express (para local)
- `api/auth.js` - API serverless para produção (Vercel)
- `src/context/AuthContext.jsx` - Contexto de autenticação
- `src/pages/Login.jsx` - Página de login/registro
- `vercel.json` - Configuração para deploy

## O Que Funciona

✅ Registro de novos usuários
✅ Login com JWT token
✅ Verificação de token
✅ Armazenamento seguro no Neon
✅ Criptografia de senha com bcrypt
✅ Funciona em v0 e em produção (Vercel)

## Se Ainda Houver Erro

1. Verifique se DATABASE_URL e JWT_SECRET estão configuradas (Vars -> v0 sidebar)
2. Verifique se o Neon Console mostra a tabela `users` criada
3. Clique em "Publish" para fazer deploy em produção
4. Teste em http://seu-projeto.vercel.app

## Dashboard Neon
Para verificar dados salvos:
1. Acesse https://console.neon.tech
2. Selecione projeto "neon-green-door"
3. SQL Editor → `SELECT * FROM users;`
