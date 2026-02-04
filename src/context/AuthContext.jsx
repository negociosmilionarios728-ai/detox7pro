import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Verificar token ao carregar
    useEffect(() => {
        const verifyToken = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                // Se tem usuário salvo, use-o
                if (savedUser) {
                    try {
                        const userData = JSON.parse(savedUser);
                        setUser(userData);
                        setToken(savedToken);
                    } catch (parseError) {
                        console.log('[v0] Erro ao parsear usuário salvo:', parseError.message);
                        setLoading(false);
                        return;
                    }
                } else {
                    // Se não tem usuário mas tem token, limpar ambos
                    localStorage.removeItem('token');
                    setToken(null);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Erro ao verificar token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (email, senha) => {
        try {
            console.log('[v0] Tentando login com email:', email);
            
            // Tentar primeiro com o endpoint real (para Vercel)
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha }),
                    timeout: 3000
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        localStorage.setItem('token', data.token);
                        setToken(data.token);
                        setUser(data.user);
                        console.log('[v0] Login bem-sucedido via API');
                        return { success: true };
                    }
                }
            } catch (apiError) {
                console.log('[v0] API indisponível, usando mock para teste no preview:', apiError.message);
            }

            // Fallback: usar mock para teste no preview do v0
            const users = JSON.parse(localStorage.getItem('detox_users') || '[]');
            const userData = users.find(u => u.email === email);

            if (!userData) {
                return { success: false, error: 'Email ou senha incorretos' };
            }

            // Verificar senha (simples para teste)
            if (userData.senha !== senha) {
                return { success: false, error: 'Email ou senha incorretos' };
            }

            const mockToken = 'mock_token_' + Date.now();
            const userObj = { id: userData.id, nome: userData.nome, email: userData.email };
            
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(userObj));
            setToken(mockToken);
            setUser(userObj);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (nome, email, senha) => {
        try {
            console.log('[v0] Tentando registrar:', email);
            
            // Tentar primeiro com o endpoint real (para Vercel)
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha }),
                    timeout: 3000
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        localStorage.setItem('token', data.token);
                        setToken(data.token);
                        setUser(data.user);
                        console.log('[v0] Registro bem-sucedido via API');
                        return { success: true };
                    }
                }
            } catch (apiError) {
                console.log('[v0] API indisponível, usando mock para teste no preview:', apiError.message);
            }

            // Fallback: usar mock para teste no preview do v0
            const users = JSON.parse(localStorage.getItem('detox_users') || '[]');

            if (users.find(u => u.email === email)) {
                return { success: false, error: 'Email já cadastrado' };
            }

            if (senha.length < 6) {
                return { success: false, error: 'Senha deve ter no mínimo 6 caracteres' };
            }

            const newUser = {
                id: Date.now(),
                nome,
                email,
                senha
            };

            users.push(newUser);
            localStorage.setItem('detox_users', JSON.stringify(users));

            const mockToken = 'mock_token_' + Date.now();
            const userObj = { id: newUser.id, nome: newUser.nome, email: newUser.email };
            
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(userObj));
            setToken(mockToken);
            setUser(userObj);

            console.log('[v0] Registro bem-sucedido via mock');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
