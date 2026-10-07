// src/services/peca.service.ts

import { prisma } from "@/lib/prisma"
import { PecaFormData } from "@/validations/peca.schema"

export async function listarPecas() {
  return prisma.peca.findMany({
    orderBy: { nome: "asc" },
  })
}

export async function buscarPecaPorId(id: string) {
  return prisma.peca.findUnique({
    where: { id },
  })
}

export async function criarPeca(dados: PecaFormData) {
  return prisma.peca.create({
    data: dados,
  })
}

export async function atualizarPeca(id: string, dados: PecaFormData) {
  return prisma.peca.update({
    where: { id },
    data: dados,
  })
}

export async function excluirPeca(id: string) {
  return prisma.peca.delete({
    where: { id },
  })
}