// src/app/(dashboard)/estoque/[id]/editar/page.tsx

import { notFound } from "next/navigation"
import { buscarPecaPorId } from "@/services/peca.service"
import { FormularioEdicaoPeca } from "./formulario"

export default async function EditarPecaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const peca = await buscarPecaPorId(id)
  if (!peca) return notFound()

  return <FormularioEdicaoPeca peca={peca} />
}