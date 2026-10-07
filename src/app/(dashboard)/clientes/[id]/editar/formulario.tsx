"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Cliente } from "@prisma/client"
import { atualizarClienteAction, EstadoFormulario } from "../../actions"
import { ArrowLeft, User, Phone, Mail, FileText } from "lucide-react"

const estadoInicial: EstadoFormulario = null

export function FormularioEdicaoCliente({ cliente }: { cliente: Cliente }) {
  const atualizarComId = atualizarClienteAction.bind(null, cliente.id)
  const [estado, formAction, pendente] = useActionState(atualizarComId, estadoInicial)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clientes"
          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Voltar para clientes"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-crimson text-3xl font-bold tracking-tight text-stone-900">
            Editar Cliente
          </h1>
          <p className="text-sm text-stone-600">
            Atualize as informações cadastrais de {cliente.nome}.
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
              <span>Nome Completo</span>
            </label>
            <input
              name="nome"
              defaultValue={cliente.nome}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Phone className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>Telefone</span>
              </label>
              <input
                name="telefone"
                defaultValue={cliente.telefone ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <Mail className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>E-mail</span>
              </label>
              <input
                name="email"
                type="email"
                defaultValue={cliente.email ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>CPF ou CNPJ</span>
            </label>
            <input
              name="documento"
              defaultValue={cliente.documento ?? ""}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <Link
              href="/clientes"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pendente}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {pendente ? "Salvando..." : "Atualizar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
