# Setup do Banco de Dados Neon

Este guia explica como configurar o banco de dados Neon para armazenar senhas geradas pelos usuários.

## Pré-requisitos

- Node.js 16+
- Uma conta Neon (https://neon.tech)
- DATABASE_URL do seu projeto Neon

## Passos de Configuração

### 1. Obter a Connection String do Neon

1. Acesse https://console.neon.tech
2. Selecione seu projeto
3. Vá para "Connection details"
4. Copie a connection string PostgreSQL (DATABASE_URL)

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
DATABASE_URL=postgresql://user:password@host/database
PORT=5000
```

### 3. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 4. Executar o Setup do Banco de Dados

```bash
npm run setup:db
```

Ou manualmente:

```bash
node scripts/setup-neon.js
```

## Tabelas Criadas

### users
- `id` (SERIAL PRIMARY KEY)
- `full_name` (VARCHAR 255)
- `email` (VARCHAR 255 UNIQUE)
- `password_hash` (VARCHAR 255)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### generated_passwords
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER - foreign key)
- `password_text` (VARCHAR 255)
- `category` (VARCHAR 50)
- `length` (INTEGER)
- `uses_uppercase` (BOOLEAN)
- `uses_lowercase` (BOOLEAN)
- `uses_numbers` (BOOLEAN)
- `uses_special` (BOOLEAN)
- `created_at` (TIMESTAMP)

## APIs Disponíveis

### POST /api/save-password
Salva uma senha gerada pelo usuário.

**Body:**
```json
{
  "password_text": "AbC123!@#",
  "category": "social-media",
  "length": 10,
  "uses_uppercase": true,
  "uses_lowercase": true,
  "uses_numbers": true,
  "uses_special": true
}
```

### GET /api/get-passwords
Recupera todas as senhas salvas do usuário autenticado.

## Troubleshooting

### "DATABASE_URL not set"
Certifique-se de que a variável DATABASE_URL está configurada no seu arquivo `.env.local`.

### "Connection refused"
Verifique se:
- A connection string é válida
- Seu IP está adicionado à whitelist do Neon
- O servidor Neon está operacional

### "Table already exists"
Se você executar o setup novamente, as tabelas existentes serão mantidas (usando IF NOT EXISTS).

## Próximos Passos

1. Integrar as APIs de save-password e get-passwords em seu frontend
2. Implementar autenticação de usuário
3. Adicionar endpoint para deletar senhas salvas
4. Implementar backup automático de dados
