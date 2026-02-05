import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Camera,
    ArrowLeft,
    Utensils,
    Lightbulb,
    RefreshCw,
    Bot,
    Search,
    BarChart2,
    Dumbbell,
    Wheat,
    Droplet,
    Sprout,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import './CalorieAnalysis.css';

function CalorieAnalysis() {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setResult(null);

            // Criar preview da imagem
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) {
            alert('Por favor, selecione uma imagem primeiro');
            return;
        }

        setAnalyzing(true);

        // Simular análise de IA (em produção, você usaria uma API real como Google Vision, Clarifai, ou um modelo próprio)
        setTimeout(() => {
            // Simulação de resultado baseado em análise de imagem
            const mockResults = [
                {
                    foodName: 'Arroz com Feijão e Frango Grelhado',
                    calories: 520,
                    protein: 35,
                    carbs: 65,
                    fat: 12,
                    fiber: 8,
                    portions: 'Porção média (350g)',
                    confidence: 85
                },
                {
                    foodName: 'Salada Verde com Atum',
                    calories: 280,
                    protein: 28,
                    carbs: 15,
                    fat: 14,
                    fiber: 6,
                    portions: 'Porção grande (300g)',
                    confidence: 90
                },
                {
                    foodName: 'Macarrão com Molho de Tomate',
                    calories: 450,
                    protein: 15,
                    carbs: 75,
                    fat: 10,
                    fiber: 5,
                    portions: 'Porção média (400g)',
                    confidence: 88
                },
                {
                    foodName: 'Hambúrguer com Batata Frita',
                    calories: 850,
                    protein: 32,
                    carbs: 85,
                    fat: 42,
                    fiber: 4,
                    portions: 'Porção grande (500g)',
                    confidence: 82
                },
                {
                    foodName: 'Smoothie de Frutas',
                    calories: 220,
                    protein: 8,
                    carbs: 45,
                    fat: 3,
                    fiber: 7,
                    portions: 'Copo grande (400ml)',
                    confidence: 92
                }
            ];

            // Selecionar resultado aleatório para demonstração
            const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

            setResult(randomResult);
            setAnalyzing(false);
        }, 2000);
    };

    const resetAnalysis = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setResult(null);
    };

    return (
        <div className="calorie-analysis-container">
            <header className="analysis-header">
                <div className="container">
                    <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                        Voltar
                    </button>
                </div>
            </header>

            <main className="analysis-main">
                <div className="container">
                    <div className="analysis-title-section fade-in">
                        <div className="flex-center" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                            <Camera size={40} color="var(--primary-green)" />
                        </div>
                        <h1>Análise de Calorias</h1>
                        <p>Tire uma foto do seu prato e descubra quantas calorias tem!</p>
                    </div>

                    <div className="analysis-content">
                        {!imagePreview ? (
                            <div className="upload-section card">
                                <div className="upload-icon-wrapper">
                                    <Utensils className="upload-icon" size={48} />
                                </div>
                                <h2>Envie uma Foto do Seu Prato</h2>
                                <p className="upload-description">
                                    Nossa IA analisará a imagem e estimará as calorias e informações nutricionais
                                </p>

                                <label htmlFor="image-upload" className="btn btn-primary upload-btn">
                                    <Camera size={20} style={{ marginRight: '8px' }} />
                                    Selecionar Foto
                                </label>
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    style={{ display: 'none' }}
                                />

                                <div className="upload-tips">
                                    <h4>
                                        <Lightbulb size={18} style={{ marginRight: '8px', color: '#f59e0b' }} />
                                        Dicas para melhores resultados:
                                    </h4>
                                    <ul>
                                        <li>Tire a foto de cima, mostrando todo o prato</li>
                                        <li>Use boa iluminação</li>
                                        <li>Evite sombras sobre a comida</li>
                                        <li>Mostre claramente todos os alimentos</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="analysis-section">
                                <div className="image-preview-card card">
                                    <h3>Sua Foto</h3>
                                    <img src={imagePreview} alt="Prato selecionado" className="preview-image" />
                                    <button className="btn btn-ghost" onClick={resetAnalysis}>
                                        <RefreshCw size={16} style={{ marginRight: '8px' }} />
                                        Trocar Foto
                                    </button>
                                </div>

                                {!result ? (
                                    <div className="analyze-card card">
                                        <div className="analyze-icon-wrapper">
                                            <Bot className="analyze-icon" size={48} />
                                        </div>
                                        <h3>Pronto para Analisar!</h3>
                                        <p>Nossa IA está pronta para analisar sua refeição</p>
                                        <button
                                            className="btn btn-primary analyze-btn"
                                            onClick={analyzeImage}
                                            disabled={analyzing}
                                        >
                                            {analyzing ? (
                                                <>
                                                    <Loader2 className="spinner-small" size={20} />
                                                    Analisando...
                                                </>
                                            ) : (
                                                <>
                                                    <Search size={20} style={{ marginRight: '8px' }} />
                                                    Analisar Calorias
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="results-card card fade-in">
                                        <div className="result-header">
                                            <h3>
                                                <BarChart2 size={24} style={{ marginRight: '10px', color: 'var(--primary-green)' }} />
                                                Resultado da Análise
                                            </h3>
                                            <span className="confidence-badge badge badge-success">
                                                {result.confidence}% de confiança
                                            </span>
                                        </div>

                                        <div className="food-identified">
                                            <h4>Prato Identificado:</h4>
                                            <p className="food-name">{result.foodName}</p>
                                            <p className="portions">{result.portions}</p>
                                        </div>

                                        <div className="calories-highlight">
                                            <div className="calorie-number">{result.calories}</div>
                                            <div className="calorie-label">Calorias Estimadas</div>
                                        </div>

                                        <div className="nutrition-grid">
                                            <div className="nutrition-item">
                                                <div className="nutrition-icon-wrapper">
                                                    <Dumbbell className="nutrition-icon" size={24} />
                                                </div>
                                                <div className="nutrition-value">{result.protein}g</div>
                                                <div className="nutrition-label">Proteínas</div>
                                            </div>
                                            <div className="nutrition-item">
                                                <div className="nutrition-icon-wrapper">
                                                    <Wheat className="nutrition-icon" size={24} />
                                                </div>
                                                <div className="nutrition-value">{result.carbs}g</div>
                                                <div className="nutrition-label">Carboidratos</div>
                                            </div>
                                            <div className="nutrition-item">
                                                <div className="nutrition-icon-wrapper">
                                                    <Droplet className="nutrition-icon" size={24} />
                                                </div>
                                                <div className="nutrition-value">{result.fat}g</div>
                                                <div className="nutrition-label">Gorduras</div>
                                            </div>
                                            <div className="nutrition-item">
                                                <div className="nutrition-icon-wrapper">
                                                    <Sprout className="nutrition-icon" size={24} />
                                                </div>
                                                <div className="nutrition-value">{result.fiber}g</div>
                                                <div className="nutrition-label">Fibras</div>
                                            </div>
                                        </div>

                                        <div className="result-disclaimer">
                                            <p>
                                                <AlertTriangle size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'text-bottom', color: '#f59e0b' }} />
                                                <strong>Nota:</strong> Esta é uma estimativa baseada em análise de imagem.
                                                Os valores podem variar dependendo dos ingredientes e modo de preparo.
                                            </p>
                                        </div>

                                        <button className="btn btn-primary" onClick={resetAnalysis}>
                                            <Camera size={20} style={{ marginRight: '8px' }} />
                                            Analisar Outro Prato
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CalorieAnalysis;
