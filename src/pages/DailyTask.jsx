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
    // eslint-disable-next-line
  }, [dia]);

  const fetchTarefa = async () => {
    try {
      const response = await fetch(`/api/tasks/${dia}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Falha ao carregar tarefa');

      const data = await response.json();
      setTarefa(data);
    } catch {
      setTarefa(null);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CONCLUIR DIA — ÚNICA ROTA
  // ==============================
  const handleComplete = async () => {
    if (!window.confirm('Tem certeza que deseja concluir este dia?')) return;

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

      if (!response.ok) {
        throw new Error('Erro ao concluir dia');
      }

      await response.json();
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao concluir tarefa');
      console.error(error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!tarefa) return null;

  return (
    <div className="daily-task-container">
      <header className="task-header">
        <div className="container">
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} style={{ marginRight: 8 }} />
            Voltar
          </button>
        </div>
      </header>

      <main className="task-main">
        <div className="container">
          <span className="day-number">Dia {tarefa.dia}</span>
          <h1>{tarefa.titulo}</h1>
          <p>{tarefa.objetivo}</p>

          <div className="task-actions">
            <button
              className="btn btn-primary"
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? 'Concluindo...' : (
                <>
                  <CheckCircle size={20} />
                  Concluir Tarefa
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DailyTask;
