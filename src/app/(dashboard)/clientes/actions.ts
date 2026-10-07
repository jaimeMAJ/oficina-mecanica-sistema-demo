// src/app/(dashboard)/clientes/actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { clienteSchema } from "@/validations/cliente.schema"
import { criarCliente, atualizarCliente, excluirCliente } from "@/services/cliente.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function criarClienteAction(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = clienteSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    documento: formData.get("documento"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  await criarCliente(resultado.data)
  revalidatePath("/clientes")
  redirect("/clientes")
}

export async function atualizarClienteAction(
  id: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = clienteSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    documento: formData.get("documento"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  await atualizarCliente(id, resultado.data)
  revalidatePath("/clientes")
  redirect("/clientes")
}

export async function excluirClienteAction(id: string) {
  await excluirCliente(id)
  revalidatePath("/clientes")
}