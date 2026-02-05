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

            // STRICT MODE: No Fallback
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha }),
                    // Timeout aumentado para garantir conexão com banco remoto
                    timeout: 10000
                });

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error("Resposta não-JSON do servidor (Login):", text.substring(0, 200));
                    throw new Error("O servidor retornou HTML em vez de JSON. Verifique se a API está rodando corretamente.");
                }

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setUser(data.user);
                    console.log('[v0] Login bem-sucedido via API');
                    return { success: true };
                } else {
                    return { success: false, error: data.message || 'Erro ao fazer login (Servidor)' };
                }
            } catch (apiError) {
                console.log('[v0] Erro na API:', apiError.message);
                return { success: false, error: 'Erro de conexão com o servidor: ' + apiError.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (nome, email, senha) => {
        try {
            console.log('[v0] Tentando registrar:', email);

            // STRICT MODE: No Fallback
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha }),
                    timeout: 10000
                });

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error("Resposta não-JSON do servidor:", text.substring(0, 200)); // Logar início do HTML para debug
                    throw new Error("O servidor retornou HTML em vez de JSON. Verifique se a API está rodando corretamente.");
                }

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setUser(data.user);
                    console.log('[v0] Registro bem-sucedido via API');
                    return { success: true };
                } else {
                    return { success: false, error: data.message || 'Erro ao registrar (Servidor)' };
                }
            } catch (apiError) {
                console.log('[v0] Erro na API:', apiError.message);
                return { success: false, error: 'Erro de conexão com o servidor: ' + apiError.message };
            }
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
