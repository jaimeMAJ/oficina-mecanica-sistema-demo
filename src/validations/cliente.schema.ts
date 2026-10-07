// src/validations/cliente.schema.ts

import { z } from "zod"

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "")
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== parseInt(cpf[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== parseInt(cpf[10])) return false

  return true
}

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "")
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false

  const calcularDigito = (base: string, pesos: number[]) => {
    const soma = base
      .split("")
      .reduce((acc, num, i) => acc + parseInt(num) * pesos[i], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const digito1 = calcularDigito(cnpj.slice(0, 12), pesos1)
  if (digito1 !== parseInt(cnpj[12])) return false

  const digito2 = calcularDigito(cnpj.slice(0, 13), pesos2)
  if (digito2 !== parseInt(cnpj[13])) return false

  return true
}

export const clienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  documento: z
    .string()
    .optional()
    .refine(
      (valor) => {
        if (!valor) return true
        const numeros = valor.replace(/\D/g, "")
        if (numeros.length === 11) return validarCPF(numeros)
        if (numeros.length === 14) return validarCNPJ(numeros)
        return false
      },
      { message: "CPF ou CNPJ inválido" }
    ),
})

export type ClienteFormData = z.infer<typeof clienteSchema>