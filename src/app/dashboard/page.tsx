import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ButtonSignOut } from "./_components/button-signout"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold mb-2">Página dashboard</h1>
      <h3>Usuário logado: {session.user.name}</h3>
      <p className="text-sm text-muted-foreground">{session.user.email}</p>
      <ButtonSignOut />
    </div>
  )
}