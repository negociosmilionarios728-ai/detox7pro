import { useState, useEffect } from 'react';
import { getPasswords, deletePassword } from '../lib/db';
import { Trash2, Copy, RefreshCw } from 'lucide-react';

export default function SavedPasswords() {
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetchPasswords();
    }, []);

    const fetchPasswords = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPasswords();
            setPasswords(data);
        } catch (err) {
            setError(err.message);
            console.error('[v0] Erro ao buscar senhas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta senha?')) {
            try {
                await deletePassword(id);
                setPasswords(passwords.filter(p => p.id !== id));
            } catch (err) {
                setError(err.message);
                console.error('[v0] Erro ao deletar senha:', err);
            }
        }
    };

    const handleCopy = (password, id) => {
        navigator.clipboard.writeText(password);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin">
                    <RefreshCw className="w-6 h-6" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Senhas Salvas</h2>
                <button
                    onClick={fetchPasswords}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Atualizar lista"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                    Erro: {error}
                </div>
            )}

            {passwords.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">
                        Nenhuma senha salva ainda.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Gere uma senha e clique em "Salvar" para começar.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {passwords.map((pwd) => (
                        <div
                            key={pwd.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm break-all">
                                        {pwd.password_text}
                                    </code>
                                    <button
                                        onClick={() => handleCopy(pwd.password_text, pwd.id)}
                                        className={`p-1.5 rounded transition-colors ${
                                            copiedId === pwd.id
                                                ? 'bg-green-100 text-green-700'
                                                : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                        title="Copiar"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-3 text-xs text-gray-500">
                                    {pwd.category && (
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                            {pwd.category}
                                        </span>
                                    )}
                                    <span>Comprimento: {pwd.length}</span>
                                    <span>
                                        {new Date(pwd.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(pwd.id)}
                                className="ml-4 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                title="Deletar"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
