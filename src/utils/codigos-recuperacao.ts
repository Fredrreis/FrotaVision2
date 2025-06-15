interface CodigoRecuperacao {
  codigo: string;
  email: string;
  expiracao: Date;
}

// Armazena os códigos de recuperação em memória
const codigosRecuperacao: Map<string, CodigoRecuperacao> = new Map();

// Função para adicionar um novo código de recuperação
export const adicionarCodigoRecuperacao = (email: string, codigo: string) => {
  // Define a expiração para 15 minutos a partir de agora
  const expiracao = new Date();
  expiracao.setMinutes(expiracao.getMinutes() + 15);

  codigosRecuperacao.set(email, {
    codigo,
    email,
    expiracao,
  });
};

// Função para verificar se um código é válido
export const verificarCodigoRecuperacao = (email: string, codigo: string): boolean => {
  const codigoRecuperacao = codigosRecuperacao.get(email);

  if (!codigoRecuperacao) {
    return false;
  }

  // Verifica se o código expirou
  if (new Date() > codigoRecuperacao.expiracao) {
    codigosRecuperacao.delete(email);
    return false;
  }

  // Verifica se o código está correto
  if (codigoRecuperacao.codigo !== codigo) {
    return false;
  }

  return true;
};

// Função para remover um código de recuperação após o uso
export const removerCodigoRecuperacao = (email: string) => {
  codigosRecuperacao.delete(email);
}; 