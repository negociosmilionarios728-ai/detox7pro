export default function tasksHandler(req, res) {
  const dia = Number(req.params.dia);

  const tarefas = {
    1: { dia: 1, titulo: 'Detox Inicial', objetivo: 'Início do processo' },
    2: { dia: 2, titulo: 'Continuidade', objetivo: 'Manter o foco' },
    3: { dia: 3, titulo: 'Avanço', objetivo: 'Evoluir hábitos' }
  };

  const tarefa = tarefas[dia] || {
    dia,
    titulo: `Dia ${dia}`,
    objetivo: 'Siga o plano do Detox 7PRO'
  };

  res.json(tarefa);
}
