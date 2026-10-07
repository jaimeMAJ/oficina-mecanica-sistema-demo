import Link from "next/link"
import { listarPecas } from "@/services/peca.service"
import { excluirPecaAction } from "./actions"
import { Package, Plus, Edit, Trash2, AlertTriangle } from "lucide-react"

export default async function EstoquePage() {
  const pecas = await listarPecas()
  const pecasComEstoqueBaixo = pecas.filter((p) => p.quantidadeEstoque <= p.quantidadeMinima)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Controle de Estoque
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Peças de reposição, componentes, níveis mínimos e margens de venda.
          </p>
        </div>

        <Link
          href="/estoque/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Peça</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total de Itens</span>
          <div className="font-crimson text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            {pecas.length}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">Cadastrados no catálogo</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Unidades Disponíveis</span>
          <div className="font-crimson text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            {pecas.reduce((soma, p) => soma + p.quantidadeEstoque, 0)}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">Em prateleira</p>
        </div>

        <div className={`p-5 rounded-xl border shadow-xs transition-colors ${
          pecasComEstoqueBaixo.length > 0
            ? "bg-amber-50/60 border-amber-200 text-amber-900"
            : "bg-white border-stone-200 text-stone-900"
        }`}>
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            {pecasComEstoqueBaixo.length > 0 && <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />}
            <span>Alerta de Reposição</span>
          </span>
          <div className="font-crimson text-2xl font-bold mt-1 font-mono tabular-nums">
            {pecasComEstoqueBaixo.length}
          </div>
          <p className="text-xs opacity-80 mt-0.5">
            {pecasComEstoqueBaixo.length > 0
              ? "Itens abaixo da quantidade mínima"
              : "Nenhum item com estoque crítico"}
          </p>
        </div>
      </div>

      {/* Estoque Table */}
      {pecas.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 shadow-xs">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-crimson text-xl font-bold text-stone-800">
            Nenhuma peça cadastrada
          </h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Cadastre peças como filtros, óleos e pastilhas para vincular nas ordens de serviço.
          </p>
          <Link
            href="/estoque/novo"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Peça</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nome da Peça</th>
                  <th className="py-3.5 px-4">SKU / Código</th>
                  <th className="py-3.5 px-4">Estoque / Mín.</th>
                  <th className="py-3.5 px-4 text-right">Custo</th>
                  <th className="py-3.5 px-4 text-right">Venda</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pecas.map((peca) => {
                  const estoqueBaixo = peca.quantidadeEstoque <= peca.quantidadeMinima
                  return (
                    <tr
                      key={peca.id}
                      className={`hover:bg-stone-50/70 transition-colors ${
                        estoqueBaixo ? "bg-amber-50/30" : ""
                      }`}
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-stone-900">{peca.nome}</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {peca.sku ?? "—"}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold tabular-nums text-sm ${
                            estoqueBaixo ? "text-[#D97706]" : "text-stone-900"
                          }`}>
                            {peca.quantidadeEstoque}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">
                            / mín {peca.quantidadeMinima}
                          </span>
                          {estoqueBaixo && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30">
                              Baixo
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap font-mono tabular-nums text-stone-600 text-xs">
                        R$ {Number(peca.valorCusto).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-stone-900 text-sm">
                        R$ {Number(peca.valorVenda).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Link
                            href={`/estoque/${peca.id}/editar`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-[#4338CA] hover:bg-stone-100 rounded border border-stone-200 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </Link>

                          <form action={excluirPecaAction.bind(null, peca.id)}>
                            <button
                              type="submit"
                              className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Excluir peça"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
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
