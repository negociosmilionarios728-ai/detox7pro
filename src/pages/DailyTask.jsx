import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Dumbbell } from 'lucide-react';
import './Login.css';

function Login() {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.senha);
            } else {
                if (!formData.nome) {
                    setError('Por favor, preencha seu nome');
                    setLoading(false);
                    return;
                }
                result = await register(formData.nome, formData.email, formData.senha);
            }

            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Erro ao processar sua solicitação');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Por favor, digite seu email primeiro');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await response.json();
            alert(data.message || 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.');
            setShowForgotPassword(false);
        } catch (err) {
            setError('Erro ao processar solicitação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card card card-glass fade-in">
                <div className="login-header">
                    <div className="logo">
                        <span className="logo-icon">
                            <Leaf size={40} color="var(--primary-green)" />
                        </span>
                        <h1>DETOX 7PRO</h1>
                    </div>
                    <p className="tagline">Transforme sua saúde em 30 dias</p>
                </div>

                {showForgotPassword ? (
                    <div className="forgot-password-form">
                        <h2>Recuperar Senha</h2>
                        <p className="text-muted mb-3">
                            Digite seu email para receber instruções de recuperação
                        </p>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button
                            className="btn btn-primary"
                            onClick={handleForgotPassword}
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Instruções'}
                        </button>
                        <button
                            className="btn btn-ghost mt-2"
                            onClick={() => {
                                setShowForgotPassword(false);
                                setError('');
                            }}
                        >
                            Voltar ao Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-toggle">
                            <button
                                type="button"
                                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(true);
                                    setError('');
                                }}
                            >
                                Entrar
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(false);
                                    setError('');
                                }}
                            >
                                Criar Conta
                            </button>
                        </div>

                        {!isLogin && (
                            <div className="input-group">
                                <label htmlFor="nome">Nome Completo</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Seu nome"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                id="senha"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength="6"
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                        </button>

                        {isLogin && (
                            <button
                                type="button"
                                className="btn btn-ghost mt-2"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Esqueci minha senha
                            </button>
                        )}
                    </form>
                )}

                <div className="login-footer">
                    <p className="motivation-text">
                        <Dumbbell size={16} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'text-bottom' }} />
                        Seu corpo merece o melhor. Comece hoje!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
