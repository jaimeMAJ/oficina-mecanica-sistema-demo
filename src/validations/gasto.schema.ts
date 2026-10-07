// src/validations/gasto.schema.ts

import { z } from "zod"

export const categoriasGasto = [
  "PECAS_FORA_DE_OS",
  "ALUGUEL",
  "SALARIOS",
  "IMPOSTOS",
  "MANUTENCAO_OFICINA",
  "ENERGIA_AGUA",
  "OUTROS",
] as const

export const categoriaLabel: Record<(typeof categoriasGasto)[number], string> = {
  PECAS_FORA_DE_OS: "Peças (fora de OS)",
  ALUGUEL: "Aluguel",
  SALARIOS: "Salários",
  IMPOSTOS: "Impostos",
  MANUTENCAO_OFICINA: "Manutenção da oficina",
  ENERGIA_AGUA: "Energia/Água",
  OUTROS: "Outros",
}

export const gastoSchema = z.object({
  categoria: z.enum(categoriasGasto),
  descricao: z.string().optional(),
  valor: z.coerce.number().positive("Valor deve ser maior que zero"),
  data: z.string().min(1, "Data é obrigatória"),
})

export type GastoFormData = z.infer<typeof gastoSchema>