"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export type EstadoLogin = {
  erro?: string
} | null

export async function loginServerAction(
  prevState: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { erro: "Informe o e-mail e a senha." }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/agenda",
    })
    return null
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { erro: "E-mail ou senha incorretos." }
        default:
          return { erro: "Erro ao autenticar. Tente novamente." }
      }
    }
    return { erro: "Falha ao autenticar. Verifique seus dados e tente novamente." }
  }
}
