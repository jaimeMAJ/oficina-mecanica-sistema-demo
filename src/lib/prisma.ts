import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"

// In-memory data store for AI Studio environment (when PostgreSQL is not running)
class InMemoryDatabase {
  usuarios: any[] = []
  clientes: any[] = []
  veiculos: any[] = []
  agendamentos: any[] = []
  ordensServico: any[] = []
  itensOrdemServico: any[] = []
  pecas: any[] = []
  gastos: any[] = []
  pagamentos: any[] = []
  fornecedores: any[] = []

  constructor() {
    this.seed()
  }

  seed() {
    const defaultPasswordHash = bcrypt.hashSync("125879", 10)

    this.usuarios = [
      {
        id: "usr-admin-1",
        nome: "Jaime Arêdes",
        email: "jaimearedesjr@gmail.com",
        senhaHash: defaultPasswordHash,
        perfil: "PROPRIETARIO",
        ativo: true,
        criadoEm: new Date("2026-01-01T10:00:00Z"),
      },
      {
        id: "usr-func-1",
        nome: "Carlos Silva (Mecânico)",
        email: "carlos@oficina.com",
        senhaHash: defaultPasswordHash,
        perfil: "FUNCIONARIO",
        ativo: true,
        criadoEm: new Date("2026-01-02T10:00:00Z"),
      },
    ]

    this.clientes = [
      {
        id: "cli-1",
        usuarioId: null,
        nome: "João Pereira",
        telefone: "(11) 98765-4321",
        email: "joao@exemplo.com",
        documento: "123.456.789-00",
        criadoEm: new Date("2026-01-05T09:00:00Z"),
      },
      {
        id: "cli-2",
        usuarioId: null,
        nome: "Maria Oliveira",
        telefone: "(11) 91234-5678",
        email: "maria@exemplo.com",
        documento: "987.654.321-11",
        criadoEm: new Date("2026-01-08T14:30:00Z"),
      },
    ]

    this.veiculos = [
      {
        id: "veic-1",
        clienteId: "cli-1",
        placa: "ABC-1234",
        marca: "Fiat",
        modelo: "Uno 1.0",
        ano: 2018,
        kmAtual: 65000,
        criadoEm: new Date("2026-01-05T09:15:00Z"),
      },
      {
        id: "veic-2",
        clienteId: "cli-2",
        placa: "XYZ-9876",
        marca: "Toyota",
        modelo: "Corolla 2.0",
        ano: 2021,
        kmAtual: 42000,
        criadoEm: new Date("2026-01-08T14:45:00Z"),
      },
    ]

    this.pecas = [
      {
        id: "peca-1",
        nome: "Óleo de Motor 5W30 (Litro)",
        sku: "OLEO-5W30",
        quantidadeEstoque: 24,
        quantidadeMinima: 10,
        valorCusto: 30.0,
        valorVenda: 55.0,
        fornecedorId: null,
      },
      {
        id: "peca-2",
        nome: "Pastilha de Freio Dianteira",
        sku: "PAST-FR-01",
        quantidadeEstoque: 3,
        quantidadeMinima: 5,
        valorCusto: 80.0,
        valorVenda: 160.0,
        fornecedorId: null,
      },
      {
        id: "peca-3",
        nome: "Filtro de Óleo",
        sku: "FILT-OC-02",
        quantidadeEstoque: 15,
        quantidadeMinima: 5,
        valorCusto: 20.0,
        valorVenda: 40.0,
        fornecedorId: null,
      },
    ]

    const hoje = new Date()
    hoje.setHours(10, 0, 0, 0)

    this.agendamentos = [
      {
        id: "ag-1",
        clienteId: "cli-1",
        veiculoId: "veic-1",
        dataHora: new Date(hoje.getTime() + 2 * 3600 * 1000),
        status: "PENDENTE",
        ordemServicoId: null,
        criadoEm: new Date(),
      },
      {
        id: "ag-2",
        clienteId: "cli-2",
        veiculoId: "veic-2",
        dataHora: new Date(hoje.getTime() - 24 * 3600 * 1000),
        status: "CONFIRMADO",
        ordemServicoId: "os-1",
        criadoEm: new Date(),
      },
    ]

    this.ordensServico = [
      {
        id: "os-1",
        veiculoId: "veic-2",
        funcionarioId: "usr-func-1",
        dataAbertura: new Date(hoje.getTime() - 24 * 3600 * 1000),
        dataEntregaPrevista: new Date(hoje.getTime() + 24 * 3600 * 1000),
        status: "EM_EXECUCAO",
        descricaoProblema: "Revisão geral, troca de óleo e checagem de freios.",
        valorTotal: 260.0,
      },
    ]

    this.itensOrdemServico = [
      {
        id: "item-1",
        ordemServicoId: "os-1",
        tipo: "PECA",
        pecaId: "peca-1",
        descricao: "Óleo de Motor 5W30 (Litro)",
        quantidade: 4,
        valorUnitario: 55.0,
      },
      {
        id: "item-2",
        ordemServicoId: "os-1",
        tipo: "MAO_DE_OBRA",
        pecaId: null,
        descricao: "Mão de obra troca de óleo e filtro",
        quantidade: 1,
        valorUnitario: 40.0,
      },
    ]

    this.pagamentos = [
      {
        id: "pag-1",
        ordemServicoId: "os-1",
        valor: 100.0,
        formaPagamento: "PIX",
        data: new Date(hoje.getTime() - 20 * 3600 * 1000),
        status: "PAGO",
      },
    ]

    this.gastos = [
      {
        id: "gasto-1",
        categoria: "PECA",
        descricao: "Compra lote de lubrificantes e filtros",
        valor: 450.0,
        data: new Date(hoje.getTime() - 3 * 24 * 3600 * 1000),
        fornecedorId: null,
        pecaId: null,
      },
      {
        id: "gasto-2",
        categoria: "FERRAMENTA",
        descricao: "Jogo de chaves combinadas",
        valor: 180.0,
        data: new Date(hoje.getTime() - 5 * 24 * 3600 * 1000),
        fornecedorId: null,
        pecaId: null,
      },
    ]
  }

  // Helpers
  private matchWhere(item: any, where?: Record<string, any>): boolean {
    if (!where) return true
    for (const [key, val] of Object.entries(where)) {
      if (val === undefined) continue
      const itemVal = item[key]
      if (typeof val === "object" && val !== null) {
        if ("in" in val && Array.isArray(val.in)) {
          if (!val.in.includes(itemVal)) return false
          continue
        }
        if ("gte" in val || "lte" in val || "gt" in val || "lt" in val) {
          const itemDate = new Date(itemVal).getTime()
          if ("gte" in val && itemDate < new Date(val.gte).getTime()) return false
          if ("lte" in val && itemDate > new Date(val.lte).getTime()) return false
          if ("gt" in val && itemDate <= new Date(val.gt).getTime()) return false
          if ("lt" in val && itemDate >= new Date(val.lt).getTime()) return false
          continue
        }
      }
      if (key === "email" && typeof itemVal === "string" && typeof val === "string") {
        if (itemVal.trim().toLowerCase() !== val.trim().toLowerCase()) return false
        continue
      }
      if (itemVal !== val) return false
    }
    return true
  }

  private sortList(list: any[], orderBy?: Record<string, "asc" | "desc">): any[] {
    if (!orderBy) return list
    const [field, dir] = Object.entries(orderBy)[0] || []
    if (!field) return list
    return [...list].sort((a, b) => {
      const valA = a[field]
      const valB = b[field]
      if (valA < valB) return dir === "desc" ? 1 : -1
      if (valA > valB) return dir === "desc" ? -1 : 1
      return 0
    })
  }

  private enrichItem(item: any, model: string, include?: Record<string, any>): any {
    if (!item || !include) return item ? { ...item } : null
    const result = { ...item }

    if (model === "veiculo") {
      if (!result.criadoEm) result.criadoEm = new Date()
      if (include.cliente) {
        result.cliente = this.clientes.find((c) => c.id === item.clienteId) ?? {
          id: item.clienteId || "removido",
          nome: "Cliente não identificado",
          telefone: null,
          email: null,
          documento: null,
        }
      }
    }

    if (model === "agendamento") {
      if (!result.dataHora) result.dataHora = new Date()
      else if (!(result.dataHora instanceof Date)) result.dataHora = new Date(result.dataHora)
      if (!result.criadoEm) result.criadoEm = new Date()

      if (include.cliente) {
        result.cliente = this.clientes.find((c) => c.id === item.clienteId) ?? {
          id: item.clienteId || "removido",
          nome: "Cliente não identificado",
          telefone: null,
          email: null,
          documento: null,
        }
      }
      if (include.veiculo) {
        const veic = this.veiculos.find((v) => v.id === item.veiculoId) ?? null
        const cliDoVeic = veic
          ? (this.clientes.find((c) => c.id === veic.clienteId) ?? {
              id: veic.clienteId || "removido",
              nome: "Cliente não identificado",
              telefone: null,
              email: null,
            })
          : { id: "removido", nome: "Cliente não identificado", telefone: null, email: null }

        result.veiculo = veic
          ? {
              ...veic,
              cliente: cliDoVeic,
            }
          : {
              id: item.veiculoId || "removido",
              placa: "SEM PLACA",
              marca: "Veículo",
              modelo: "Não localizado",
              cliente: cliDoVeic,
            }
      }
    }

    if (model === "ordemServico") {
      if (!result.dataAbertura) result.dataAbertura = result.criadoEm || new Date()
      else if (!(result.dataAbertura instanceof Date)) result.dataAbertura = new Date(result.dataAbertura)
      if (result.dataEntregaPrevista && !(result.dataEntregaPrevista instanceof Date)) {
        result.dataEntregaPrevista = new Date(result.dataEntregaPrevista)
      }

      if (include.veiculo) {
        const veic = this.veiculos.find((v) => v.id === item.veiculoId) ?? null
        const cliDoVeic = veic
          ? (this.clientes.find((c) => c.id === veic.clienteId) ?? {
              id: veic.clienteId || "removido",
              nome: "Cliente não identificado",
              telefone: null,
              email: null,
            })
          : { id: "removido", nome: "Cliente não identificado", telefone: null, email: null }

        result.veiculo = veic
          ? {
              ...veic,
              cliente: cliDoVeic,
            }
          : {
              id: item.veiculoId || "removido",
              placa: "SEM PLACA",
              marca: "Veículo",
              modelo: "Não localizado",
              cliente: cliDoVeic,
            }
      }
      if (include.funcionario) {
        result.funcionario =
          this.usuarios.find((u) => u.id === item.funcionarioId) ?? null
      }
      if (include.itens) {
        result.itens = this.itensOrdemServico.filter(
          (it) => it.ordemServicoId === item.id
        )
      }
      if (include.pagamentos) {
        result.pagamentos = this.pagamentos
          .filter((p) => p.ordemServicoId === item.id)
          .map((p) => ({
            ...p,
            data: p.data instanceof Date ? p.data : new Date(p.data || Date.now()),
          }))
      }
    }

    if (model === "gasto") {
      if (!result.data) result.data = new Date()
      else if (!(result.data instanceof Date)) result.data = new Date(result.data)
    }

    if (model === "pagamento") {
      if (!result.data) result.data = new Date()
      else if (!(result.data instanceof Date)) result.data = new Date(result.data)
    }

    return result
  }

  createModelHandlers(modelName: string, getList: () => any[], setList: (l: any[]) => void) {
    return {
      findMany: async (args: any = {}) => {
        const list = getList().filter((item) => this.matchWhere(item, args.where))
        const sorted = this.sortList(list, args.orderBy)
        return sorted.map((it) => this.enrichItem(it, modelName, args.include))
      },
      findUnique: async (args: any = {}) => {
        const item = getList().find((it) => this.matchWhere(it, args.where))
        return item ? this.enrichItem(item, modelName, args.include) : null
      },
      findFirst: async (args: any = {}) => {
        const item = getList().find((it) => this.matchWhere(it, args.where))
        return item ? this.enrichItem(item, modelName, args.include) : null
      },
      create: async (args: any = {}) => {
        const now = new Date()
        const defaults: Record<string, any> = {
          id: args.data.id || crypto.randomUUID(),
          criadoEm: now,
        }

        if (modelName === "ordemServico") {
          defaults.dataAbertura = now
          defaults.status = "AGUARDANDO"
          defaults.valorTotal = 0
        } else if (modelName === "agendamento") {
          defaults.status = "PENDENTE"
          defaults.dataHora = args.data.dataHora ? new Date(args.data.dataHora) : now
        } else if (modelName === "pagamento") {
          defaults.data = now
          defaults.status = "PAGO"
        } else if (modelName === "gasto") {
          defaults.data = now
        }

        const newItem = {
          ...defaults,
          ...args.data,
        }

        if (newItem.dataAbertura && !(newItem.dataAbertura instanceof Date)) {
          newItem.dataAbertura = new Date(newItem.dataAbertura)
        }
        if (newItem.dataHora && !(newItem.dataHora instanceof Date)) {
          newItem.dataHora = new Date(newItem.dataHora)
        }
        if (newItem.data && !(newItem.data instanceof Date)) {
          newItem.data = new Date(newItem.data)
        }

        const current = getList()
        setList([...current, newItem])
        return this.enrichItem(newItem, modelName, args.include)
      },
      update: async (args: any = {}) => {
        const current = getList()
        const idx = current.findIndex((it) => this.matchWhere(it, args.where))
        if (idx === -1) {
          throw new Error(`${modelName} não encontrado para atualização`)
        }
        const updated = { ...current[idx] }
        for (const [key, val] of Object.entries(args.data || {})) {
          if (typeof val === "object" && val !== null) {
            if ("increment" in val) {
              updated[key] = (Number(updated[key]) || 0) + Number((val as any).increment)
              continue
            }
            if ("decrement" in val) {
              updated[key] = (Number(updated[key]) || 0) - Number((val as any).decrement)
              continue
            }
          }
          updated[key] = val
        }
        current[idx] = updated
        setList([...current])
        return this.enrichItem(updated, modelName, args.include)
      },
      delete: async (args: any = {}) => {
        const current = getList()
        const idx = current.findIndex((it) => this.matchWhere(it, args.where))
        if (idx === -1) {
          throw new Error(`${modelName} não encontrado para exclusão`)
        }
        const removed = current[idx]
        current.splice(idx, 1)
        setList([...current])

        // Cascading cleanup in memory store
        if (modelName === "cliente") {
          const clienteId = removed.id
          this.veiculos = this.veiculos.filter((v) => v.clienteId !== clienteId)
          this.agendamentos = this.agendamentos.filter((a) => a.clienteId !== clienteId)
        }
        if (modelName === "veiculo") {
          const veiculoId = removed.id
          this.agendamentos = this.agendamentos.filter((a) => a.veiculoId !== veiculoId)
          this.ordensServico = this.ordensServico.filter((os) => os.veiculoId !== veiculoId)
        }
        if (modelName === "ordemServico") {
          const osId = removed.id
          this.itensOrdemServico = this.itensOrdemServico.filter((it) => it.ordemServicoId !== osId)
          this.pagamentos = this.pagamentos.filter((p) => p.ordemServicoId !== osId)
        }

        return removed
      },
      count: async (args: any = {}) => {
        return getList().filter((it) => this.matchWhere(it, args.where)).length
      },
    }
  }
}

const memoryDb = new InMemoryDatabase()

const inMemoryPrismaClient: any = {
  usuario: memoryDb.createModelHandlers("usuario", () => memoryDb.usuarios, (l) => (memoryDb.usuarios = l)),
  cliente: memoryDb.createModelHandlers("cliente", () => memoryDb.clientes, (l) => (memoryDb.clientes = l)),
  veiculo: memoryDb.createModelHandlers("veiculo", () => memoryDb.veiculos, (l) => (memoryDb.veiculos = l)),
  agendamento: memoryDb.createModelHandlers("agendamento", () => memoryDb.agendamentos, (l) => (memoryDb.agendamentos = l)),
  ordemServico: memoryDb.createModelHandlers("ordemServico", () => memoryDb.ordensServico, (l) => (memoryDb.ordensServico = l)),
  itemOrdemServico: memoryDb.createModelHandlers("itemOrdemServico", () => memoryDb.itensOrdemServico, (l) => (memoryDb.itensOrdemServico = l)),
  peca: memoryDb.createModelHandlers("peca", () => memoryDb.pecas, (l) => (memoryDb.pecas = l)),
  gasto: memoryDb.createModelHandlers("gasto", () => memoryDb.gastos, (l) => (memoryDb.gastos = l)),
  pagamento: memoryDb.createModelHandlers("pagamento", () => memoryDb.pagamentos, (l) => (memoryDb.pagamentos = l)),
  fornecedor: memoryDb.createModelHandlers("fornecedor", () => memoryDb.fornecedores, (l) => (memoryDb.fornecedores = l)),

  $transaction: async (cbOrArray: any) => {
    if (typeof cbOrArray === "function") {
      return await cbOrArray(inMemoryPrismaClient)
    }
    if (Array.isArray(cbOrArray)) {
      return await Promise.all(cbOrArray)
    }
    return cbOrArray
  },
  $disconnect: async () => {},
  $connect: async () => {},
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In AI Studio environment without active Postgres server, use the in-memory fallback
const realPrisma: PrismaClient | undefined = undefined

// Export a proxy that delegates to real Prisma if connected, or to inMemoryPrismaClient
export const prisma: PrismaClient = new Proxy(inMemoryPrismaClient, {
  get(target, prop, _receiver) {
    if (realPrisma && prop in realPrisma) {
      return (realPrisma as any)[prop]
    }
    if (prop in target) {
      return target[prop]
    }
    return undefined
  },
}) as PrismaClient

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
