import { db } from '../db'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import bcrypt from 'bcrypt'

// Função para criar um usuário
export const createUser = async (user: {
  username: string
  email: string
  password: string
}) => {
  try {
    const existsUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .then(rows => rows[0]) // Retorna o primeiro usuário encontrado

    if (existsUser) {
      throw new Error('Usuário já existe')
    }

    // Criptografando a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(user.password, 10)

    const [createUser] = await db
      .insert(users)
      .values({ ...user, password: hashedPassword })
      .returning({ id: users.id, username: users.username, email: users.email })

    return createUser
  } catch (error) {
    console.log('Erro ao criar o usuário', error)
    throw new Error('Erro ao criar o usuário')
  }
}

// Função para buscar todos os usuários
export const getAllUsers = async () => {
  try {
    const [allUsers] = await db.select().from(users)

    return allUsers
  } catch (error) {
    console.log('Erro ao buscar os usuários', error)
    throw new Error('Erro ao buscar os usuários')
  }
}

// Função para buscar um usuário
export const getUserById = async (id: string) => {
  try {
    const [getUserById] = await db.select().from(users).where(eq(users.id, id))

    return getUserById
  } catch (error) {
    console.log('Erro ao buscar o usuário', error)
    throw new Error('Erro ao buscar o usuário')
  }
}

// Função para atualizar um usuário
export const updateUser = async (
  id: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const [updateUser] = await db
      .update(users)
      .set({ username, email, password })
      .where(eq(users.id, id))
      .returning()

    return updateUser
  } catch (error) {
    console.log('Erro ao atualizar o usuário', error)
    throw new Error('Erro ao atualizar o usuário')
  }
}

// Função para deletar um usuário
export const deleteUser = async (id: string) => {
  try {
    const [deleteUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    return deleteUser
  } catch (error) {
    console.log('Erro ao deletar o usuário', error)
    throw new Error('Erro ao deletar o usuário')
  }
}
