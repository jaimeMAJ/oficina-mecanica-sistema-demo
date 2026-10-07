"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { veiculoSchema } from "@/validations/veiculo.schema"
import { criarVeiculo, atualizarVeiculo, excluirVeiculo } from "@/services/veiculo.service"

export type EstadoFormulario = {
  erro?: string
} | null

export async function criarVeiculoAction(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = veiculoSchema.safeParse({
    clienteId: formData.get("clienteId"),
    placa: formData.get("placa"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    ano: formData.get("ano"),
    kmAtual: formData.get("kmAtual"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  try {
    await criarVeiculo(resultado.data)
  } catch (e: any) {
    if (e.code === "P2002") {
      return { erro: "Já existe um veículo cadastrado com essa placa" }
    }
    return { erro: "Erro ao salvar veículo" }
  }

  revalidatePath("/veiculos")
  redirect("/veiculos")
}

export async function atualizarVeiculoAction(
  id: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = veiculoSchema.safeParse({
    clienteId: formData.get("clienteId"),
    placa: formData.get("placa"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    ano: formData.get("ano"),
    kmAtual: formData.get("kmAtual"),
  })

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message }
  }

  try {
    await atualizarVeiculo(id, resultado.data)
  } catch (e: any) {
    if (e.code === "P2002") {
      return { erro: "Já existe um veículo cadastrado com essa placa" }
    }
    return { erro: "Erro ao salvar veículo" }
  }

  revalidatePath("/veiculos")
  redirect("/veiculos")
}

export async function excluirVeiculoAction(id: string) {
  await excluirVeiculo(id)
  revalidatePath("/veiculos")
}