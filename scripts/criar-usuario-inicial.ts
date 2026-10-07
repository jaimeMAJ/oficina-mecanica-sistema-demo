import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const senhaHash = await bcrypt.hash("125879", 10)

  const usuario = await prisma.usuario.create({
    data: {
      nome: "Jaime Arêdes",
      email: "jaimearedesjr@gmail.com",
      senhaHash,
      perfil: "PROPRIETARIO",
    },
  })

  console.log("Usuário criado:", usuario)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())