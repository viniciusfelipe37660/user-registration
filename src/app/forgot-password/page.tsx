import Link from "next/link"
import { ForgotPasswordForm } from "./_components/forgot-password-form"

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Esqueceu a senha?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <Link href="/" className="font-medium text-primary hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}