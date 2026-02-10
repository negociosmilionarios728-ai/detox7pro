import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DailyTask.css';

export default function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { token, user, loading: authLoading } = useAuth();

  const [tarefa, setTarefa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      navigate('/login');
      return;
    }

    carregarTarefa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, dia]);

  const carregarTarefa = async () => {
    try {
      const res = await fetch(`/api/tasks/${dia}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setTarefa(data);
    } catch (err) {
      alert('Erro ao carregar tarefa');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
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
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

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
