export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email é obrigatório' });
        }

        // Aqui você implementaria envio de email real
        // Por enquanto, apenas retornamos mensagem genérica por segurança
        return res.status(200).json({
            message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
        });
    } catch (error) {
        console.error('[FORGOT-PASSWORD] Erro:', error);
        return res.status(500).json({ success: false, message: 'Erro ao processar solicitação' });
    }
}
