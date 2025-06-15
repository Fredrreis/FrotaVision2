import type { NextApiRequest, NextApiResponse } from 'next';
import { verificarCodigoRecuperacao } from '@/utils/codigos-recuperacao';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, codigo } = req.body;
  if (!email || !codigo) {
    return res.status(400).json({ error: 'E-mail e código são obrigatórios' });
  }

  const valido = verificarCodigoRecuperacao(email, codigo);
  if (valido) {
    return res.status(200).json({ message: 'Código válido' });
  } else {
    return res.status(400).json({ error: 'Código inválido ou expirado' });
  }
} 