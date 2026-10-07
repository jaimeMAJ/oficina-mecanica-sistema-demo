"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Cliente } from "@prisma/client"
import { criarVeiculoAction, EstadoFormulario } from "../actions"
import { ArrowLeft, Car, User, Gauge, Calendar } from "lucide-react"

const estadoInicial: EstadoFormulario = null

export function FormularioNovoVeiculo({ clientes }: { clientes: Cliente[] }) {
  const [estado, formAction, pendente] = useActionState(criarVeiculoAction, estadoInicial)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/veiculos"
          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Voltar para veículos"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-crimson text-3xl font-bold tracking-tight text-stone-900">
            Cadastrar Veículo
          </h1>
          <p className="text-sm text-stone-600">
            Adicione um automóvel e associe ao respectivo proprietário.
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
              <User className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>Proprietário / Cliente</span>
            </label>
            <select
              name="clienteId"
              required
              defaultValue=""
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            >
              <option value="" disabled>Selecione o cliente responsável</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} {cliente.telefone ? `(${cliente.telefone})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Car className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Placa</span>
              </label>
              <input
                name="placa"
                placeholder="ABC-1234 ou ABC1D23"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Marca
              </label>
              <input
                name="marca"
                placeholder="Ex: Fiat, Toyota, VW"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Modelo
              </label>
              <input
                name="modelo"
                placeholder="Ex: Uno 1.0, Corolla"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Ano de Fabricação</span>
              </label>
              <input
                name="ano"
                type="number"
                placeholder="Ex: 2020"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Quilometragem Atual (KM)</span>
              </label>
              <input
                name="kmAtual"
                type="number"
                placeholder="Ex: 65000"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <Link
              href="/veiculos"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pendente}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {pendente ? "Salvando..." : "Salvar Veículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
