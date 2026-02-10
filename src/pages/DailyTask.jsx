import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';

function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleComplete = async () => {
    if (!confirm('Concluir este dia?')) return;

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
        throw new Error('Falha ao salvar progresso');
      }

      navigate('/dashboard');
    } catch (err) {
      alert('Erro ao concluir tarefa');
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={18} /> Voltar
      </button>

      <h1>Dia {dia}</h1>

      <button onClick={handleComplete}>
        <CheckCircle size={18} /> Concluir dia
      </button>
    </div>
  );
}

export default DailyTask;
