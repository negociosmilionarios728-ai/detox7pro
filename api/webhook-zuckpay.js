import pool from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    console.log('[ZuckPay Webhook] Payload Recebido:', JSON.stringify(payload));

    // O ZuckPay costuma enviar dados da transação. 
    // Vamos tentar extrair o e-mail de várias formas possíveis.
    const email = payload?.email || 
                  payload?.data?.email || 
                  payload?.customer?.email || 
                  payload?.client?.email || 
                  payload?.buyer?.email;

    const status = payload?.status || payload?.data?.status;

    if (!email) {
      console.error('[ZuckPay Webhook] Email não encontrado no corpo da requisição');
      // Retornar 200 mesmo em erro estrutural garante que a plataforma não fique retentando para sempre,
      // mas no caso de webhook malformado, podemos dar 400.
      return res.status(400).json({ error: 'Email ausente no payload' });
    }

    // Filtro básico de status: verificar se foi pago/aprovado.
    const successStatuses = ['paid', 'approved', 'completed', 'sucesso', 'pago', 'approved_payment'];
    if (status && !successStatuses.includes(String(status).toLowerCase())) {
        console.log(`[ZuckPay Webhook] Ignorando status não finalizado: ${status}`);
        return res.status(200).json({ message: 'Webhook ignorado: não é evento de compra aprovada.' });
    }

    // Atualiza o usuário no banco de dados para liberar a Analise de Calorias
    const result = await pool.query(
      'UPDATE users SET has_paid_calories = TRUE WHERE email = $1 RETURNING id',
      [email.toLowerCase().trim()]
    );

    if (result.rowCount > 0) {
      console.log(`[ZuckPay Webhook] SUCESSO! Acesso à Análise de Calorias liberado para: ${email}`);
    } else {
      console.log(`[ZuckPay Webhook] AVISO: Usuário com ${email} não encontrado no banco de dados.`);
    }

    return res.status(200).json({ message: 'Webhook processado com sucesso' });
  } catch (error) {
    console.error('[ZuckPay Webhook] Erro Crítico:', error);
    return res.status(500).json({ error: 'Erro interno ao processar webhook' });
  }
}
