// src/app/(dashboard)/agenda/actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { agendamentoSchema } from "@/validations/agendamento.schema"
import {
  criarAgendamento,
  atualizarStatusAgendamento,
  excluirAgendamento,
} from "@/services/agendamento.service"
import { redirect } from "next/navigation"
import { criarOrdemServicoAPartirDeAgendamento } from "@/services/ordem-servico.service"

export async function iniciarAtendimentoAction(agendamentoId: string) {
  const os = await criarOrdemServicoAPartirDeAgendamento(agendamentoId)
  revalidatePath("/agenda")
  redirect(`/ordens-servico/${os.id}`)
}
export type EstadoFormulario = {
  erro?: string
} | null

export async function criarAgendamentoAction(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = agendamentoSchema.safeParse({
    clienteId: formData.get("clienteId"),
    veiculoId: formData.get("veiculoId"),
    dataHora: formData.get("dataHora"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  await criarAgendamento(resultado.data)
  revalidatePath("/agenda")
  redirect("/agenda")
}

export async function confirmarAgendamentoAction(id: string) {
  await atualizarStatusAgendamento(id, "CONFIRMADO")
  revalidatePath("/agenda")
}

export async function cancelarAgendamentoAction(id: string) {
  await atualizarStatusAgendamento(id, "CANCELADO")
  revalidatePath("/agenda")
}

export async function excluirAgendamentoAction(id: string) {
  await excluirAgendamento(id)
  revalidatePath("/agenda")
}