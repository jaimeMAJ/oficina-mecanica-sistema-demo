"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Peca } from "@prisma/client"
import { atualizarPecaAction, EstadoFormulario } from "../../actions"
import { ArrowLeft, Package, Barcode, DollarSign, Layers } from "lucide-react"

const estadoInicial: EstadoFormulario = null

export function FormularioEdicaoPeca({ peca }: { peca: Peca }) {
  const atualizarComId = atualizarPecaAction.bind(null, peca.id)
  const [estado, formAction, pendente] = useActionState(atualizarComId, estadoInicial)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/estoque"
          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Voltar para estoque"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-crimson text-3xl font-bold tracking-tight text-stone-900">
            Editar Peça
          </h1>
          <p className="text-sm text-stone-600">
            Atualize as especificações e valores de {peca.nome}.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8">
        {estado?.erro && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-[#DC2626]">
            {estado.erro}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Package className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Descrição da Peça</span>
              </label>
              <input
                name="nome"
                defaultValue={peca.nome}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Barcode className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Código / SKU</span>
              </label>
              <input
                name="sku"
                defaultValue={peca.sku ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Layers className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Quantidade em Estoque</span>
              </label>
              <input
                name="quantidadeEstoque"
                type="number"
                defaultValue={peca.quantidadeEstoque}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Estoque Mínimo (Alerta)</span>
              </label>
              <input
                name="quantidadeMinima"
                type="number"
                defaultValue={peca.quantidadeMinima}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-stone-500" />
                <span>Preço de Custo (R$)</span>
              </label>
              <input
                name="valorCusto"
                type="number"
                step="0.01"
                defaultValue={Number(peca.valorCusto)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Preço de Venda (R$)</span>
              </label>
              <input
                name="valorVenda"
                type="number"
                step="0.01"
                defaultValue={Number(peca.valorVenda)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <Link
              href="/estoque"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pendente}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {pendente ? "Salvando..." : "Atualizar Peça"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
