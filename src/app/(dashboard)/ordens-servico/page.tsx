import Link from "next/link"
import { listarOrdensServico } from "@/services/ordem-servico.service"
import {
  ClipboardList,
  Plus,
  Car,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
  ArrowRight,
} from "lucide-react"

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  AGUARDANDO: {
    label: "Aguardando",
    bg: "bg-[#D97706]/10",
    text: "text-[#D97706]",
    border: "border-[#D97706]/20",
    icon: Clock,
  },
  EM_EXECUCAO: {
    label: "Em Execução",
    bg: "bg-[#4338CA]/10",
    text: "text-[#4338CA]",
    border: "border-[#4338CA]/20",
    icon: AlertCircle,
  },
  CONCLUIDO: {
    label: "Concluído",
    bg: "bg-[#0F766E]/10",
    text: "text-[#0F766E]",
    border: "border-[#0F766E]/20",
    icon: CheckCircle2,
  },
  ENTREGUE: {
    label: "Entregue",
    bg: "bg-[#16A34A]/10",
    text: "text-[#16A34A]",
    border: "border-[#16A34A]/20",
    icon: Truck,
  },
  CANCELADO: {
    label: "Cancelado",
    bg: "bg-[#DC2626]/10",
    text: "text-[#DC2626]",
    border: "border-[#DC2626]/20",
    icon: XCircle,
  },
}

export default async function OrdensServicoPage() {
  const ordens = await listarOrdensServico()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Ordens de Serviço
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Gestão de reparos, manutenções, apontamento de peças e liquidação financeira.
          </p>
        </div>

        <Link
          href="/ordens-servico/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ordem de Serviço</span>
        </Link>
      </div>

      {/* OS Table */}
      {ordens.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 shadow-xs">
          <ClipboardList className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-crimson text-xl font-bold text-stone-800">
            Nenhuma Ordem de Serviço aberta
          </h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Abra a primeira OS para registrar serviços mecânicos, peças e recebimentos.
          </p>
          <Link
            href="/ordens-servico/novo"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Abrir Nova OS</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Abertura</th>
                  <th className="py-3.5 px-4">Veículo</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Valor Total</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ordens.map((os) => {
                  const cfg = statusConfig[os.status] || statusConfig.AGUARDANDO
                  const Icon = cfg.icon

                  return (
                    <tr key={os.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-mono tabular-nums text-xs text-stone-700">
                        {os.dataAbertura ? new Date(os.dataAbertura).toLocaleDateString("pt-BR") : "—"}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                          <span className="font-mono font-bold text-stone-800 text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {os.veiculo?.placa ?? "—"}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 pl-5 mt-0.5">
                          {os.veiculo?.marca} {os.veiculo?.modelo}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-stone-900">
                          <User className="w-3.5 h-3.5 text-stone-600" />
                          <span>{os.veiculo?.cliente?.nome ?? "Não informado"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-stone-900 text-sm">
                        R$ {Number(os.valorTotal).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <Link
                          href={`/ordens-servico/${os.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4338CA] hover:bg-[#4338CA]/10 border border-[#4338CA]/30 transition-colors"
                        >
                          <span>Ver detalhes</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
