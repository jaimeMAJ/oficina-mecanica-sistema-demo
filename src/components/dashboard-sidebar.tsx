"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Calendar,
  ClipboardList,
  Users,
  Car,
  Package,
  Receipt,
  LogOut,
  Wrench,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { href: "/agenda", label: "Agenda", icon: Calendar, description: "Agendamentos e calendário" },
    { href: "/ordens-servico", label: "Ordens de Serviço", icon: ClipboardList, description: "Serviços em andamento" },
    { href: "/clientes", label: "Clientes", icon: Users, description: "Cadastro e contatos" },
    { href: "/veiculos", label: "Veículos", icon: Car, description: "Frota e histórico" },
    { href: "/estoque", label: "Estoque", icon: Package, description: "Peças e componentes" },
    { href: "/financeiro/gastos", label: "Gastos", icon: Receipt, description: "Despesas e financeiro" },
  ]

  // Close mobile drawer on route change during render
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setIsMobileOpen(false)
  }

  // Close mobile drawer with Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false)
      }
    }

    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMobileOpen])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const isItemActive = (href: string) => {
    if (href === "/agenda") {
      return pathname === "/agenda" || pathname.startsWith("/agenda/")
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* =========================================================================
          MOBILE TOP BAR (Visible only on mobile / screens < md)
          Provides hamburger toggle to open the sidebar drawer
          ========================================================================= */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Abrir menu lateral"
            aria-expanded={isMobileOpen}
            className="p-2 -ml-1 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/agenda" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-crimson text-lg font-bold tracking-tight text-stone-900 leading-none">
                Oficina Mecânica
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-500 mt-0.5">
                ThreadWeave Atelier
              </span>
            </div>
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          title="Sair do sistema"
          aria-label="Sair do sistema"
          className="p-2 text-stone-500 hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* =========================================================================
          MOBILE DRAWER BACKDROP & SLIDE-IN SIDEBAR
          ========================================================================= */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dark Backdrop */}
        <div
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação Principal"
          className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Drawer Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-crimson text-lg font-bold tracking-tight text-stone-900 leading-none">
                  Oficina Mecânica
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-500 mt-0.5">
                  ThreadWeave Atelier
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Fechar menu"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Drawer Navigation List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Módulos do Sistema
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all group ${
                    active
                      ? "bg-[#4338CA] text-white font-semibold shadow-xs"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        active ? "text-white" : "text-stone-500 group-hover:text-stone-800"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="leading-tight">{item.label}</span>
                      <span
                        className={`text-[11px] leading-none mt-0.5 ${
                          active ? "text-indigo-100" : "text-stone-600"
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      active ? "text-white translate-x-0.5" : "text-stone-600 group-hover:text-stone-500"
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* Mobile Drawer Footer User Profile */}
          <div className="p-4 border-t border-stone-200 bg-stone-50/80">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center font-bold text-xs">
                  JA
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-stone-900">Jaime Arêdes</span>
                  <div className="flex items-center gap-1 text-[10px] text-[#0F766E] font-medium">
                    <ShieldCheck className="w-3 h-3 inline" />
                    <span>Proprietário</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:text-[#DC2626] hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer bg-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Sistema</span>
            </button>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          DESKTOP SIDEBAR (Visible on screens >= md)
          Fixed / Sticky Left Sidebar with full height and clean ThreadWeave styling
          ========================================================================= */}
      <aside
        aria-label="Menu Lateral Principal"
        className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-stone-200 shrink-0 sticky top-0 h-screen z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)]"
      >
        {/* Desktop Brand Header */}
        <div className="p-5 border-b border-stone-200">
          <Link href="/agenda" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4338CA] text-white flex items-center justify-center shadow-xs group-hover:scale-102 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-crimson text-2xl font-bold tracking-tight text-stone-900 group-hover:text-[#4338CA] transition-colors leading-none">
                Oficina Mecânica
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-600 mt-1">
                ThreadWeave Atelier
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-stone-200">
          <div className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-600">
            Menu Operacional
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isItemActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? "bg-[#4338CA]/10 text-[#4338CA] font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
                }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-1 bg-[#4338CA] rounded-r-md"
                    aria-hidden="true"
                  />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? "text-[#4338CA]" : "text-stone-500 group-hover:text-stone-700"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate leading-snug">{item.label}</div>
                  <div className="text-[11px] text-stone-600 truncate font-normal leading-tight">
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Desktop Footer Profile & Sign Out */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center font-bold text-xs shrink-0">
                JA
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-stone-900 truncate">Jaime Arêdes</span>
                <div className="flex items-center gap-1 text-[11px] text-[#0F766E] font-medium truncate">
                  <ShieldCheck className="w-3 h-3 shrink-0 inline" />
                  <span>Proprietário</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              title="Sair do sistema"
              className="p-1.5 text-stone-500 hover:text-[#DC2626] hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-center text-stone-600 pt-1 border-t border-stone-200/60 font-medium">
            ThreadWeave v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
