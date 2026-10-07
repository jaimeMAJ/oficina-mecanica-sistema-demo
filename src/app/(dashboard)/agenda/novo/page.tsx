// src/app/(dashboard)/agenda/novo/page.tsx

import { listarClientes } from "@/services/cliente.service"
import { FormularioNovoAgendamento } from "./formulario"

export default async function NovoAgendamentoPage() {
  const clientes = await listarClientes()
  return <FormularioNovoAgendamento clientes={clientes} />
}