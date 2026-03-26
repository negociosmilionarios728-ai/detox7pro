import jwt from 'jsonwebtoken';

async function testApiProgress() {
  // Simulando token the um user verdadeiro do DB (ID=52 ou qualquer um test)
  // Eu vi que inserimos um test user com ID na tabela!
  // No meu debug-db, o id deve ser algo como 5.
  const token = jwt.sign({ id: 5, email: "test@test.com" }, "detox7pro-secret-2026-secure", { expiresIn: '7d' });
  console.log("Forjado Token:", token);
  
  try {
      const res = await fetch('http://127.0.0.1:5000/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ dia: 1 })
      });
      console.log('Status HTTP:', res.status);
      const text = await res.text();
      console.log('Resposta Bruta:', text);
  } catch (err) {
      console.error('Falha de rede:', err);
  }
}
testApiProgress();
