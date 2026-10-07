import { prisma } from "@/lib/prisma"
import { VeiculoFormData } from "@/validations/veiculo.schema"

export async function listarVeiculos() {
  return prisma.veiculo.findMany({
    include: { cliente: true },
    orderBy: { placa: "asc" },
  })
}

export async function buscarVeiculoPorId(id: string) {
  return prisma.veiculo.findUnique({
    where: { id },
    include: { cliente: true },
  })
}

export async function criarVeiculo(dados: VeiculoFormData) {
  return prisma.veiculo.create({
    data: dados,
  })
}

export async function atualizarVeiculo(id: string, dados: VeiculoFormData) {
  return prisma.veiculo.update({
    where: { id },
    data: dados,
  })
}

export async function excluirVeiculo(id: string) {
  return prisma.veiculo.delete({
    where: { id },
  })
}