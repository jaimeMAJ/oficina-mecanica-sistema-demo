// src/validations/agendamento.schema.ts

import { z } from "zod"

export const agendamentoSchema = z.object({
  clienteId: z.string().uuid("Selecione um cliente"),
  veiculoId: z.string().uuid("Selecione um veículo"),
  dataHora: z.string().min(1, "Data e hora são obrigatórias"),
})

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>