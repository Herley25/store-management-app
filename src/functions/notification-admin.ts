import nodemailer from 'nodemailer'

export const sendAdminNotification = async (
  subject = 'Notificação do sistema',
  message = 'Mensagem não especificada.'
) => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_EMAIL_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.error('Variáveis de ambiente para o e-mail do admin não definidas.')
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  })

  try {
    await transporter.sendMail({
      from: adminEmail,
      to: adminEmail,
      subject,
      text: message,
    })
    console.log(`Notificação enviada para o administrador: ${subject}`)
  } catch (error) {
    console.error('Erro ao enviar notificação por e-mail:', error)
  }
}
