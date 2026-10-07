// src/app/(dashboard)/financeiro/gastos/[id]/editar/page.tsx

import { notFound } from "next/navigation"
import { buscarGastoPorId } from "@/services/gasto.service"
import { FormularioEdicaoGasto } from "./formulario"

export default async function EditarGastoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const gasto = await buscarGastoPorId(id)
  if (!gasto) return notFound()

  return <FormularioEdicaoGasto gasto={{ ...gasto, valor: Number(gasto.valor) }} />
}