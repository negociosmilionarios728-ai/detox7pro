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
    const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    useEffect(() => {
        if (!authLoading && user) {
            console.log('[v0] Dashboard - user carregado:', user);
            fetchProgresso();
        }
    }, [authLoading, user]);

    const getFirstName = (fullName) => {
        if (!fullName) return '';
        return fullName.split(' ')[0];
    };

    const fetchProgresso = async () => {
        try {
            const response = await fetch(`/api/progress/${user?.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProgresso(data);
                return;
            }
        } catch (error) {
            console.log('[v0] API indisponível, usando mock para teste no preview:', error.message);
        }

        // Fallback com mock para teste no preview
        try {
            const progressData = JSON.parse(localStorage.getItem('detox_progress') || '{}');
            
            if (Object.keys(progressData).length === 0) {
                progressData.dias_concluidos = [];
                progressData.dia_atual = 1;
                progressData.porcentagem_conclusao = 0;
            }

            setProgresso(progressData);
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
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

    // Se não tem usuário autenticado, redireciona para login
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
                            <Leaf className="logo-icon" size={24} />
                            <span className="logo-text">DETOX 7PRO</span>
                        </div>
                        <button className="btn btn-ghost" onClick={handleLogout}>
                            <LogOut size={18} style={{ marginRight: '8px' }} />
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <div className="welcome-section fade-in">
                        <h1>Olá, {getFirstName(user?.nome)}!</h1>
                        <p className="quote">{quote}</p>
                    </div>

                    <div className="progress-card card card-glass">
                        <div className="progress-header">
                            <h2>Seu Progresso</h2>
                            <span className="day-badge badge badge-success">
                                Dia {diaAtual} de 30
                            </span>
                        </div>

                        <div className="progress-stats">
                            <div className="stat">
                                <span className="stat-value">{diasConcluidos.length}</span>
                                <span className="stat-label">Dias Concluídos</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{Math.round(porcentagem)}%</span>
                                <span className="stat-label">Completo</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{30 - diasConcluidos.length}</span>
                                <span className="stat-label">Dias Restantes</span>
                            </div>
                        </div>

                        <div className="progress-bar-container">
                            <div className="progress-bar">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${porcentagem}%` }}
                                ></div>
                            </div>
                            <span className="progress-percentage">{Math.round(porcentagem)}%</span>
                        </div>
                    </div>

                    <div className="action-cards">
                        <div
                            className="action-card card"
                            onClick={() => navigate(`/tarefa/${diaAtual}`)}
                        >
                            <div className="action-icon-wrapper">
                                <ClipboardList className="action-icon" size={48} />
                            </div>
                            <h3>Tarefa de Hoje</h3>
                            <p>Dia {diaAtual}: Veja sua tarefa diária</p>
                            <button className="btn btn-primary">Ver Tarefa</button>
                        </div>

                        <div
                            className="action-card card"
                            onClick={() => navigate('/receitas')}
                        >
                            <div className="action-icon-wrapper">
                                <Salad className="action-icon" size={48} />
                            </div>
                            <h3>Receitas</h3>
                            <p>Explore receitas detox e emagrecimento</p>
                            <button className="btn btn-secondary">Ver Receitas</button>
                        </div>

                        <div
                            className="action-card card"
                            onClick={() => navigate('/analise-calorias')}
                        >
                            <div className="action-icon-wrapper">
                                <Camera className="action-icon" size={48} />
                            </div>
                            <h3>Análise de Calorias</h3>
                            <p>Tire foto do prato e veja as calorias</p>
                            <button className="btn btn-secondary">Analisar Prato</button>
                        </div>

                        <div
                            className="action-card card"
                            onClick={() => navigate('/progresso')}
                        >
                            <div className="action-icon-wrapper">
                                <BarChart2 className="action-icon" size={48} />
                            </div>
                            <h3>Meu Progresso</h3>
                            <p>Acompanhe sua evolução completa</p>
                            <button className="btn btn-secondary">Ver Progresso</button>
                        </div>

                        <div
                            className="action-card card"
                            onClick={() => navigate('/ebook')}
                        >
                            <div className="action-icon-wrapper">
                                <BookOpen className="action-icon" size={48} />
                            </div>
                            <h3>Ebook 70 Receitas Detox</h3>
                            <p>Acesse o guia completo de receitas</p>
                            <button className="btn btn-secondary">Ver Ebook</button>
                        </div>
                    </div>

                    {diasConcluidos.length === 7 && (
                        <div className="milestone-card card">
                            <Target size={48} className="milestone-icon" color="#10b981" />
                            <h3>Parabéns! 1 Semana Completa!</h3>
                            <p>Você está no caminho certo. Continue assim!</p>
                        </div>
                    )}

                    {diasConcluidos.length === 14 && (
                        <div className="milestone-card card">
                            <Star size={48} className="milestone-icon" color="#10b981" />
                            <h3>Incrível! Metade do Desafio!</h3>
                            <p>Você já percorreu metade da jornada. Não desista agora!</p>
                        </div>
                    )}

                    {diasConcluidos.length === 21 && (
                        <div className="milestone-card card">
                            <Flame size={48} className="milestone-icon" color="#10b981" />
                            <h3>21 Dias! Novo Hábito Formado!</h3>
                            <p>Cientificamente, você criou um novo hábito. Sensacional!</p>
                        </div>
                    )}

                    {diasConcluidos.length === 30 && (
                        <div className="milestone-card card celebration">
                            <Trophy size={48} className="milestone-icon" color="#f59e0b" />
                            <h3>DESAFIO COMPLETO!</h3>
                            <p>Você transformou sua vida em 30 dias. Parabéns pela dedicação!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
