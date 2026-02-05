#!/bin/bash

echo "=========================================="
echo "TESTE DE CONEXÃO DO SERVIDOR DETOX 7PRO"
echo "=========================================="
echo ""

# Aguardar o servidor iniciar
echo "Aguardando servidor iniciar na porta 5000..."
sleep 3

# Testar se o servidor está respondendo
echo ""
echo "1. Testando health check..."
curl -X GET http://localhost:5000/api/health
echo ""
echo ""

# Testar registração com dados de teste
echo "2. Testando registro de novo usuário..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste User",
    "email": "teste@example.com",
    "senha": "senha123"
  }'
echo ""
echo ""

echo "=========================================="
echo "Testes concluídos"
echo "=========================================="
