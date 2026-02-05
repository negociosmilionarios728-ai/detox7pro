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
        if (!authLoading && user) {
            fetchProgresso();
        }
    }, [authLoading, user]);

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
                setLoading(false);
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
    const porcentagem = progresso?.porcentagem_conclusao || 0;
    const dias = Array.from({ length: 30 }, (_, i) => i + 1);

    const getMotivationalMessage = () => {
        const count = diasConcluidos.length;
        if (count === 0) return "Comece sua jornada hoje!";
        if (count < 7) return "Ótimo começo! Continue assim!";
        if (count < 14) return "Uma semana completa! Você está arrasando!";
        if (count < 21) return "Metade do caminho! Não desista agora!";
        if (count < 30) return "Quase lá! A transformação está acontecendo!";
        return "PARABÉNS! Você completou o desafio!";
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
                            ></div>
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
                                    {atual && !concluido && <span className="current-badge">Atual</span>}
                                </div>
                            );
                        })}
                    </div>

                    {diasConcluidos.length >= 7 && (
                        <div className="milestones-section">
                            <h2>
                                <Trophy size={28} style={{ marginRight: '10px', verticalAlign: 'middle', color: '#f59e0b' }} />
                                Conquistas
                            </h2>
                            <div className="milestones-grid">
                                {diasConcluidos.length >= 7 && (
                                    <div className="milestone-item card">
                                        <Target className="milestone-icon" size={40} color="#10b981" />
                                        <h3>1 Semana</h3>
                                        <p>Primeira semana completa!</p>
                                    </div>
                                )}
                                {diasConcluidos.length >= 14 && (
                                    <div className="milestone-item card">
                                        <Star className="milestone-icon" size={40} color="#10b981" />
                                        <h3>2 Semanas</h3>
                                        <p>Metade do desafio!</p>
                                    </div>
                                )}
                                {diasConcluidos.length >= 21 && (
                                    <div className="milestone-item card">
                                        <Gem className="milestone-icon" size={40} color="#10b981" />
                                        <h3>21 Dias</h3>
                                        <p>Novo hábito formado!</p>
                                    </div>
                                )}
                                {diasConcluidos.length === 30 && (
                                    <div className="milestone-item card champion">
                                        <Trophy className="milestone-icon" size={40} color="#f59e0b" />
                                        <h3>30 Dias</h3>
                                        <p>Desafio completo!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Progress;
