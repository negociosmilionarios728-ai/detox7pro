import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // BOOTSTRAP DA SESSÃO
  // ==============================
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!savedToken) {
      localStorage.removeItem('user');
      setLoading(false);
      return;
    }

    try {
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      setToken(savedToken);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // HELPER: headers autenticados
  // ==============================
  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  // ==============================
  // LOGIN
  // ==============================
  const login = async (email, senha) => {
    try {
      logout();

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.message || 'Erro no login' };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ==============================
  // REGISTER
  // ==============================
  const register = async (nome, email, senha) => {
    try {
      logout();

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.message || 'Erro no cadastro' };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ==============================
  // LOGOUT TOTAL
  // ==============================
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        authHeaders,
        isAuthenticated: !!token,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
