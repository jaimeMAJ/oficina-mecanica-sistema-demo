// src/app/(dashboard)/veiculos/[id]/editar/page.tsx

import { notFound } from "next/navigation"
import { buscarVeiculoPorId } from "@/services/veiculo.service"
import { listarClientes } from "@/services/cliente.service"
import { FormularioEdicaoVeiculo } from "./formulario"

export default async function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [veiculo, clientes] = await Promise.all([
    buscarVeiculoPorId(id),
    listarClientes(),
  ])

  if (!veiculo) return notFound()

  return <FormularioEdicaoVeiculo veiculo={veiculo} clientes={clientes} />
}