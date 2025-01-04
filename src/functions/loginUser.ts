import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

// Função para fazer login
export const loginUser = async ({
  email,
  password,
}: { email: string; password: string }) => {
  try {
    const bcrypt = require('bcrypt')
    // Buscando o usuário no banco de dados
    const userArray = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    console.log('usuário encontrado: ', userArray)

    const user = userArray[0]
    if (!user) {
      console.log('Usuário não encontrado para o email: ', email)
      throw new Error('Credenciais inválidas')
    }

    console.log('Verificando a senha do usuário ...')
    // Verificando se a senha é válida
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Senha válida: ', isValidPassword)
    if (!isValidPassword) {
      console.log('Senha incorreta para o usuário: ', user.email)
      throw new Error('Credenciais inválidas')
    }

    return user
  } catch (error) {
    console.error('Erro ao fazer login', error)
    throw new Error('Erro interno ao fazer login')
  }
}
