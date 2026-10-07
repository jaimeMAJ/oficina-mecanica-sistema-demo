// src/app/(dashboard)/clientes/[id]/editar/page.tsx

import { notFound } from "next/navigation"
import { buscarClientePorId } from "@/services/cliente.service"
import { FormularioEdicaoCliente } from "./formulario"

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cliente = await buscarClientePorId(id)
  if (!cliente) return notFound()

  return <FormularioEdicaoCliente cliente={cliente} />
}