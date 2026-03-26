async function debugLive() {
  const email = 'debuglive' + Date.now() + '@test.com';
  console.log("Registrando no LIVE:", email);
  const regRes = await fetch('https://detox7pro.online/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'Debug LIVE', email, senha: 'password123' })
  });
  
  const regData = await regRes.json();
  if (!regData.success) {
    console.error('Falha registro live:', regData);
    return;
  }
  const token = regData.token;
  console.log("Token obtido:", token.substring(0, 10) + '...');
  
  console.log("Chamando POST /api/progress na LIVE...");
  const progRes = await fetch('https://detox7pro.online/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ dia: 1 })
  });
  
  const text = await progRes.text();
  console.log("LIVE RESPONSE:", progRes.status, text);
}
debugLive();
