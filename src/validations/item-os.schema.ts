// src/validations/item-os.schema.ts

import { z } from "zod"

export const itemOSSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("PECA"),
    pecaId: z.string().uuid("Selecione uma peça"),
    quantidade: z.coerce.number().int().min(1, "Quantidade mínima é 1"),
    valorUnitario: z.coerce.number().min(0, "Valor não pode ser negativo"),
  }),
  z.object({
    tipo: z.literal("MAO_DE_OBRA"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    quantidade: z.coerce.number().int().min(1, "Quantidade mínima é 1"),
    valorUnitario: z.coerce.number().min(0, "Valor não pode ser negativo"),
  }),
])

export type ItemOSFormData = z.infer<typeof itemOSSchema>