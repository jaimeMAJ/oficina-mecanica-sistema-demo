// src/app/(dashboard)/financeiro/gastos/actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { gastoSchema } from "@/validations/gasto.schema"
import { criarGasto, atualizarGasto, excluirGasto } from "@/services/gasto.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function criarGastoAction(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = gastoSchema.safeParse({
    categoria: formData.get("categoria"),
    descricao: formData.get("descricao"),
    valor: formData.get("valor"),
    data: formData.get("data"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  await criarGasto(resultado.data)
  revalidatePath("/financeiro/gastos")
  redirect("/financeiro/gastos")
}

export async function atualizarGastoAction(
  id: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = gastoSchema.safeParse({
    categoria: formData.get("categoria"),
    descricao: formData.get("descricao"),
    valor: formData.get("valor"),
    data: formData.get("data"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  await atualizarGasto(id, resultado.data)
  revalidatePath("/financeiro/gastos")
  redirect("/financeiro/gastos")
}

export async function excluirGastoAction(id: string) {
  await excluirGasto(id)
  revalidatePath("/financeiro/gastos")
}