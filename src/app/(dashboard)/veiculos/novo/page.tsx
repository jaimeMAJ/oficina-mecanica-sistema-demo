// src/app/(dashboard)/veiculos/novo/page.tsx

import { listarClientes } from "@/services/cliente.service"
import { FormularioNovoVeiculo } from "./formulario"

export default async function NovoVeiculoPage() {
  const clientes = await listarClientes()

  return <FormularioNovoVeiculo clientes={clientes} />
}