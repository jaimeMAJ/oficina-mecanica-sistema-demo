import { PerfilUsuario } from "@prisma/client"

declare module "next-auth" {
  interface User {
    perfil: PerfilUsuario
  }
  interface Session {
    user: {
      id: string
      name: string
      email: string
      perfil: PerfilUsuario
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    perfil: PerfilUsuario
  }
}