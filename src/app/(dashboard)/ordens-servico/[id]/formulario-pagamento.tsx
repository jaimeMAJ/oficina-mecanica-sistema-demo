"use client"

import { useActionState } from "react"
import { registrarPagamentoAction, EstadoFormulario } from "../pagamentos-actions"
import { formasPagamento, formaPagamentoLabel } from "@/validations/pagamento.schema"
import { DollarSign, CreditCard } from "lucide-react"

const estadoInicial: EstadoFormulario = null

export function FormularioPagamento({ ordemServicoId }: { ordemServicoId: string }) {
  const registrarComId = registrarPagamentoAction.bind(null, ordemServicoId)
  const [estado, formAction, pendente] = useActionState(registrarComId, estadoInicial)

  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-[#0F766E]" />
        <h3 className="font-crimson text-lg font-bold text-stone-900">
          Registrar Novo Pagamento
        </h3>
      </div>

      {estado?.erro && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#DC2626]">
          {estado.erro}
        </div>
      )}

      <form action={formAction} key={pendente ? "enviando" : "pronto"} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Valor Recebido (R$)
            </label>
            <input
              name="valor"
              type="number"
              step="0.01"
              placeholder="Ex: 150.00"
              required
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Forma de Pagamento
            </label>
            <select
              name="formaPagamento"
              required
              defaultValue=""
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            >
              <option value="" disabled>Selecione a forma de pagamento</option>
              {formasPagamento.map((forma) => (
                <option key={forma} value={forma}>
                  {formaPagamentoLabel[forma] || forma}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={pendente}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#0d645e] shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{pendente ? "Registrando..." : "Confirmar Recebimento"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
