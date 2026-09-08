import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import { sendResetPasswordEmail, sendVerificationEmail } from "./email"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // Impede login sem confirmar o email antes.
    requireEmailVerification: true,
    // Não loga automaticamente no cadastro, já que o email ainda não foi confirmado.
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        url,
      })
    },
  },
  emailVerification: {
    // Envia o email de confirmação automaticamente assim que o usuário se cadastra.
    sendOnSignUp: true,
    // Depois de clicar no link e confirmar, já cria a sessão (loga automaticamente).
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        url,
      })
    },
  },
})