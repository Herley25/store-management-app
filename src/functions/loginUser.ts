import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import bcrypt from 'bcrypt'

// Função para login do usuário
export const loginUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      // Evita dar dica se foi o e-mail ou senha que falhou
      throw new Error('Credenciais inválidas')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error('Credenciais inválidas')
    }

    // Evita retornar senha
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw new Error('Erro interno ao fazer login')
  }
}
