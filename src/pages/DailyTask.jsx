const handleComplete = async () => {
  if (!confirm('Tem certeza que deseja concluir este dia?')) return;

  setCompleting(true);

  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        dia: Number(dia)
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao concluir dia');
    }

    await response.json();
    navigate('/dashboard');
  } catch (error) {
    console.error('Erro ao concluir tarefa:', error);
    alert('Erro ao concluir tarefa');
  } finally {
    setCompleting(false);
  }
};
