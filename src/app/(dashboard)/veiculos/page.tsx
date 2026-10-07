import Link from "next/link"
import { listarVeiculos } from "@/services/veiculo.service"
import { excluirVeiculoAction } from "./actions"
import { Car, Plus, Edit, Trash2, User, Gauge } from "lucide-react"

export default async function VeiculosPage() {
  const veiculos = await listarVeiculos()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Frota e Veículos
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Registro de automóveis, histórico mecânico e vínculo com proprietários.
          </p>
        </div>

        <Link
          href="/veiculos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Veículo</span>
        </Link>
      </div>

      {/* Veiculos Table */}
      {veiculos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 shadow-xs">
          <Car className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-crimson text-xl font-bold text-stone-800">
            Nenhum veículo cadastrado
          </h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Cadastre veículos associados aos clientes para abrir ordens de serviço.
          </p>
          <Link
            href="/veiculos/novo"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Veículo</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Placa</th>
                  <th className="py-3.5 px-4">Marca & Modelo</th>
                  <th className="py-3.5 px-4">Proprietário</th>
                  <th className="py-3.5 px-4">KM / Ano</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded border border-stone-200 text-xs">
                        {veiculo.placa}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-stone-900">
                        {veiculo.marca} {veiculo.modelo}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                        <User className="w-3.5 h-3.5 text-stone-600" />
                        <span>{veiculo.cliente?.nome ?? "Não vinculado"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-stone-600 font-mono tabular-nums">
                        {veiculo.kmAtual ? (
                          <>
                            <Gauge className="w-3.5 h-3.5 text-stone-600" />
                            <span>{veiculo.kmAtual.toLocaleString("pt-BR")} km</span>
                          </>
                        ) : (
                          <span>—</span>
                        )}
                        {veiculo.ano && <span className="text-stone-600">· {veiculo.ano}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <Link
                          href={`/veiculos/${veiculo.id}/editar`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-[#4338CA] hover:bg-stone-100 rounded border border-stone-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>

                        <form action={excluirVeiculoAction.bind(null, veiculo.id)}>
                          <button
                            type="submit"
                            className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Excluir veículo"
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
