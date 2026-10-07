// src/app/(dashboard)/ordens-servico/novo/page.tsx

import { listarVeiculos } from "@/services/veiculo.service"
import { listarFuncionarios } from "@/services/ordem-servico.service"
import { FormularioNovaOS } from "./formulario"

export default async function NovaOrdemServicoPage() {
  const [veiculos, funcionarios] = await Promise.all([
    listarVeiculos(),
    listarFuncionarios(),
  ])

  return <FormularioNovaOS veiculos={veiculos} funcionarios={funcionarios} />
}