// src/app/(dashboard)/ordens-servico/[id]/page.tsx

import Link from "next/link"
import { notFound } from "next/navigation"
import { buscarOrdemServicoPorId, calcularSaldoOS } from "@/services/ordem-servico.service"
import { atualizarStatusAction } from "../actions"
import { listarPecas } from "@/services/peca.service"
import { removerItemAction } from "../itens-actions"
import { FormularioItem } from "./formulario-item"
import { excluirPagamentoAction } from "../pagamentos-actions"
import { formaPagamentoLabel } from "@/validations/pagamento.schema"
import { FormularioPagamento } from "./formulario-pagamento"
import {
  ArrowLeft,
  Car,
  User,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
  Trash2,
  Layers,
  CreditCard,
} from "lucide-react"

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  AGUARDANDO: {
    label: "Aguardando",
    bg: "bg-[#D97706]/10",
    text: "text-[#D97706]",
    border: "border-[#D97706]/30",
    icon: Clock,
  },
  EM_EXECUCAO: {
    label: "Em Execução",
    bg: "bg-[#4338CA]/10",
    text: "text-[#4338CA]",
    border: "border-[#4338CA]/30",
    icon: AlertCircle,
  },
  CONCLUIDO: {
    label: "Concluído",
    bg: "bg-[#0F766E]/10",
    text: "text-[#0F766E]",
    border: "border-[#0F766E]/30",
    icon: CheckCircle2,
  },
  ENTREGUE: {
    label: "Entregue",
    bg: "bg-[#16A34A]/10",
    text: "text-[#16A34A]",
    border: "border-[#16A34A]/30",
    icon: Truck,
  },
  CANCELADO: {
    label: "Cancelado",
    bg: "bg-[#DC2626]/10",
    text: "text-[#DC2626]",
    border: "border-[#DC2626]/30",
    icon: XCircle,
  },
}

const statusOpcoes = [
  { valor: "AGUARDANDO", label: "Aguardando" },
  { valor: "EM_EXECUCAO", label: "Em execução" },
  { valor: "CONCLUIDO", label: "Concluído" },
  { valor: "ENTREGUE", label: "Entregue" },
  { valor: "CANCELADO", label: "Cancelado" },
]

export default async function DetalheOrdemServicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const os = await buscarOrdemServicoPorId(id)
  const saldo = await calcularSaldoOS(id)
  if (!os) return notFound()

  const atualizarStatusComId = atualizarStatusAction.bind(null, os.id)
  const pecas = await listarPecas()
  const pecasSerializaveis = pecas.map((peca) => ({
    ...peca,
    valorCusto: Number(peca.valorCusto),
    valorVenda: Number(peca.valorVenda),
  }))

  const statusAtual = statusConfig[os.status] || statusConfig.AGUARDANDO
  const StatusIcon = statusAtual.icon

  return (
    <div className="space-y-8">
      {/* Thread Root (Level 0) Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ordens-servico"
            className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            title="Voltar para lista de OS"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-stone-600">
                Ordem de Serviço
              </span>
              <span className="text-xs text-stone-600 font-mono">#{os.id.slice(0, 8)}</span>
            </div>
            <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              {os.veiculo?.marca ?? "Veículo"} {os.veiculo?.modelo ?? ""} ({os.veiculo?.placa ?? "Sem placa"})
            </h1>
          </div>

          <div className="shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusAtual.bg} ${statusAtual.text} ${statusAtual.border}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusAtual.label}</span>
            </span>
          </div>
        </div>

        {/* Master Info Card */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#4338CA]" /> Cliente
            </span>
            <p className="font-semibold text-stone-900">{os.veiculo?.cliente?.nome ?? "Não informado"}</p>
            {os.veiculo?.cliente?.telefone && (
              <p className="text-xs text-stone-600 font-mono">{os.veiculo.cliente.telefone}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-[#4338CA]" /> Veículo
            </span>
            <p className="font-mono font-bold text-stone-900 text-sm">{os.veiculo?.placa ?? "—"}</p>
            <p className="text-xs text-stone-600">
              {os.veiculo?.marca} {os.veiculo?.modelo}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-[#4338CA]" /> Mecânico Responsável
            </span>
            <p className="font-medium text-stone-900">
              {os.funcionario?.nome ?? "Não atribuído"}
            </p>
            <p className="text-xs text-stone-600 font-mono">
              Abertura: {os.dataAbertura ? new Date(os.dataAbertura).toLocaleDateString("pt-BR") : "—"}
            </p>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-stone-200 md:pl-6">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              Alterar Status
            </span>
            <form action={atualizarStatusComId} className="flex gap-2">
              <select
                name="status"
                key={os.status}
                defaultValue={os.status}
                className="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#4338CA]"
              >
                {statusOpcoes.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#4338CA] hover:bg-[#3730A3] text-white transition-colors cursor-pointer"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>

        {os.descricaoProblema && (
          <div className="bg-stone-50/80 rounded-lg border border-stone-200 p-4">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-1">
              Problema Relatado / Queixa do Cliente
            </span>
            <p className="text-sm text-stone-800 leading-relaxed">{os.descricaoProblema}</p>
          </div>
        )}

        {/* Financial Highlights */}
        {saldo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Valor Total da OS
              </span>
              <div className="font-crimson text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
                R$ {saldo.valorTotal.toFixed(2)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Total Recebido / Pago
              </span>
              <div className="font-crimson text-2xl font-bold text-[#16A34A] mt-1 font-mono tabular-nums">
                R$ {saldo.totalPago.toFixed(2)}
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border shadow-xs ${
                saldo.quitado
                  ? "bg-teal-50/70 border-teal-200 text-teal-900"
                  : "bg-amber-50/70 border-amber-200 text-amber-900"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Saldo em Aberto</span>
                <span className="text-[11px] font-bold">
                  {saldo.quitado ? "QUITADO" : "PENDENTE"}
                </span>
              </span>
              <div className="font-crimson text-2xl font-bold mt-1 font-mono tabular-nums">
                R$ {saldo.saldoRestante.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ThreadWeave Nested Branch 1: Itens da OS (Depth: 24px Indentation) */}
      <div className="pl-6 border-l-2 border-[#4338CA]/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4338CA]" />
            <h2 className="font-crimson text-2xl font-bold text-stone-900">
              Itens da Ordem de Serviço
            </h2>
          </div>
          <span className="text-xs text-stone-600 font-mono">
            {os.itens.length} {os.itens.length === 1 ? "item apontado" : "itens apontados"}
          </span>
        </div>

        {/* Table of items */}
        {os.itens.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
            Nenhum serviço ou peça apontado nesta OS ainda.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Descrição</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 text-center">Qtd.</th>
                  <th className="py-3 px-4 text-right">Valor Unit.</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {os.itens.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-stone-900">
                      {item.descricao}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.tipo === "PECA"
                            ? "bg-indigo-50 text-[#4338CA] border border-indigo-200"
                            : "bg-teal-50 text-[#0F766E] border border-teal-200"
                        }`}
                      >
                        {item.tipo === "PECA" ? "Peça" : "Mão de Obra"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-stone-700">
                      {item.quantidade}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-stone-600 text-xs">
                      R$ {Number(item.valorUnitario).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-stone-900">
                      R$ {(Number(item.valorUnitario) * item.quantidade).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <form action={removerItemAction.bind(null, item.id, os.id)}>
                        <button
                          type="submit"
                          className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Remover item da OS"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Thread Child (Level 2: Indented 24px further) -> Add Item Form */}
        <div className="pl-6 border-l-2 border-stone-200">
          <FormularioItem ordemServicoId={os.id} pecas={pecasSerializaveis} />
        </div>
      </div>

      {/* ThreadWeave Nested Branch 2: Pagamentos (Depth: 24px Indentation) */}
      <div className="pl-6 border-l-2 border-[#0F766E]/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#0F766E]" />
            <h2 className="font-crimson text-2xl font-bold text-stone-900">
              Pagamentos e Recibos
            </h2>
          </div>
          <span className="text-xs text-stone-600 font-mono">
            {os.pagamentos.length} {os.pagamentos.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        {/* Table of payments */}
        {os.pagamentos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
            Nenhum pagamento registrado para esta OS ainda.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Data</th>
                  <th className="py-3 px-4">Forma de Pagamento</th>
                  <th className="py-3 px-4 text-right">Valor Pago</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {os.pagamentos.map((pagamento) => (
                  <tr key={pagamento.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-stone-700">
                      {pagamento.data ? new Date(pagamento.data).toLocaleDateString("pt-BR") : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-stone-900">
                      {formaPagamentoLabel[pagamento.formaPagamento as keyof typeof formaPagamentoLabel] || pagamento.formaPagamento}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#16A34A]">
                      R$ {Number(pagamento.valor).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <form
                        action={excluirPagamentoAction.bind(null, pagamento.id, os.id)}
                        style={{ display: "inline" }}
                      >
                        <button
                          type="submit"
                          className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Excluir pagamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Thread Child (Level 2: Indented 24px further) -> Register Payment Form */}
        <div className="pl-6 border-l-2 border-stone-200">
          <FormularioPagamento ordemServicoId={os.id} />
        </div>
      </div>
    </div>
  )
}
