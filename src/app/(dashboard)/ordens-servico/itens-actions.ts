// src/app/(dashboard)/ordens-servico/itens-actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { itemOSSchema } from "@/validations/item-os.schema"
import { adicionarItemOS, removerItemOS } from "@/services/ordem-servico.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function adicionarItemAction(
  ordemServicoId: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const tipo = formData.get("tipo")

  const dadosBrutos =
    tipo === "PECA"
      ? {
          tipo: "PECA" as const,
          pecaId: formData.get("pecaId"),
          quantidade: formData.get("quantidade"),
          valorUnitario: formData.get("valorUnitario"),
        }
      : {
          tipo: "MAO_DE_OBRA" as const,
          descricao: formData.get("descricao"),
          quantidade: formData.get("quantidade"),
          valorUnitario: formData.get("valorUnitario"),
        }

  const resultado = itemOSSchema.safeParse(dadosBrutos)

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  try {
    await adicionarItemOS(ordemServicoId, resultado.data)
  } catch (e: any) {
    return { erro: e.message || "Erro ao adicionar item" }
  }

  revalidatePath(`/ordens-servico/${ordemServicoId}`)
  return null
}

export async function removerItemAction(itemId: string, ordemServicoId: string) {
  await removerItemOS(itemId, ordemServicoId)
  revalidatePath(`/ordens-servico/${ordemServicoId}`)
}