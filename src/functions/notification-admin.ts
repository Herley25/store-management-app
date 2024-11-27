import nodemailer from 'nodemailer'

export const sendAdminNotification = async (
  subject: string,
  message: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Administrador email
      pass: process.env.PASSWORD, // Admin password
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL, // Email do administrador
    to: process.env.EMAIL, // Enviar notificação para o email do administrador
    subject: subject, // Assunto da notificação
    text: message, // Mensagem da notificação
  })
}
