// src/validations/pagamento.schema.ts

import { z } from "zod"

export const formasPagamento = [
  "DINHEIRO",
  "PIX",
  "CARTAO_DEBITO",
  "CARTAO_CREDITO",
  "TRANSFERENCIA",
] as const

export const formaPagamentoLabel: Record<(typeof formasPagamento)[number], string> = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO_DEBITO: "Cartão de Débito",
  CARTAO_CREDITO: "Cartão de Crédito",
  TRANSFERENCIA: "Transferência",
}

export const pagamentoSchema = z.object({
  valor: z.coerce.number().positive("Valor deve ser maior que zero"),
  formaPagamento: z.enum(formasPagamento),
})

export type PagamentoFormData = z.infer<typeof pagamentoSchema>