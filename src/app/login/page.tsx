"use client"

import { useActionState, useState } from "react"
import { loginServerAction, EstadoLogin } from "./actions"
import { Wrench, Shield, KeyRound, ArrowRight } from "lucide-react"

const estadoInicial: EstadoLogin = null

export default function LoginPage() {
  const [estado, formAction, pendente] = useActionState(loginServerAction, estadoInicial)
  const [email, setEmail] = useState("jaimearedesjr@gmail.com")
  const [senha, setSenha] = useState("125879")

  const preencherAdmin = () => {
    setEmail("jaimearedesjr@gmail.com")
    setSenha("125879")
  }

  const preencherMecanico = () => {
    setEmail("carlos@oficina.com")
    setSenha("125879")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] p-4 sm:p-6">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-stone-200">
        {/* Brand Lockup in ThreadWeave Style */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#4338CA] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#0F766E] block mb-1">
            ThreadWeave Atelier
          </span>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Oficina Mecânica
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-xs mx-auto">
            Acesso ao sistema de agendamentos, ordens de serviço e estoque.
          </p>
        </div>

        {estado?.erro && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-[#DC2626] flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>{estado.erro}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              E-mail de Acesso
            </label>
            <input
              name="email"
              type="email"
              placeholder="seu-email@exemplo.com"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              name="password"
              type="password"
              placeholder="Sua senha"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA] transition-all"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={pendente}
            className="w-full py-3 px-4 bg-[#4338CA] hover:bg-[#3730A3] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{pendente ? "Autenticando..." : "Entrar no Sistema"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* ThreadWeave Literary Demonstração Box */}
        <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Acessos Rápidos de Demonstração</span>
            </div>
            <div className="text-[11px] space-y-1">
              <div>
                <span className="font-semibold text-stone-800">Proprietário:</span>{" "}
                <code className="text-[#4338CA]">jaimearedesjr@gmail.com</code> / <code>125879</code>
              </div>
              <div>
                <span className="font-semibold text-stone-800">Mecânico:</span>{" "}
                <code className="text-[#0F766E]">carlos@oficina.com</code> / <code>125879</code>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center text-xs">
            <button
              type="button"
              onClick={preencherAdmin}
              className="text-[#4338CA] hover:underline font-medium cursor-pointer"
            >
              Preencher Proprietário
            </button>
            <span className="text-stone-300">·</span>
            <button
              type="button"
              onClick={preencherMecanico}
              className="text-[#0F766E] hover:underline font-medium cursor-pointer"
            >
              Preencher Mecânico
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
