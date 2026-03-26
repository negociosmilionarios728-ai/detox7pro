import process from 'node:process';

async function test() {
  const email = 'test999' + Math.random() + '@test.com';
  console.log("Registrando", email);
  await fetch('http://localhost:8080/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'Teste', email, senha: '123456' })
  });

  const loginRes = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha: '123456' })
  }).catch(() => null);

  if (!loginRes) {
    console.log("Servidor não está rodando localmente na porta 8080");
    return;
  }

  const loginData = await loginRes.json();
  const token = loginData.token;
  if (!token) {
    console.log("Falha ao logar:", loginData);
    return;
  }

  console.log("Token obtido, testando POST /api/progress");

  const progRes = await fetch('http://localhost:8080/api/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ dia: 1 })
  });

  const text = await progRes.text();
  console.log("Status:", progRes.status);
  console.log("Resposta:", text);
}

test();
