// src/services/agendamento.service.ts

import { prisma } from "@/lib/prisma"
import { AgendamentoFormData } from "@/validations/agendamento.schema"

export async function listarAgendamentosPorPeriodo(inicio: Date, fim: Date) {
  return prisma.agendamento.findMany({
    where: {
      dataHora: { gte: inicio, lte: fim },
    },
    include: { cliente: true, veiculo: true },
    orderBy: { dataHora: "asc" },
  })
}

export async function criarAgendamento(dados: AgendamentoFormData) {
  return prisma.agendamento.create({
    data: {
      clienteId: dados.clienteId,
      veiculoId: dados.veiculoId,
      dataHora: new Date(dados.dataHora),
    },
  })
}

export async function atualizarStatusAgendamento(
  id: string,
  status: "PENDENTE" | "CONFIRMADO" | "CANCELADO"
) {
  return prisma.agendamento.update({
    where: { id },
    data: { status },
  })
}

export async function excluirAgendamento(id: string) {
  return prisma.agendamento.delete({ where: { id } })
}