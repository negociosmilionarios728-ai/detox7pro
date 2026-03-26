import process from 'node:process';

async function test() {
  const email = 'test999' + Math.random() + '@test.com';
  console.log("Registrando", email);
  await fetch('http://127.0.0.1:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'Teste', email, senha: 'password123' })
  });

  const loginRes = await fetch('http://127.0.0.1:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha: 'password123' })
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

  console.log("Logado com Token:", token);
  console.log("Chamando POST /api/progress");

  const progRes = await fetch('http://localhost:5000/api/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ dia: 1 })
  });

  const text = await progRes.text();
  console.log("Status:", progRes.status);
  console.log("Resposta:", text);
}

test();
