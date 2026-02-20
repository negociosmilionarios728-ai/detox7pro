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
                result = await register(
                    formData.nome,
                    formData.email,
                    formData.senha
                );
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

            alert(
                data.message ||
                'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
            );

            setShowForgotPassword(false);

        } catch (err) {
            setError('Erro ao processar solicitação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <div className="login-logo">
                    <Leaf size={36} />
                    <span>DETOX 7PRO</span>
                </div>

                <p className="login-subtitle">
                    Transforme sua saúde em 30 dias
                </p>

                {showForgotPassword ? (

                    <>
                        <h3>Recuperar Senha</h3>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button
                            className="login-button"
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
                    </>

                ) : (

                    <form onSubmit={handleSubmit}>

                        <div className="login-tabs">
                            <button
                                type="button"
                                className={`login-tab ${isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(true);
                                    setError('');
                                }}
                            >
                                Entrar
                            </button>

                            <button
                                type="button"
                                className={`login-tab ${!isLogin ? 'active' : ''}`}
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
                                <label>Nome Completo</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Seu nome"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input
                                type="password"
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
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? 'Processando...'
                                : isLogin
                                    ? 'Entrar'
                                    : 'Criar Conta'}
                        </button>

                        {isLogin && (
                            <div
                                className="forgot-password"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Esqueci minha senha
                            </div>
                        )}
                    </form>

                )}

                <div className="login-footer">
                    <Dumbbell size={16} style={{ marginRight: 6 }} />
                    Seu corpo merece o melhor. Comece hoje!
                </div>

            </div>
        </div>
    );
}

export default Login;