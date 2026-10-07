import { prisma } from "@/lib/prisma"
import { ClienteFormData } from "@/validations/cliente.schema"

export async function listarClientes() {
  return prisma.cliente.findMany({
    orderBy: { nome: "asc" },
  })
}

export async function buscarClientePorId(id: string) {
  return prisma.cliente.findUnique({
    where: { id },
  })
}

export async function criarCliente(dados: ClienteFormData) {
  return prisma.cliente.create({
    data: dados,
  })
}

export async function atualizarCliente(id: string, dados: ClienteFormData) {
  return prisma.cliente.update({
    where: { id },
    data: dados,
  })
}

export async function excluirCliente(id: string) {
  return prisma.cliente.delete({
    where: { id },
  })
}