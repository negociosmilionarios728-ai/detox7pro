# Solução do Erro de Conexão com o Servidor

O erro `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` indica que o frontend está recebendo uma página HTML (provavelmente a página inicial ou uma página de erro 404) em vez de dados JSON quando tenta conectar com a API.

## O que foi feito:

1.  **Correção Local (`vite.config.js`)**:
    *   Foi adicionada uma configuração de proxy. Agora, ao rodar localmente (`npm run dev`), as requisições para `/api` serão corretamente encaminhadas para `http://localhost:5000` (onde o servidor backend deve estar rodando).

2.  **Melhoria no Código (`AuthContext.jsx`)**:
    *   O código de Login e Registro foi atualizado para detectar automaticamente se o servidor retornou HTML.
    *   Agora, em vez de travar com "Unexpected token", ele mostrará uma mensagem clara: *"O servidor retornou HTML em vez de JSON. Verifique se a API está rodando corretamente."*.

## Instruções para PRODUÇÃO (Hostinger/detox7pro.online):

O erro na sua captura de tela (site online) acontece porque **o servidor Node.js (backend) não está processando as requisições API**. O Apache está apenas servindo o site React e, como não encontra os arquivos da API, retorna o `index.html`.

**Para corrigir na Hostinger:**

1.  **Verifique se o Node.js está Ativo**:
    *   No painel da Hostinger, vá em **"Setup Node.js App"**.
    *   Certifique-se de que a aplicação foi criada e o status é **"Enabled"** ou **"Started"**.
    *   Verifique se o **Application Startup File** está definido como `server.js`.

2.  **Instale as Dependências no Servidor**:
    *   No painel Node.js da Hostinger, clique em **"Run NPM Install"** para garantir que as bibliotecas (express, cors, etc.) estejam instaladas.

3.  **Reinicie o APP**:
    *   Clique no botão **"Restart"** no painel da Hostinger.

Se você apenas fez upload dos arquivos para a pasta `public_html` sem configurar a aplicação Node.js no painel, a API **não funcionará**, pois o servidor backend precisa estar rodando ativamente para processar login/registro.

### Teste Localmente
Para testar as correções locais:
1. Feche os terminais atuais.
2. Rode `.\start.bat` (no Windows) ou inicie o server e o dev separadamente.
3. Tente fazer login em `localhost:5173`.
