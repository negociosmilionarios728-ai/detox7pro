import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyTask from './pages/DailyTask';
import Recipes from './pages/Recipes';
import Progress from './pages/Progress';
import Ebook from './pages/Ebook';
import CalorieAnalysis from './pages/CalorieAnalysis';
import ServerStatus from './components/ServerStatus';

// =======================
// ROTAS PROTEGIDAS
// =======================
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

// =======================
// ROTAS PÚBLICAS
// =======================
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Carregando...</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}

// =======================
// APP
// =======================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tarefa/:dia"
            element={
              <ProtectedRoute>
                <DailyTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receitas"
            element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progresso"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ebook"
            element={
              <ProtectedRoute>
                <Ebook />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analise-calorias"
            element={
              <ProtectedRoute>
                <CalorieAnalysis />
              </ProtectedRoute>
            }
          />

          {/* Root inteligente */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ServerStatus />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
