import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Dumbbell,
  Salad,
  Leaf,
  Scale,
  FileText,
  ChefHat,
  Sparkles,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import './DailyTask.css';

function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [tarefa, setTarefa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchTarefa();
  }, [dia]);

  const fetchTarefa = async () => {
    try {
      const response = await fetch(`/api/tasks/${dia}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setTarefa(data);
    } catch {
      setTarefa(null);
    } finally {
      setLoading(false);
    }
  };

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
        body: JSON.stringify({ dia: Number(dia) })
      });

      if (!response.ok) throw new Error();

      navigate('/dashboard');
    } catch {
      alert('Erro ao concluir tarefa');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="loading-container" />;

  if (!tarefa) return null;

  return (
    <div className="daily-task-container">
      <header className="task-header">
        <button onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Voltar
        </button>
      </header>

      <main>
        <h1>Dia {tarefa.dia}</h1>
        <p>{tarefa.titulo}</p>

        <button onClick={handleComplete} disabled={completing}>
          <CheckCircle size={20} />
          {completing ? 'Concluindo...' : 'Concluir tarefa'}
        </button>
      </main>
    </div>
  );
}

export default DailyTask;
