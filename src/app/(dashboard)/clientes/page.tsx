import Link from "next/link"
import { listarClientes } from "@/services/cliente.service"
import { excluirClienteAction } from "./actions"
import { Users, Plus, Edit, Trash2, Phone, Mail } from "lucide-react"

export default async function ClientesPage() {
  const clientes = await listarClientes()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-crimson text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Clientes Cadastrados
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Gestão de proprietários, contatos e veículos vinculados à oficina.
          </p>
        </div>

        <Link
          href="/clientes/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </Link>
      </div>

      {/* Clientes Table */}
      {clientes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 shadow-xs">
          <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-crimson text-xl font-bold text-stone-800">
            Nenhum cliente cadastrado
          </h3>
          <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            Cadastre o primeiro cliente para vincular veículos e emitir ordens de serviço.
          </p>
          <Link
            href="/clientes/novo"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Cliente</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nome / Documento</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4">E-mail</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-stone-900">{cliente.nome}</div>
                      {cliente.documento && (
                        <div className="text-xs text-stone-600 font-mono mt-0.5">
                          CPF/CNPJ: {cliente.documento}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {cliente.telefone ? (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Phone className="w-3.5 h-3.5 text-stone-600" />
                          <span className="font-mono text-xs">{cliente.telefone}</span>
                        </div>
                      ) : (
                        <span className="text-stone-600 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {cliente.email ? (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Mail className="w-3.5 h-3.5 text-stone-600" />
                          <span className="text-xs">{cliente.email}</span>
                        </div>
                      ) : (
                        <span className="text-stone-600 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <Link
                          href={`/clientes/${cliente.id}/editar`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-[#4338CA] hover:bg-stone-100 rounded border border-stone-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>

                        <form action={excluirClienteAction.bind(null, cliente.id)}>
                          <button
                            type="submit"
                            className="p-1 text-stone-600 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Excluir cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
