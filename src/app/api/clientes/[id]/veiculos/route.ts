import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const veiculos = await prisma.veiculo.findMany({
    where: { clienteId: id },
  })
  return NextResponse.json(veiculos)
}