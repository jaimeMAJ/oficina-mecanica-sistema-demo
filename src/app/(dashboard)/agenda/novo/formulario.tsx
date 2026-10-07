"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { Cliente, Veiculo } from "@prisma/client"
import { criarAgendamentoAction, EstadoFormulario } from "../actions"
import { ArrowLeft, Calendar, User, Car } from "lucide-react"

const estadoInicial: EstadoFormulario = null

export function FormularioNovoAgendamento({ clientes }: { clientes: Cliente[] }) {
  const [estado, formAction, pendente] = useActionState(criarAgendamentoAction, estadoInicial)
  const [clienteId, setClienteId] = useState("")
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  useEffect(() => {
    let ignore = false
    if (!clienteId) return

    fetch(`/api/clientes/${clienteId}/veiculos`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setVeiculos(data)
      })

    return () => {
      ignore = true
    }
  }, [clienteId])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/agenda"
          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Voltar para agenda"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-crimson text-3xl font-bold tracking-tight text-stone-900">
            Novo Agendamento
          </h1>
          <p className="text-sm text-stone-600">
            Agende a entrada de um veículo para revisão, diagnóstico ou reparo.
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
              <span>Cliente</span>
            </label>
            <select
              name="clienteId"
              required
              value={clienteId}
              onChange={(e) => {
                const val = e.target.value
                setClienteId(val)
                if (!val) setVeiculos([])
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            >
              <option value="">Selecione o cliente responsável</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} {c.telefone ? `(${c.telefone})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              <Car className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>Veículo</span>
            </label>
            <select
              name="veiculoId"
              required
              defaultValue=""
              disabled={!clienteId}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA] disabled:bg-stone-100 disabled:text-stone-400"
            >
              <option value="">
                {clienteId ? "Selecione o veículo cadastrado" : "Primeiro selecione o cliente acima"}
              </option>
              {veiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.placa} — {v.marca} {v.modelo}
                </option>
              ))}
            </select>
            {clienteId && veiculos.length === 0 && (
              <p className="text-xs text-[#D97706] mt-1.5">
                Nenhum veículo encontrado para este cliente.{" "}
                <Link href="/veiculos/novo" className="underline font-semibold">
                  Cadastrar veículo agora
                </Link>
                .
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>Data e Horário</span>
            </label>
            <input
              name="dataHora"
              type="datetime-local"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <Link
              href="/agenda"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pendente}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {pendente ? "Salvando..." : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
