import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { PerfilUsuario } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "oficina-mecanica-secret-key-32-chars-long-auth",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase()
        const password = String(credentials?.password || "")
        if (!email || !password) return null

        const usuario = await prisma.usuario.findUnique({
          where: { email },
        })

        if (!usuario || !usuario.ativo) return null

        const senhaValida = await bcrypt.compare(
          password,
          usuario.senhaHash
        )

        if (!senhaValida) return null

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
        }
      },
    }),
  ],
  callbacks: {
    redirect({ url }) {
      if (url.startsWith("/")) return url
      try {
        const parsed = new URL(url)
        if (parsed.hostname === "0.0.0.0" || parsed.hostname === "localhost") {
          return parsed.pathname + parsed.search
        }
      } catch {}
      return url
    },
    authorized({ auth, request }) {
      const logado = !!auth?.user
      const naPaginaLogin = request.nextUrl.pathname.startsWith("/login")
      if (naPaginaLogin) return true
      return logado
    },
    async jwt({ token, user }) {
      if (user) {
        token.perfil = (user as any).perfil
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.perfil = token.perfil as PerfilUsuario
      }
      return session
    },
  },
})
