import Link from "next/link"
import { listarAgendamentosPorPeriodo } from "@/services/agendamento.service"
import {
  inicioDoDia,
  fimDoDia,
  inicioDaSemana,
  fimDaSemana,
  adicionarDias,
  formatarDataParaURL,
} from "@/lib/data-utils"
import {
  confirmarAgendamentoAction,
  cancelarAgendamentoAction,
  excluirAgendamentoAction,
  iniciarAtendimentoAction,
} from "./actions"
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Car,
  User,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowRight,
  FileText,
} from "lucide-react"

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ visao?: string; data?: string }>
}) {
  const params = await searchParams
  const visao = params.visao === "semana" ? "semana" : "dia"
  const parsedDate = params.data ? new Date(params.data + "T00:00:00") : new Date()
  const dataBase = !isNaN(parsedDate.getTime()) ? parsedDate : new Date()

  const inicio = visao === "dia" ? inicioDoDia(dataBase) : inicioDaSemana(dataBase)
  const fim = visao === "dia" ? fimDoDia(dataBase) : fimDaSemana(dataBase)

  const agendamentos = await listarAgendamentosPorPeriodo(inicio, fim)

  const diasAnterior = visao === "dia" ? -1 : -7
  const diasProximo = visao === "dia" ? 1 : 7
  const dataAnterior = formatarDataParaURL(adicionarDias(dataBase, diasAnterior))
  const dataProxima = formatarDataParaURL(adicionarDias(dataBase, diasProximo))

  const statusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
            <CheckCircle2 className="w-3 h-3" /> Confirmado
          </span>
        )
      case "CANCELADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
            <Clock className="w-3 h-3" /> Pendente
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Agenda da Oficina
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Controle de serviços programados, confirmações e abertura de atendimento.
          </p>
        </div>

        <Link
          href="/agenda/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
        </Link>
      </div>

      {/* Control Bar: View Switcher & Date Pagination */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
        {/* Segmented View Switcher */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg self-start">
          <Link
            href={`/agenda?visao=dia&data=${formatarDataParaURL(dataBase)}`}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              visao === "dia"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Visão do Dia
          </Link>
          <Link
            href={`/agenda?visao=semana&data=${formatarDataParaURL(dataBase)}`}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              visao === "semana"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Visão da Semana
          </Link>
        </div>

        {/* Date Range Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href={`/agenda?visao=${visao}&data=${dataAnterior}`}
            className="p-1.5 rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            title="Período anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          <div className="text-center min-w-[200px]">
            <span className="font-crimson text-lg font-semibold text-stone-900">
              {inicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              {visao === "semana" && (
                <> — {fim.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</>
              )}
            </span>
          </div>

          <Link
            href={`/agenda?visao=${visao}&data=${dataProxima}`}
            className="p-1.5 rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            title="Próximo período"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Appointments List / Table */}
      {agendamentos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 shadow-xs">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-crimson text-xl font-bold text-stone-800">
            Nenhum agendamento neste período
          </h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Não há manutenções agendadas para esta data. Clique no botão abaixo para registrar um horário.
          </p>
          <Link
            href="/agenda/novo"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar Cliente</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Horário</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Veículo</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {agendamentos.map((ag) => (
                  <tr key={ag.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-mono text-stone-900 font-semibold text-sm tabular-nums">
                        {ag.dataHora ? new Date(ag.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                      <div className="text-xs text-stone-500 font-mono tabular-nums">
                        {ag.dataHora ? new Date(ag.dataHora).toLocaleDateString("pt-BR") : "—"}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                        <span className="font-medium text-stone-900">{ag.cliente?.nome ?? "Cliente não identificado"}</span>
                      </div>
                      {ag.cliente?.telefone && (
                        <div className="text-xs text-stone-500 pl-5">{ag.cliente.telefone}</div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                        <span className="font-mono font-semibold text-stone-800 text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {ag.veiculo?.placa ?? "—"}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 pl-5 mt-0.5">
                        {ag.veiculo?.marca} {ag.veiculo?.modelo}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {statusBadge(ag.status)}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {ag.status === "PENDENTE" && (
                          <form action={confirmarAgendamentoAction.bind(null, ag.id)}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 text-xs font-semibold rounded text-[#0F766E] hover:bg-[#0F766E]/10 border border-[#0F766E]/30 transition-colors cursor-pointer"
                              title="Confirmar presença"
                            >
                              Confirmar
                            </button>
                          </form>
                        )}

                        {!ag.ordemServicoId && ag.status !== "CANCELADO" && (
                          <form action={iniciarAtendimentoAction.bind(null, ag.id)}>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors cursor-pointer"
                              title="Gerar Ordem de Serviço"
                            >
                              <span>Iniciar Atendimento</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </form>
                        )}

                        {ag.ordemServicoId && (
                          <Link
                            href={`/ordens-servico/${ag.ordemServicoId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded text-[#4338CA] hover:bg-[#4338CA]/10 border border-[#4338CA]/30 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Ver OS</span>
                          </Link>
                        )}

                        {ag.status !== "CANCELADO" && (
                          <form action={cancelarAgendamentoAction.bind(null, ag.id)}>
                            <button
                              type="submit"
                              className="px-2 py-1 text-xs text-stone-600 hover:text-[#D97706] hover:bg-amber-50 rounded transition-colors cursor-pointer"
                              title="Cancelar agendamento"
                            >
                              Cancelar
                            </button>
                          </form>
                        )}

                        <form action={excluirAgendamentoAction.bind(null, ag.id)}>
                          <button
                            type="submit"
                            className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
