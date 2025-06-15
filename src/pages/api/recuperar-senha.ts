import type { NextApiRequest, NextApiResponse } from 'next';
import { gerarCodigoRecuperacao, enviarEmailRecuperacao } from '@/utils/email-config';
import { adicionarCodigoRecuperacao } from '@/utils/codigos-recuperacao';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório' });
  }

  const codigo = gerarCodigoRecuperacao();
  const enviado = await enviarEmailRecuperacao(email, codigo);

  if (enviado) {
    adicionarCodigoRecuperacao(email, codigo);
    return res.status(200).json({ message: 'Código enviado com sucesso' });
  } else {
    return res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
} 