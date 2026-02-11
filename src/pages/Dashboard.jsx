import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Leaf,
  LogOut,
  ClipboardList,
  Salad,
  Camera
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [progresso, setProgresso] = useState({
    dias_concluidos: [],
    dia_atual: 1,
    porcentagem_conclusao: 0
  });

  useEffect(() => {
    carregarProgresso();
  }, []);

  const carregarProgresso = async () => {
    try {
      const response = await fetch("/api/progress", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();

      setProgresso(data);
    } catch (error) {
      console.error("Erro ao carregar progresso", error);
    }
  };

  const dias = progresso.dias_concluidos?.length || 0;
  const porcentagem = progresso.porcentagem_conclusao || 0;
  const restantes = 30 - dias;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="logo">
          <Leaf size={22} />
          <span>DETOX 7PRO</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} /> Sair
        </button>
      </header>

      <main className="dashboard-content">
        <h1>Olá, {user?.nome?.split(" ")[0]}!</h1>
        <p className="subtitle">
          Você está mais forte do que imagina!
        </p>

        {/* CARD PROGRESSO */}
        <div className="progress-card">
          <div className="progress-top">
            <h2>Seu Progresso</h2>
            <span className="badge">Dia {progresso.dia_atual} de 30</span>
          </div>

          <div className="progress-stats">
            <div>
              <h3>{dias}</h3>
              <span>Dias Concluídos</span>
            </div>
            <div>
              <h3>{Math.round(porcentagem)}%</h3>
              <span>Completo</span>
            </div>
            <div>
              <h3>{restantes}</h3>
              <span>Dias Restantes</span>
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

        {/* CARDS ABAIXO */}
        <div className="cards-grid">
          <div
            className="action-card"
            onClick={() => navigate(`/tarefa/${progresso.dia_atual}`)}
          >
            <ClipboardList size={40} />
            <h3>Tarefa de Hoje</h3>
            <p>Veja sua tarefa diária</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/receitas")}
          >
            <Salad size={40} />
            <h3>Receitas</h3>
            <p>Explore receitas detox</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/analise-calorias")}
          >
            <Camera size={40} />
            <h3>Análise de Calorias</h3>
            <p>Analise seu prato</p>
          </div>
        </div>
      </main>
    </div>
  );
}
