import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  LogOut,
  ClipboardList,
  Salad,
  Camera,
  BarChart2,
  Trophy,
  BookOpen
} from 'lucide-react';
import './Dashboard.css';

const motivationalQuotes = [
  "Cada dia é uma nova oportunidade de cuidar de você!",
  "Você está mais forte do que imagina!",
  "Pequenos passos levam a grandes transformações!",
  "Seu corpo agradece cada escolha saudável!",
  "Acredite no seu potencial de mudança!",
  "Você merece se sentir bem!",
  "A jornada de mil quilômetros começa com um único passo!",
  "Seja gentil com você mesmo neste processo!"
];

export default function Dashboard() {
  const { user, logout, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [progresso, setProgresso] = useState({
    dias_concluidos: [],
    dia_atual: 1,
    porcentagem_conclusao: 0
  });

  const [loading, setLoading] = useState(true);

  const [quote] = useState(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // ===============================
  // CARREGAR PROGRESSO (API = VERDADE)
  // ===============================
  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      navigate('/login');
      return;
    }

    carregarProgresso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, token]);

  const carregarProgresso = async () => {
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

      setProgresso({
        dias_concluidos: data.dias_concluidos || [],
        dia_atual: data.dia_atual || 1,
        porcentagem_conclusao: data.porcentagem_conclusao || 0
      });
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar progresso:', error);
      setProgresso({
        dias_concluidos: [],
        dia_atual: 1,
        porcentagem_conclusao: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };

  // ===============================
  // ESTADOS DE TELA
  // ===============================
  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const diasConcluidos = progresso.dias_concluidos;
  const diaAtual = progresso.dia_atual;
  const porcentagem = progresso.porcentagem_conclusao;

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-small">
              <Leaf size={24} />
              <span>DETOX 7PRO</span>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}>
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <h1>Olá, {user.nome.split(' ')[0]}!</h1>
          <p className="quote">{quote}</p>

          <div className="progress-card">
            <div className="progress-header">
              <h2>Seu Progresso</h2>
              <span className="day-badge">Dia {diaAtual} de 30</span>
            </div>

            <div className="stats">
              <div>
                <strong>{diasConcluidos.length}</strong>
                <span>Dias concluídos</span>
              </div>
              <div>
                <strong>{Math.round(porcentagem)}%</strong>
                <span>Completo</span>
              </div>
              <div>
                <strong>{30 - diasConcluidos.length}</strong>
                <span>Dias restantes</span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </div>

          <div className="actions">
            <button onClick={() => navigate(`/tarefa/${diaAtual}`)}>
              <ClipboardList /> Ver tarefa
            </button>

            <button onClick={() => navigate('/receitas')}>
              <Salad /> Receitas
            </button>

            <button onClick={() => navigate('/analise-calorias')}>
              <Camera /> Analisar prato
            </button>

            <button onClick={() => navigate('/progresso')}>
              <BarChart2 /> Meu progresso
            </button>

            <button onClick={() => navigate('/ebook')}>
              <BookOpen /> Ebook
            </button>
          </div>

          {diasConcluidos.length === 30 && (
            <div className="final">
              <Trophy size={48} />
              <h2>Desafio completo!</h2>
              <p>Parabéns! Você concluiu os 30 dias do Detox 7PRO.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
