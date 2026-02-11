import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DailyTask.css';

function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  const [task, setTask] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user || !token) {
      navigate('/login');
      return;
    }

    carregarTarefa();
  }, [loading, user, token]);

  const carregarTarefa = async () => {
    try {
      const response = await fetch(`/api/tasks/${dia}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setTask(data);
    } catch (err) {
      console.error('Erro ao carregar tarefa');
    }
  };

  if (!task) return null;

  return (
    <div className="task-container">
      <h1>Dia {dia}</h1>
      <h2>{task.titulo}</h2>
      <p>{task.descricao}</p>
    </div>
  );
}

export default DailyTask;
