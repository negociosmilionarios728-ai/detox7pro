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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;

            if (isLogin) {
                result = await login(formData.email, formData.senha);
            } else {
                result = await register(
                    formData.nome,
                    formData.email,
                    formData.senha
                );
            }

            if (!result.success) {
                setError(result.error);
            }
        } catch {
            setError('Erro ao processar solicitação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-box">

                <div className="login-top">
                    <Leaf size={34} />
                    <h1>DETOX 7PRO</h1>
                </div>

                <p className="login-subtitle">
                    Transforme sua saúde em 30 dias
                </p>

                <div className="login-tabs">
                    <button
                        type="button"
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        Criar Conta
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Seu nome"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
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

                    <div className="form-group">
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

                    {error && <p className="error-text">{error}</p>}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
                    </button>

                    {isLogin && (
                        <div className="forgot-link">
                            Esqueci minha senha
                        </div>
                    )}
                </form>

                <div className="login-bottom">
                    <Dumbbell size={16} />
                    <span>Seu corpo merece o melhor. Comece hoje!</span>
                </div>

            </div>
        </div>
    );
}

export default Login;