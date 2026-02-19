import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart2,
  ArrowLeft,
  Target,
  Star,
  Gem,
  Trophy,
  Check
} from 'lucide-react';
import './Progress.css';

function Progress() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();

  const [progresso, setProgresso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && token) {
      fetchProgresso();
    }
  }, [authLoading, user, token]);

  const fetchProgresso = async () => {
    try {
      const response = await fetch('/api/progress', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar progresso');
      }

      const data = await response.json();

      // 🔥 Adaptando para estrutura nova do banco
      const diasConcluidos = data.completed_days || [];
      const diaAtual = data.current_day || 1;
      const porcentagem = (diasConcluidos.length / 30) * 100;

      setProgresso({
        dias_concluidos: diasConcluidos,
        dia_atual: diaAtual,
        porcentagem_conclusao: porcentagem
      });

    } catch (error) {
      console.error('[Progress] Erro ao buscar progresso:', error);
      setProgresso({
        dias_concluidos: [],
        dia_atual: 1,
        porcentagem_conclusao: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const diasConcluidos = progresso?.dias_concluidos || [];
  const porcentagem = progresso?.porcentagem_conclusao || 0;
  const dias = Array.from({ length: 30 }, (_, i) => i + 1);

  const getMotivationalMessage = () => {
    const count = diasConcluidos.length;
    if (count === 0) return 'Comece sua jornada hoje!';
    if (count < 7) return 'Ótimo começo! Continue assim!';
    if (count < 14) return 'Uma semana completa! Você está arrasando!';
    if (count < 21) return 'Metade do caminho! Não desista agora!';
    if (count < 30) return 'Quase lá! A transformação está acontecendo!';
    return 'PARABÉNS! Você completou o desafio!';
  };

  return (
    <div className="progress-container">
      <header className="progress-header">
        <div className="container">
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Voltar
          </button>
        </div>
      </header>

      <main className="progress-main">
        <div className="container">
          <div className="progress-title-section fade-in">
            <div className="flex-center" style={{ justifyContent: 'center', marginBottom: '16px' }}>
              <BarChart2 size={40} color="var(--primary-green)" />
            </div>
            <h1>Meu Progresso</h1>
            <p className="motivation-message">{getMotivationalMessage()}</p>
          </div>

          <div className="progress-summary card card-glass">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-number">{diasConcluidos.length}</span>
                <span className="stat-text">Dias Concluídos</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{Math.round(porcentagem)}%</span>
                <span className="stat-text">Completo</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{30 - diasConcluidos.length}</span>
                <span className="stat-text">Dias Restantes</span>
              </div>
            </div>

            <div className="progress-bar-large">
              <div
                className="progress-bar-fill"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </div>

          <div className="days-grid">
            {dias.map(dia => {
              const concluido = diasConcluidos.includes(dia);
              const atual = progresso?.dia_atual === dia;

              return (
                <div
                  key={dia}
                  className={`day-item ${concluido ? 'completed' : ''} ${atual ? 'current' : ''}`}
                  onClick={() => navigate(`/tarefa/${dia}`)}
                >
                  <span className="day-number">{dia}</span>
                  {concluido && (
                    <span className="check-icon">
                      <Check size={14} />
                    </span>
                  )}
                  {atual && !concluido && (
                    <span className="current-badge">Atual</span>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}

export default Progress;
