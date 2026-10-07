// src/app/(dashboard)/ordens-servico/pagamentos-actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { pagamentoSchema } from "@/validations/pagamento.schema"
import { registrarPagamento, excluirPagamento } from "@/services/ordem-servico.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function registrarPagamentoAction(
  ordemServicoId: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = pagamentoSchema.safeParse({
    valor: formData.get("valor"),
    formaPagamento: formData.get("formaPagamento"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  await registrarPagamento(ordemServicoId, resultado.data)
  revalidatePath(`/ordens-servico/${ordemServicoId}`)
  return null
}

export async function excluirPagamentoAction(pagamentoId: string, ordemServicoId: string) {
  await excluirPagamento(pagamentoId)
  revalidatePath(`/ordens-servico/${ordemServicoId}`)
}