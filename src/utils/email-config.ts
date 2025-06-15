import nodemailer from 'nodemailer';

// Configuração do transporter do Nodemailer
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // e-mail da empresa
    pass: process.env.EMAIL_PASSWORD, // senha do e-mail
  },
});

// Função para gerar um código aleatório de 6 dígitos
export const gerarCodigoRecuperacao = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Função para enviar o e-mail de recuperação
export const enviarEmailRecuperacao = async (email: string, codigo: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha - FrotaVision',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1B3562;">Recuperação de Senha</h2>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para recuperar sua senha no FrotaVision.</p>
        <p>Seu código de recuperação é:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #1B3562; margin: 20px 0;">
          ${codigo}
        </div>
        <p>Este código é válido por 15 minutos.</p>
        <p>Se você não solicitou a recuperação de senha, por favor ignore este e-mail.</p>
        <p>Atenciosamente,<br>Equipe FrotaVision</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
}; 