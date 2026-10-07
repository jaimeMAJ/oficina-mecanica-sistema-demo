import Link from "next/link"
import { listarGastos } from "@/services/gasto.service"
import { categoriaLabel } from "@/validations/gasto.schema"
import { excluirGastoAction } from "./actions"
import { Receipt, Plus, Edit, Trash2, Tag } from "lucide-react"

export default async function GastosPage() {
  const gastos = await listarGastos()
  const totalGeral = gastos.reduce((soma, g) => soma + Number(g.valor), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Controle de Gastos & Despesas
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Lançamento de despesas operacionais, compra de suprimentos, peças e manutenção predial.
          </p>
        </div>

        <Link
          href="/financeiro/gastos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Gasto</span>
        </Link>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            Total de Gastos
          </span>
          <div className="font-crimson text-3xl font-bold text-[#DC2626] mt-1 font-mono tabular-nums">
            R$ {totalGeral.toFixed(2)}
          </div>
          <p className="text-xs text-stone-600 mt-0.5">Soma acumulada de todos os registros</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            Lançamentos
          </span>
          <div className="font-crimson text-3xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            {gastos.length}
          </div>
          <p className="text-xs text-stone-600 mt-0.5">Registros cadastrados</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            Ticket Médio
          </span>
          <div className="font-crimson text-3xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            R$ {gastos.length > 0 ? (totalGeral / gastos.length).toFixed(2) : "0.00"}
          </div>
          <p className="text-xs text-stone-600 mt-0.5">Média por despesa</p>
        </div>
      </div>

      {/* Gastos Table */}
      {gastos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 shadow-xs">
          <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-crimson text-xl font-bold text-stone-800">
            Nenhum gasto registrado
          </h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Cadastre compras de ferramentas, reposição de estoque ou contas da oficina.
          </p>
          <Link
            href="/financeiro/gastos/novo"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lançar Primeiro Gasto</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Data</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Descrição</th>
                  <th className="py-3.5 px-4 text-right">Valor</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {gastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-mono text-xs text-stone-700">
                      {gasto.data ? new Date(gasto.data).toLocaleDateString("pt-BR") : "—"}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                        <Tag className="w-3 h-3 text-[#4338CA]" />
                        <span>
                          {categoriaLabel[gasto.categoria as keyof typeof categoriaLabel] ||
                            gasto.categoria}
                        </span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-stone-900">
                      {gasto.descricao ?? "—"}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap font-mono tabular-nums font-bold text-[#DC2626] text-sm">
                      - R$ {Number(gasto.valor).toFixed(2)}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <Link
                          href={`/financeiro/gastos/${gasto.id}/editar`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-[#4338CA] hover:bg-stone-100 rounded border border-stone-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>

                        <form action={excluirGastoAction.bind(null, gasto.id)} style={{ display: "inline" }}>
                          <button
                            type="submit"
                            className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Excluir gasto"
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
