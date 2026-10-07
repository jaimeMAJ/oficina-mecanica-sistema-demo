import { z } from "zod"

export const pecaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().optional(),
  quantidadeEstoque: z.coerce.number().int().min(0, "Quantidade não pode ser negativa"),
  quantidadeMinima: z.coerce.number().int().min(0, "Quantidade mínima não pode ser negativa"),
  valorCusto: z.coerce.number().min(0, "Valor de custo não pode ser negativo"),
  valorVenda: z.coerce.number().min(0, "Valor de venda não pode ser negativo"),
}).refine((dados) => dados.valorVenda >= dados.valorCusto, {
  message: "Valor de venda não pode ser menor que o valor de custo",
  path: ["valorVenda"],
})

export type PecaFormData = z.infer<typeof pecaSchema>