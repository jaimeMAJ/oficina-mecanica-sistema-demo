import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const logado = !!req.auth?.user
  const pathname = req.nextUrl.pathname
  const naPaginaLogin = pathname.startsWith("/login")

  if (!logado && !naPaginaLogin) {
    const proto = req.headers.get("x-forwarded-proto") || "https"
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || ""
    const base = host && !host.includes("0.0.0.0") ? `${proto}://${host}` : req.url
    const loginUrl = new URL("/login", base)
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  if (logado && naPaginaLogin) {
    const proto = req.headers.get("x-forwarded-proto") || "https"
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || ""
    const base = host && !host.includes("0.0.0.0") ? `${proto}://${host}` : req.url
    return NextResponse.redirect(new URL("/agenda", base))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
