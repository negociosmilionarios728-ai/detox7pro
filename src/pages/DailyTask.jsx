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
    ArrowLeft,
    Check
} from 'lucide-react';
import './DailyTask.css';

function DailyTask() {
    const { dia } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [tarefa, setTarefa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        fetchTarefa();
    }, [dia]);

    const fetchTarefa = async () => {
        try {
            const response = await fetch(`/api/tasks/${dia}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTarefa(data);
            } else {
                throw new Error('Falha ao carregar tarefa');
            }
        } catch (error) {
            console.log('[v0] API indisponível, usando dados mock:', error.message);
            // Fallback com dados mockados para teste no preview
            const tarefasMock = {
                1: {
                    dia: 1,
                    titulo: 'Detox Inicial - Preparando o Corpo',
                    objetivo: 'Começar a limpeza e preparação do corpo',
                    tempo_estimado: 45,
                    exercicio: 'Caminhada leve de 20 minutos pela manhã + alongamento básico de 10 minutos. Beba 2 litros de água durante o dia.',
                    receita: {
                        nome: 'Suco Verde Matinal',
                        tipo: 'detox',
                        ingredientes: '1 xícara de espinafre, 1 maçã verde, 1 cenoura, 1 laranja, 1/2 limão, 200ml de água filtrada',
                        preparo: 'Bata todos os ingredientes no liquidificador por 2 minutos. Coe se preferir. Beba na hora.',
                        beneficios: 'Rico em clorofila e antioxidantes, ajuda na desintoxicação natural do corpo, melhora a energia e acelera o metabolismo.'
                    }
                },
                2: {
                    dia: 2,
                    titulo: 'Aumentando a Intensidade',
                    objetivo: 'Potencializar o processo de desintoxicação',
                    tempo_estimado: 50,
                    exercicio: 'Caminhada rápida de 25 minutos + 5 minutos de corrida leve intercalada. Faça 10 flexões de parede.',
                    receita: {
                        nome: 'Chá Detox com Gengibre',
                        tipo: 'detox',
                        ingredientes: '1 colher de chá de gengibre ralado, 1 limão, 1 colher de mel, 1 canela em pau, 250ml de água quente',
                        preparo: 'Coloque a canela e o gengibre na água quente. Deixe em repouso por 5 minutos. Coe, adicione o suco de limão e mel.',
                        beneficios: 'Acelera o metabolismo, reduz inflamações, melhora a digestão e aumenta a queima de calorias.'
                    }
                },
                3: {
                    dia: 3,
                    titulo: 'Força e Resistência',
                    objetivo: 'Aumentar força muscular e resistência cardiovascular',
                    tempo_estimado: 60,
                    exercicio: 'Caminhada de 30 minutos com variação de velocidade + 15 flexões de parede + 20 agachamentos.',
                    receita: {
                        nome: 'Smoothie de Proteína Natural',
                        tipo: 'emagrecimento',
                        ingredientes: '1 xícara de leite desnatado, 1 banana, 2 colheres de sopa de iogurte grego, 1 colher de mel, 1/2 xícara de morangos congelados',
                        preparo: 'Bata todos os ingredientes no liquidificador até ficar cremoso. Sirva gelado.',
                        beneficios: 'Fornece proteína para recuperação muscular, mantém saciedade, melhora a composição corporal e ajuda no emagrecimento saudável.'
                    }
                }
            };

            const tarefaMock = tarefasMock[parseInt(dia)] || tarefasMock[1];
            setTarefa(tarefaMock);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!confirm('Tem certeza que deseja concluir este dia?')) {
            return;
        }

        setCompleting(true);
        try {
            const response = await fetch('/api/progress/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    dia: parseInt(dia)
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                navigate('/dashboard');
                return;
            }
        } catch (error) {
            console.log('[v0] API indisponível, usando mock para teste no preview:', error.message);
        }

        // Fallback com mock para teste no preview
        try {
            const progressData = JSON.parse(localStorage.getItem('detox_progress') || '{}');
            const diasConcluidos = progressData.dias_concluidos || [];
            
            if (!diasConcluidos.includes(parseInt(dia))) {
                diasConcluidos.push(parseInt(dia));
            }

            progressData.dias_concluidos = diasConcluidos;
            progressData.dia_atual = Math.max(...diasConcluidos) + 1;
            progressData.porcentagem_conclusao = (diasConcluidos.length / 30) * 100;

            localStorage.setItem('detox_progress', JSON.stringify(progressData));

            alert('Tarefa concluída com sucesso! Parabéns!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            alert('Erro ao concluir tarefa');
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

    if (!tarefa) {
        return null;
    }

    return (
        <div className="daily-task-container">
            <header className="task-header">
                <div className="container">
                    <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                        Voltar
                    </button>
                </div>
            </header>

            <main className="task-main">
                <div className="container">
                    <div className="task-title-section fade-in">
                        <span className="day-number">Dia {tarefa.dia}</span>
                        <h1>{tarefa.titulo}</h1>
                        <p className="objective">{tarefa.objetivo}</p>
                        <div className="time-badge badge badge-info">
                            <Clock size={16} style={{ marginRight: '6px' }} />
                            {tarefa.tempo_estimado} minutos
                        </div>
                    </div>

                    <div className="task-content">
                        <div className="exercise-card card">
                            <div className="card-header">
                                <h2 className="flex-center">
                                    <Dumbbell className="section-icon" size={24} />
                                    Exercício do Dia
                                </h2>
                            </div>
                            <p className="exercise-description">{tarefa.exercicio}</p>
                        </div>

                        <div className="recipe-card card">
                            <div className="card-header">
                                <h2 className="flex-center">
                                    <Salad className="section-icon" size={24} />
                                    Receita do Dia
                                </h2>
                                <span className={`recipe-type-badge badge ${tarefa.receita.tipo === 'detox' ? 'badge-success' : 'badge-info'}`}>
                                    {tarefa.receita.tipo === 'detox' ? (
                                        <>
                                            <Leaf size={14} style={{ marginRight: '4px' }} />
                                            Detox
                                        </>
                                    ) : (
                                        <>
                                            <Scale size={14} style={{ marginRight: '4px' }} />
                                            Emagrecimento
                                        </>
                                    )}
                                </span>
                            </div>

                            <h3 className="recipe-name">{tarefa.receita.nome}</h3>

                            <div className="recipe-section">
                                <h4>
                                    <FileText size={18} style={{ marginRight: '8px', color: 'var(--primary-green)' }} />
                                    Ingredientes
                                </h4>
                                <p>{tarefa.receita.ingredientes}</p>
                            </div>

                            <div className="recipe-section">
                                <h4>
                                    <ChefHat size={18} style={{ marginRight: '8px', color: 'var(--primary-green)' }} />
                                    Modo de Preparo
                                </h4>
                                <p>{tarefa.receita.preparo}</p>
                            </div>

                            <div className="recipe-section benefits">
                                <h4>
                                    <Sparkles size={18} style={{ marginRight: '8px', color: 'var(--primary-green)' }} />
                                    Benefícios
                                </h4>
                                <p>{tarefa.receita.beneficios}</p>
                            </div>
                        </div>
                    </div>

                    <div className="task-actions">
                        <button
                            className="btn btn-primary btn-complete"
                            onClick={handleComplete}
                            disabled={completing}
                        >
                            {completing ? (
                                'Concluindo...'
                            ) : (
                                <>
                                    <CheckCircle size={20} style={{ marginRight: '8px' }} />
                                    Concluir Tarefa & Avançar
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
