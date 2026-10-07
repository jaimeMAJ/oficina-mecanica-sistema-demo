// src/app/(dashboard)/estoque/actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { pecaSchema } from "@/validations/peca.schema"
import { criarPeca, atualizarPeca, excluirPeca } from "@/services/peca.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function criarPecaAction(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = pecaSchema.safeParse({
    nome: formData.get("nome"),
    sku: formData.get("sku"),
    quantidadeEstoque: formData.get("quantidadeEstoque"),
    quantidadeMinima: formData.get("quantidadeMinima"),
    valorCusto: formData.get("valorCusto"),
    valorVenda: formData.get("valorVenda"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  try {
    await criarPeca(resultado.data)
  } catch (e: any) {
    if (e.code === "P2002") {
      return { erro: "Já existe uma peça cadastrada com esse SKU" }
    }
    return { erro: "Erro ao salvar peça" }
  }

  revalidatePath("/estoque")
  redirect("/estoque")
}

export async function atualizarPecaAction(
  id: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = pecaSchema.safeParse({
    nome: formData.get("nome"),
    sku: formData.get("sku"),
    quantidadeEstoque: formData.get("quantidadeEstoque"),
    quantidadeMinima: formData.get("quantidadeMinima"),
    valorCusto: formData.get("valorCusto"),
    valorVenda: formData.get("valorVenda"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  try {
    await atualizarPeca(id, resultado.data)
  } catch (e: any) {
    if (e.code === "P2002") {
      return { erro: "Já existe uma peça cadastrada com esse SKU" }
    }
    return { erro: "Erro ao salvar peça" }
  }

  revalidatePath("/estoque")
  redirect("/estoque")
}

export async function excluirPecaAction(id: string) {
  await excluirPeca(id)
  revalidatePath("/estoque")
}