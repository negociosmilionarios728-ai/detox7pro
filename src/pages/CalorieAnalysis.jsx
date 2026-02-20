import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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

  const [descricao, setDescricao] = useState('');
  const [peso, setPeso] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeMeal = async () => {
    if (!descricao) {
      setError('Digite o nome do prato.');
      return;
    }

    setError('');
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/calcular-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao,
          peso: peso ? Number(peso) : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao calcular');
        setAnalyzing(false);
        return;
      }

      setResult({
        foodName: data.nome,
        calories: data.calorias,
        protein: data.proteinas,
        carbs: data.carboidratos,
        fat: data.gorduras,
        fiber: data.fibras,
        portions: `${data.peso}g`
      });

    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    }

    setAnalyzing(false);
  };

  const resetAnalysis = () => {
    setDescricao('');
    setPeso('');
    setResult(null);
    setError('');
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
            <h1>Análise de Calorias</h1>
            <p>Digite o nome do prato para calcular as calorias</p>
          </div>

          {!result ? (
            <div className="analyze-card card">

              <input
                type="text"
                placeholder="Ex: arroz feijao carne"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="analysis-input"
              />

              <input
                type="number"
                placeholder="Peso em gramas (opcional)"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="analysis-input"
              />

              {error && (
                <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
              )}

              <button
                className="btn btn-primary analyze-btn"
                onClick={analyzeMeal}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="spinner-small" size={20} />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Search size={20} style={{ marginRight: '8px' }} />
                    Calcular Calorias
                  </>
                )}
              </button>

            </div>
          ) : (
            <div className="results-card card fade-in">

              <div className="result-header">
                <h3>
                  <BarChart2 size={24} style={{ marginRight: '10px' }} />
                  Resultado da Análise
                </h3>
                <span className="confidence-badge badge badge-success">
                  100% base interna
                </span>
              </div>

              <div className="food-identified">
                <h4>{result.foodName}</h4>
                <p>{result.portions}</p>
              </div>

              <div className="calories-highlight">
                <div className="calorie-number">{result.calories}</div>
                <div className="calorie-label">Calorias Estimadas</div>
              </div>

              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <Dumbbell size={24} />
                  <div>{result.protein}g</div>
                  <span>Proteínas</span>
                </div>
                <div className="nutrition-item">
                  <Wheat size={24} />
                  <div>{result.carbs}g</div>
                  <span>Carboidratos</span>
                </div>
                <div className="nutrition-item">
                  <Droplet size={24} />
                  <div>{result.fat}g</div>
                  <span>Gorduras</span>
                </div>
                <div className="nutrition-item">
                  <Sprout size={24} />
                  <div>{result.fiber}g</div>
                  <span>Fibras</span>
                </div>
              </div>

              <div className="result-disclaimer">
                <AlertTriangle size={16} />
                <span>
                  Valores baseados em média nutricional padrão.
                </span>
              </div>

              <button className="btn btn-primary" onClick={resetAnalysis}>
                Calcular Outro Prato
              </button>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default CalorieAnalysis;