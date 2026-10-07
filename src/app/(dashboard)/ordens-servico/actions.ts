// src/app/(dashboard)/ordens-servico/actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ordemServicoSchema, statusOSValues } from "@/validations/ordem-servico.schema"
import {
  criarOrdemServico,
  atualizarStatusOrdemServico,
  excluirOrdemServico,
} from "@/services/ordem-servico.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function criarOrdemServicoAction(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = ordemServicoSchema.safeParse({
    veiculoId: formData.get("veiculoId"),
    funcionarioId: formData.get("funcionarioId"),
    dataEntregaPrevista: formData.get("dataEntregaPrevista"),
    descricaoProblema: formData.get("descricaoProblema"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  const os = await criarOrdemServico(resultado.data)
  revalidatePath("/ordens-servico")
  redirect(`/ordens-servico/${os.id}`)
}

export async function atualizarStatusAction(id: string, formData: FormData) {
  
  const novoStatus = formData.get("status")
  const resultado = statusOSValues.find((s) => s === novoStatus)

  if (!resultado) return

  await atualizarStatusOrdemServico(id, resultado)
  revalidatePath(`/ordens-servico/${id}`)
  revalidatePath("/ordens-servico")
}

export async function excluirOrdemServicoAction(id: string) {
  await excluirOrdemServico(id)
  revalidatePath("/ordens-servico")
  redirect("/ordens-servico")
}
