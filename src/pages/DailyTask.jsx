import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DailyTask.css';

function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();

  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

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

      if (!response.ok) {
        throw new Error('Erro ao buscar tarefa');
      }

      const data = await response.json();
      setTask(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar tarefa');
    }
  };

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Carregando tarefa...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dia {dia}</h1>
      <h2>{task.titulo}</h2>
      <p>{task.descricao}</p>
    </div>
  );
}

export default DailyTask;
