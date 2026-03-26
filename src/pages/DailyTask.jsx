import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import "./DailyTask.css";

export default function DailyTask() {
  const { dia } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [tarefa, setTarefa] = useState(null);
  const [erro, setErro] = useState("");
  const [concluido, setConcluido] = useState(false);
  const [loadingConclusao, setLoadingConclusao] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // 🔹 Buscar tarefa
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await fetch(`/api/tasks/${dia}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setTarefa(data);

        const progressoRes = await fetch(`/api/progress?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (progressoRes.ok) {
          const progresso = await progressoRes.json();
          const diasConcluidos = progresso.completed_days || [];

          if (diasConcluidos.includes(Number(dia))) {
            setConcluido(true);
          }


        }

      } catch {
        setErro("Erro ao carregar tarefa");
      }
    };

    if (token) {
      carregarDados();
    }
  }, [dia, token]);

  // 🔹 Marcar como concluído
  const handleConcluir = async () => {
    try {
      setLoadingConclusao(true);
      setMensagem("");

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dia: Number(dia) })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "");
      }

      setConcluido(true);
      setMensagem("Tarefa concluída com sucesso!");

    } catch (e) {
      setMensagem(e.message || "Erro ao marcar como concluída.");
    } finally {
      setLoadingConclusao(false);
    }
  };

  // 🔥 Renderização profissional do exercício
  const renderExercise = () => {
    if (!tarefa.exercise) {
      return <p>Exercício não informado.</p>;
    }

    const linhas = tarefa.exercise.split("\n").filter(l => l.trim() !== "");

    const titulo = linhas[0];
    const listaItens = linhas
      .filter(l => l.trim().startsWith("-"))
      .map(l => l.replace("-", "").trim());

    const textoNormal = linhas.filter(
      l => !l.trim().startsWith("-") && l !== titulo
    );

    return (
      <div className="exercise-content">
        <h3 className="exercise-title">{titulo}</h3>

        {textoNormal.map((linha, index) => (
          <p key={index} className="exercise-text">
            {linha}
          </p>
        ))}

        {listaItens.length > 0 && (
          <ul className="exercise-list">
            {listaItens.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (erro) {
    return <h2 className="center-message">{erro}</h2>;
  }

  if (!tarefa) {
    return <h2 className="center-message">Carregando...</h2>;
  }

  return (
    <div className="daily-task-container">
      <div className="task-main">

        {/* 🔝 Top Bar */}
        <div className="task-top-bar">
          <button
            className="btn-back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        <div className="task-title-section">
          <div className="day-number">Dia {dia}</div>
          <h1>{tarefa.title}</h1>
          <p className="objective">{tarefa.description}</p>
        </div>

        <div className="task-content">

          {/* 🔥 Exercício Profissional */}
          <div className="card exercise-card">
            <div className="card-header">
              <h2>Exercício do Dia</h2>
            </div>

            {renderExercise()}
          </div>

          {/* 🍃 Receita */}
          <div className="card recipe-card">
            <div className="card-header">
              <h2>Receita Detox</h2>
            </div>

            <h3 className="recipe-name">
              {tarefa.recipe_name || "Receita especial"}
            </h3>

            <div className="recipe-section">
              <h4>Ingredientes</h4>
              <p>{tarefa.ingredients || "Não informado."}</p>
            </div>

            <div className="recipe-section">
              <h4>Modo de preparo</h4>
              <p>{tarefa.preparation || "Não informado."}</p>
            </div>

            <div className="recipe-section benefits">
              <h4>Benefícios</h4>
              <p>{tarefa.benefits || "Não informado."}</p>
            </div>
          </div>

        </div>

        <div className="task-actions">
          <button
            className="btn btn-primary btn-complete"
            onClick={handleConcluir}
            disabled={concluido || loadingConclusao}
          >
            {concluido
              ? "Tarefa Concluída ✔"
              : loadingConclusao
              ? "Salvando..."
              : "Marcar como Concluído"}
          </button>

          {mensagem && (
            <p className="success-message">
              {mensagem}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}