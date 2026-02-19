import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DailyTask.css";

export default function DailyTask() {
  const { dia } = useParams();
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

        // 🔎 Verificar se já está concluído
        const progressoRes = await fetch("/api/progress", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (progressoRes.ok) {
          const progresso = await progressoRes.json();
          const diasConcluidos = progresso.completedDays || [];

          if (diasConcluidos.includes(Number(dia))) {
            setConcluido(true);
          }
        }
      } catch {
        setErro("Erro ao carregar tarefa");
      }
    };

    carregarDados();
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
        body: JSON.stringify({ day: Number(dia) })
      });

      if (!res.ok) throw new Error();

      setConcluido(true);
      setMensagem("Tarefa concluída com sucesso!");
    } catch {
      setMensagem("Erro ao marcar como concluída.");
    } finally {
      setLoadingConclusao(false);
    }
  };

  if (erro) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        {erro}
      </h2>
    );
  }

  if (!tarefa) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Carregando...
      </h2>
    );
  }

  return (
    <div className="daily-task-container">
      <div className="task-main">
        <div className="task-title-section">
          <div className="day-number">Dia {dia}</div>
          <h1>{tarefa.title}</h1>
          <p className="objective">{tarefa.description}</p>
        </div>

        <div className="task-content">

          <div className="card exercise-card card">
            <div className="card-header">
              <h2>Exercício do Dia</h2>
            </div>
            <p className="exercise-description">
              {tarefa.exercise || "Exercício não informado."}
            </p>
          </div>

          <div className="card recipe-card card">
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

            <div className="recipe-section">
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
            style={{
              opacity: concluido ? 0.6 : 1,
              cursor: concluido ? "not-allowed" : "pointer"
            }}
          >
            {concluido
              ? "Tarefa Concluída ✔"
              : loadingConclusao
              ? "Salvando..."
              : "Marcar como Concluído"}
          </button>

          {mensagem && (
            <p style={{ marginTop: "15px", fontWeight: "bold" }}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
