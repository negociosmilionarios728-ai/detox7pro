import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  LogOut,
  ClipboardList,
  Salad,
  Camera
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
    completed_days: [],
    current_day: 1
  });

  const [loading, setLoading] = useState(true);

  const [quote] = useState(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      navigate('/login');
      return;
    }

    carregarProgresso();
  }, [authLoading, user, token]);

  const carregarProgresso = async () => {
    try {
      const response = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      setProgresso({
        completed_days: data.completed_days || [],
        current_day: data.current_day || 1
      });

    } catch {
      setProgresso({
        completed_days: [],
        current_day: 1
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="dashboard-wrapper" />;
  }

  const diasConcluidos = progresso.completed_days;
  const diaAtual = progresso.current_day;
  const porcentagem = (diasConcluidos.length / 30) * 100;

  return (
    <div className="dashboard-wrapper">

      <header className="dashboard-header">
        <div className="logo">
          <Leaf size={20} />
          <span>DETOX 7PRO</span>
        </div>
        <button className="logout-btn" onClick={() => {
          logout();
          navigate('/login');
        }}>
          <LogOut size={16}/> Sair
        </button>
      </header>

      <div className="dashboard-content">

        <h1>Olá, {user?.nome.split(' ')[0]}!</h1>
        <p className="subtitle">{quote}</p>

        <div className="progress-card">

          <div className="progress-top">
            <h2>Seu Progresso</h2>
            <span className="badge">Dia {diaAtual} de 30</span>
          </div>

          <div className="progress-stats">
            <div>
              <h3>{diasConcluidos.length}</h3>
              <p>Dias Concluídos</p>
            </div>
            <div>
              <h3>{Math.round(porcentagem)}%</h3>
              <p>Completo</p>
            </div>
            <div>
              <h3>{30 - diasConcluidos.length}</h3>
              <p>Dias Restantes</p>
            </div>
          </div>

          <div className="progress-bar-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
            <span className="progress-percent">
              {Math.round(porcentagem)}%
            </span>
          </div>
        </div>

        <div className="cards-grid">

          <div className="action-card" onClick={() => navigate(`/tarefa/${diaAtual}`)}>
            <ClipboardList size={28}/>
            <h3>Tarefa de Hoje</h3>
            <p>Veja sua tarefa diária</p>
          </div>

          <div className="action-card" onClick={() => navigate('/receitas')}>
            <Salad size={28}/>
            <h3>Receitas</h3>
            <p>Explore receitas detox</p>
          </div>

          <div className="action-card" onClick={() => navigate('/analise-calorias')}>
            <Camera size={28}/>
            <h3>Análise de Calorias</h3>
            <p>Analise seu prato</p>
          </div>

        </div>

      </div>
    </div>
  );
}
