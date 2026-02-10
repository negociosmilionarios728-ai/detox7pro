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
    Target,
    Award,
    Flame,
    Star,
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

function Dashboard() {
    const { user, logout, token, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [progresso, setProgresso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quote] = useState(
        () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );

    useEffect(() => {
        if (!authLoading && user) {
            carregarProgresso();
        }
    }, [authLoading, user]);

    const carregarProgresso = async () => {
        try {
            const response = await fetch(`/api/progress/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar progresso');
            }

            const data = await response.json();
            setProgresso(data);
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Tem certeza que deseja sair?')) {
            logout();
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
    const diaAtual = progresso?.dia_atual || 1;
    const porcentagem = progresso?.porcentagem_conclusao || 0;

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
                        <h2>Seu Progresso</h2>
                        <span>Dia {diaAtual} de 30</span>

                        <div className="stats">
                            <div>{diasConcluidos.length} dias concluídos</div>
                            <div>{Math.round(porcentagem)}%</div>
                            <div>{30 - diasConcluidos.length} dias restantes</div>
                        </div>

                        <div className="progress-bar">
                            <div style={{ width: `${porcentagem}%` }} />
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
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
