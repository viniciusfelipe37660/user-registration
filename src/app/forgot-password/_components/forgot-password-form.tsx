"use client"

import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(formData: ForgotPasswordFormValues) {
    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await authClient.requestPasswordReset({
      email: formData.email,
      redirectTo: "/reset-password",
    })

    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message ?? "Não foi possível enviar o email")
      return
    }

    // Sempre mostramos sucesso, mesmo que o email não exista no banco.
    // Isso evita que alguém descubra quais emails estão cadastrados (enumeração de usuários).
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200 text-center">
        Se esse email estiver cadastrado, você receberá um link de redefinição em instantes.
        Confira também a caixa de spam.
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" type="email" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errorMessage}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link de redefinição"
          )}
        </Button>
      </form>
    </Form>
  )
}