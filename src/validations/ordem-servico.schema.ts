// src/validations/ordem-servico.schema.ts

import { z } from "zod"

export const statusOSValues = [
  "AGUARDANDO",
  "EM_EXECUCAO",
  "CONCLUIDO",
  "ENTREGUE",
  "CANCELADO",
] as const

export const ordemServicoSchema = z.object({
  veiculoId: z.string().uuid("Veículo inválido"),
  funcionarioId: z.string().uuid().optional().or(z.literal("")),
  dataEntregaPrevista: z.string().optional().or(z.literal("")),
  descricaoProblema: z.string().optional(),
})

export const statusSchema = z.object({
  status: z.enum(statusOSValues),
})

export type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>