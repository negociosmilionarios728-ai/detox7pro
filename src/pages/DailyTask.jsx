import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DailyTask.css';

function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [tarefa, setTarefa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadMock();
  }, [dia]);

  function loadMock() {
    const tarefas = {
      1: { dia: 1, titulo: 'Detox Inicial', objetivo: 'Início do processo' },
      2: { dia: 2, titulo: 'Continuidade', objetivo: 'Manter o foco' },
      3: { dia: 3, titulo: 'Avanço', objetivo: 'Evoluir hábitos' }
    };

    setTarefa(tarefas[dia] || tarefas[1]);
    setLoading(false);
  }

  async function handleComplete() {
    if (!confirm('Concluir este dia?')) return;

    setCompleting(true);

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dia: Number(dia) })
      });

      if (!res.ok) throw new Error();

      navigate('/dashboard');
    } catch {
      alert('Erro ao salvar progresso');
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!tarefa) return null;

  return (
    <div className="daily-task-container">
      <h1>Dia {tarefa.dia}</h1>
      <h2>{tarefa.titulo}</h2>
      <p>{tarefa.objetivo}</p>

      <button onClick={handleComplete} disabled={completing}>
        {completing ? 'Salvando...' : 'Concluir Dia'}
      </button>
    </div>
  );
}

export default DailyTask;
