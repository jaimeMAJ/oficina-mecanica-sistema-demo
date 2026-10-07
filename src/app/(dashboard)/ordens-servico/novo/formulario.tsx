"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Usuario } from "@prisma/client"
import { criarOrdemServicoAction, EstadoFormulario } from "../actions"
import { ArrowLeft, Car, User, Calendar, FileText } from "lucide-react"

const estadoInicial: EstadoFormulario = null

type VeiculoComCliente = {
  id: string
  placa: string
  cliente?: { nome: string } | null
}

export function FormularioNovaOS({
  veiculos,
  funcionarios,
}: {
  veiculos: VeiculoComCliente[]
  funcionarios: Usuario[]
}) {
  const [estado, formAction, pendente] = useActionState(criarOrdemServicoAction, estadoInicial)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/ordens-servico"
          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Voltar para ordens de serviço"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-crimson text-3xl font-bold tracking-tight text-stone-900">
            Nova Ordem de Serviço
          </h1>
          <p className="text-sm text-stone-600">
            Inicie um novo diagnóstico mecânico ou manutenção vinculada ao veículo.
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
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              <Car className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>Veículo em Manutenção</span>
            </label>
            <select
              name="veiculoId"
              required
              defaultValue=""
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            >
              <option value="" disabled>Selecione o veículo cadastrado</option>
              {veiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.placa} — {v.cliente?.nome ?? "Cliente não informado"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <User className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Mecânico / Funcionário Responsável</span>
              </label>
              <select
                name="funcionarioId"
                defaultValue=""
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              >
                <option value="">Não atribuído no momento</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Previsão de Conclusão / Entrega</span>
              </label>
              <input
                name="dataEntregaPrevista"
                type="date"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>Descrição do Problema / Solicitação</span>
            </label>
            <textarea
              name="descricaoProblema"
              rows={4}
              placeholder="Ex: Barulho na frenagem dianteira e luz da injeção acesa no painel."
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <Link
              href="/ordens-servico"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pendente}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {pendente ? "Criando..." : "Abrir Ordem de Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
