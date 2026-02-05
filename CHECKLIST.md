## Checklist de Funcionamento

### Antes de Começar
- [ ] Rodou `npm install`?
- [ ] Variável `DATABASE_URL` está configurada? (Você recebeu um prompt no v0)
- [ ] Variável `JWT_SECRET` está configurada?

### Iniciando a Aplicação
- [ ] Terminal 1: Rodou `npm run server` e viu "Servidor rodando na porta 5000"?
- [ ] Terminal 2: Rodou `npm run dev` e viu "Local: http://localhost:5173"?
- [ ] Abriu http://localhost:5173 no navegador?

### Testando Registro
1. [ ] Clique em "Criar Conta"
2. [ ] Preencha: 
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: minimo6caracteres
3. [ ] Clique em "Criar Conta"

### Se Receber Erro
**Erro: "Failed to execute 'json' on 'Response'"**
→ Significa que o backend não está rodando
→ Volte para Terminal 1 e rode `npm run server`

**Erro: "connect ECONNREFUSED"**
→ Mesmo problema acima

**Erro: "Email já cadastrado"**
→ Use um email diferente

**Erro: "Senha deve ter no mínimo 6 caracteres"**
→ Digite uma senha com 6 ou mais caracteres

**Erro: "Todos os campos são obrigatórios"**
→ Preencha Nome, Email e Senha

### Se Funcionou!
- [ ] Conta criada com sucesso
- [ ] Token salvo no navegador (localStorage)
- [ ] Você pode fazer login com o email e senha
- [ ] Dados armazenados no Neon (gratuito vitalício)

### Próximos Passos
1. Implemente mais funcionalidades (perfil, dashboard, etc)
2. Deploy para Vercel (banco dados continua no Neon)
3. Configure email de recuperação de senha
4. Adicione autenticação social (Google, GitHub)
