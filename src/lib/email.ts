import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string
  url: string
}) {
  await transporter.sendMail({
    from: `"Sua App" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Redefinição de senha",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Redefinir senha
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Se você não solicitou isso, pode ignorar este email com segurança. Este link expira em 1 hora.</p>
      </div>
    `,
  })
}

export async function sendVerificationEmail({
  to,
  url,
}: {
  to: string
  url: string
}) {
  await transporter.sendMail({
    from: `"Sua App" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Confirme seu email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Confirme seu email</h2>
        <p>Obrigado por se cadastrar! Clique no botão abaixo para confirmar seu email e ativar sua conta:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Confirmar email
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Se você não criou uma conta, pode ignorar este email com segurança.</p>
      </div>
    `,
  })
}