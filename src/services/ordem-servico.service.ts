// src/services/ordem-servico.service.ts

import { prisma } from "@/lib/prisma"
import { OrdemServicoFormData, statusOSValues } from "@/validations/ordem-servico.schema"
import { ItemOSFormData } from "@/validations/item-os.schema"
import { PagamentoFormData } from "@/validations/pagamento.schema"

export async function listarOrdensServico() {
  return prisma.ordemServico.findMany({
    include: { veiculo: { include: { cliente: true } }, funcionario: true },
    orderBy: { dataAbertura: "desc" },
  })
}

export async function buscarOrdemServicoPorId(id: string) {
  return prisma.ordemServico.findUnique({
    where: { id },
    include: {
      veiculo: { include: { cliente: true } },
      funcionario: true,
      itens: true,
      pagamentos: true,
    },
  })
}

export async function criarOrdemServico(dados: OrdemServicoFormData) {
  return prisma.ordemServico.create({
    data: {
      veiculoId: dados.veiculoId,
      funcionarioId: dados.funcionarioId || null,
      dataEntregaPrevista: dados.dataEntregaPrevista
        ? new Date(dados.dataEntregaPrevista)
        : null,
      descricaoProblema: dados.descricaoProblema,
    },
  })
}

export async function atualizarStatusOrdemServico(
  id: string,
  status: (typeof statusOSValues)[number]
) {
  return prisma.ordemServico.update({
    where: { id },
    data: { status },
  })
}

export async function excluirOrdemServico(id: string) {
  return prisma.ordemServico.delete({
    where: { id },
  })
}

export async function listarFuncionarios() {
  return prisma.usuario.findMany({
    where: { perfil: { in: ["PROPRIETARIO", "FUNCIONARIO"] }, ativo: true },
    orderBy: { nome: "asc" },
  })
}

export async function adicionarItemOS(ordemServicoId: string, dados: ItemOSFormData) {
  await prisma.$transaction(async (tx) => {
    let descricao = dados.tipo === "MAO_DE_OBRA" ? dados.descricao : ""

    if (dados.tipo === "PECA") {
      const peca = await tx.peca.findUnique({ where: { id: dados.pecaId } })

      if (!peca) {
        throw new Error("Peça não encontrada")
      }

      if (peca.quantidadeEstoque < dados.quantidade) {
        throw new Error(
          `Estoque insuficiente. Disponível: ${peca.quantidadeEstoque}, solicitado: ${dados.quantidade}`
        )
      }

      descricao = peca.nome

      await tx.peca.update({
        where: { id: dados.pecaId },
        data: { quantidadeEstoque: { decrement: dados.quantidade } },
      })
    }

    await tx.itemOrdemServico.create({
      data: {
        ordemServicoId,
        tipo: dados.tipo,
        pecaId: dados.tipo === "PECA" ? dados.pecaId : null,
        descricao,
        quantidade: dados.quantidade,
        valorUnitario: dados.valorUnitario,
      },
    })

    const itens = await tx.itemOrdemServico.findMany({ where: { ordemServicoId } })
    const total = itens.reduce(
      (soma, item) => soma + Number(item.valorUnitario) * item.quantidade,
      0
    )

    await tx.ordemServico.update({
      where: { id: ordemServicoId },
      data: { valorTotal: total },
    })
  })
}

export async function obterNomePeca(pecaId: string) {
  const peca = await prisma.peca.findUnique({ where: { id: pecaId } })
  return peca?.nome ?? "Peça"
}

export async function removerItemOS(itemId: string, ordemServicoId: string) {
  await prisma.$transaction(async (tx) => {
    const item = await tx.itemOrdemServico.findUnique({ where: { id: itemId } })

    if (!item) return

    if (item.tipo === "PECA" && item.pecaId) {
      await tx.peca.update({
        where: { id: item.pecaId },
        data: { quantidadeEstoque: { increment: item.quantidade } },
      })
    }

    await tx.itemOrdemServico.delete({ where: { id: itemId } })

    const itens = await tx.itemOrdemServico.findMany({ where: { ordemServicoId } })
    const total = itens.reduce(
      (soma, i) => soma + Number(i.valorUnitario) * i.quantidade,
      0
    )

    await tx.ordemServico.update({
      where: { id: ordemServicoId },
      data: { valorTotal: total },
    })
  })
}

export async function recalcularValorTotalOS(ordemServicoId: string) {
  const itens = await prisma.itemOrdemServico.findMany({
    where: { ordemServicoId },
  })

  const total = itens.reduce(
    (soma, item) => soma + Number(item.valorUnitario) * item.quantidade,
    0
  )

  await prisma.ordemServico.update({
    where: { id: ordemServicoId },
    data: { valorTotal: total },
  })
}


export async function criarOrdemServicoAPartirDeAgendamento(agendamentoId: string) {
  return prisma.$transaction(async (tx) => {
    const agendamento = await tx.agendamento.findUnique({
      where: { id: agendamentoId },
    })

    if (!agendamento) {
      throw new Error("Agendamento não encontrado")
    }

    if (agendamento.ordemServicoId) {
      throw new Error("Este agendamento já possui uma Ordem de Serviço vinculada")
    }

    const os = await tx.ordemServico.create({
      data: {
        veiculoId: agendamento.veiculoId,
      },
    })

    await tx.agendamento.update({
      where: { id: agendamentoId },
      data: {
        ordemServicoId: os.id,
        status: "CONFIRMADO",
      },
    })

    return os
  })
}

export async function registrarPagamento(ordemServicoId: string, dados: PagamentoFormData) {
  return prisma.pagamento.create({
    data: {
      ordemServicoId,
      valor: dados.valor,
      formaPagamento: dados.formaPagamento,
      status: "PAGO",
    },
  })
}

export async function excluirPagamento(id: string) {
  return prisma.pagamento.delete({ where: { id } })
}

export async function calcularSaldoOS(ordemServicoId: string) {
  const os = await prisma.ordemServico.findUnique({
    where: { id: ordemServicoId },
    include: { pagamentos: true },
  })

  if (!os) return null

  const totalPago = os.pagamentos
    .filter((p) => p.status === "PAGO")
    .reduce((soma, p) => soma + Number(p.valor), 0)

  const valorTotal = Number(os.valorTotal)

  return {
    valorTotal,
    totalPago,
    saldoRestante: valorTotal - totalPago,
    quitado: totalPago >= valorTotal,
  }
}
