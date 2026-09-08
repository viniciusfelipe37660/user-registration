import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  // rotas que exigem login
  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // opcional: se já está logado, não deixa ver login/signup de novo
  const authRoutes = ["/", "/signup"]
  if (authRoutes.includes(request.nextUrl.pathname) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/signup"],
}