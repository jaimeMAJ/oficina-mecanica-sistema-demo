import { z } from "zod"

export const veiculoSchema = z.object({
  clienteId: z.string().uuid("Cliente inválido"),
  placa: z
    .string()
    .min(7, "Placa inválida")
    .max(8, "Placa inválida")
    .transform((v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "")),
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
  kmAtual: z.coerce.number().int().min(0).optional(),
})

export type VeiculoFormData = z.infer<typeof veiculoSchema>