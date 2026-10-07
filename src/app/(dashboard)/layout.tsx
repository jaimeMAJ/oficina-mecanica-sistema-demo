import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF9]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
        <footer className="border-t border-stone-200 bg-white/50 py-4 text-center text-xs text-stone-600">
          ThreadWeave Automotive Atelier · Sistema de Gestão Operacional
        </footer>
      </div>
    </div>
  )
}
