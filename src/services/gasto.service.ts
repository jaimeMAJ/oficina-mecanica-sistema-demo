// src/services/gasto.service.ts

import { prisma } from "@/lib/prisma"
import { GastoFormData } from "@/validations/gasto.schema"

export async function listarGastos() {
  return prisma.gasto.findMany({
    orderBy: { data: "desc" },
  })
}

export async function buscarGastoPorId(id: string) {
  return prisma.gasto.findUnique({ where: { id } })
}

export async function criarGasto(dados: GastoFormData) {
  return prisma.gasto.create({
    data: {
      categoria: dados.categoria,
      descricao: dados.descricao,
      valor: dados.valor,
      data: new Date(dados.data),
    },
  })
}

export async function atualizarGasto(id: string, dados: GastoFormData) {
  return prisma.gasto.update({
    where: { id },
    data: {
      categoria: dados.categoria,
      descricao: dados.descricao,
      valor: dados.valor,
      data: new Date(dados.data),
    },
  })
}

export async function excluirGasto(id: string) {
  return prisma.gasto.delete({ where: { id } })
}