import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "jaimearedesjr@gmail.com" // troque pelo e-mail do seu usuário
  const novaSenha = "Jaime.1644"   // troque pela nova senha que você quer usar

  const senhaHash = await bcrypt.hash(novaSenha, 10)

  const usuario = await prisma.usuario.update({
    where: { email },
    data: { senhaHash },
  })

  console.log("Senha redefinida para:", usuario.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())