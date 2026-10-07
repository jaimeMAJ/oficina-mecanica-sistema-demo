export function inicioDoDia(data: Date): Date {
  const d = new Date(data)
  d.setHours(0, 0, 0, 0)
  return d
}

export function fimDoDia(data: Date): Date {
  const d = new Date(data)
  d.setHours(23, 59, 59, 999)
  return d
}

export function inicioDaSemana(data: Date): Date {
  const d = new Date(data)
  const diaSemana = d.getDay()
  d.setDate(d.getDate() - diaSemana)
  return inicioDoDia(d)
}

export function fimDaSemana(data: Date): Date {
  const inicio = inicioDaSemana(data)
  const fim = new Date(inicio)
  fim.setDate(fim.getDate() + 6)
  return fimDoDia(fim)
}

export function adicionarDias(data: Date, dias: number): Date {
  const d = new Date(data)
  d.setDate(d.getDate() + dias)
  return d
}

export function formatarDataParaURL(data: Date): string {
  return data.toISOString().split("T")[0]
}