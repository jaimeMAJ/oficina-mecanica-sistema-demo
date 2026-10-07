"use client"

import { useActionState, useState } from "react"
import { Peca } from "@prisma/client"
import { adicionarItemAction, EstadoFormulario } from "../itens-actions"
import { Plus, Package, Wrench } from "lucide-react"

type PecaSerializavel = Omit<Peca, "valorCusto" | "valorVenda"> & {
  valorCusto: number
  valorVenda: number
}

const estadoInicial: EstadoFormulario = null

export function FormularioItem({
  ordemServicoId,
  pecas,
}: {
  ordemServicoId: string
  pecas: PecaSerializavel[]
}) {
  const adicionarComId = adicionarItemAction.bind(null, ordemServicoId)
  const [estado, formAction, pendente] = useActionState(adicionarComId, estadoInicial)
  const [tipo, setTipo] = useState<"PECA" | "MAO_DE_OBRA">("PECA")

  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-4 h-4 text-[#4338CA]" />
        <h3 className="font-crimson text-lg font-bold text-stone-900">
          Adicionar Item à Ordem de Serviço
        </h3>
      </div>

      {estado?.erro && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#DC2626]">
          {estado.erro}
        </div>
      )}

      <form action={formAction} key={pendente ? "enviando" : "pronto"} className="space-y-4">
        {/* Type Switcher */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg max-w-xs">
          <button
            type="button"
            onClick={() => setTipo("PECA")}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              tipo === "PECA"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#4338CA]" />
            <span>Peça do Estoque</span>
          </button>
          <button
            type="button"
            onClick={() => setTipo("MAO_DE_OBRA")}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              tipo === "MAO_DE_OBRA"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Mão de Obra</span>
          </button>
        </div>
        <input type="hidden" name="tipo" value={tipo} />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {tipo === "PECA" ? (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Selecione a Peça
              </label>
              <select
                name="pecaId"
                required
                onChange={(e) => {
                  const pecaSelecionada = pecas.find((p) => p.id === e.target.value)
                  const inputValor = document.querySelector<HTMLInputElement>(
                    'input[name="valorUnitario"]'
                  )
                  if (pecaSelecionada && inputValor) {
                    inputValor.value = Number(pecaSelecionada.valorVenda).toFixed(2)
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#4338CA]"
              >
                <option value="">Selecione uma peça...</option>
                {pecas.map((peca) => (
                  <option key={peca.id} value={peca.id}>
                    {peca.nome} (Estoque: {peca.quantidadeEstoque} | R$ {peca.valorVenda.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Descrição do Serviço
              </label>
              <input
                name="descricao"
                placeholder="Ex: Alinhamento e balanceamento 3D"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#4338CA]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Quantidade
            </label>
            <input
              name="quantidade"
              type="number"
              defaultValue={1}
              min={1}
              required
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#4338CA]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Valor Unitário (R$)
            </label>
            <input
              name="valorUnitario"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#4338CA]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={pendente}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{pendente ? "Adicionando..." : "Incluir na OS"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
