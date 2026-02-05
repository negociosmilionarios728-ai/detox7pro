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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tarefa/:dia" element={<ProtectedRoute><DailyTask /></ProtectedRoute>} />
          <Route path="/receitas" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
          <Route path="/progresso" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/ebook" element={<ProtectedRoute><Ebook /></ProtectedRoute>} />
          <Route path="/analise-calorias" element={<ProtectedRoute><CalorieAnalysis /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <ServerStatus />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
