import { db } from '../db'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import bcrypt from 'bcrypt'

// Função genérica para buscar um usuário por ID
const getUserByIdGeneric = async (id: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  return user
}

// Função genérica para atualizar um usuário
const updateUserGeneric = async (id: string, updateData: object) => {
  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning()
  return updatedUser
}

// Função genérica para deletar um usuário
const deleteUserGeneric = async (id: string) => {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning()
  return deletedUser
}


// Função para verificar se o usuário já existe
const userExists = async (email: string) => {
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  return exists.length > 0
}

// Função para criptografar a senha
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

// Função para criar um usuário
export const createUser = async (user: {
  username: string
  email: string
  password: string
}) => {
  try {
    if (await userExists(user.email)) {
      throw new Error('Usuário já existe')
    }

    // Criptografando a senha antes de salvar no banco de dados
    const hashedPassword = await hashPassword(user.password)

    const [createUser] = await db
      .insert(users)
      .values({
        username: user.username,
        email: user.email,
        password: hashedPassword,
      })
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
    const allUsers = await db.select().from(users)
    return allUsers
  } catch (error) {
    console.log('Erro ao buscar os usuários', error)
    throw new Error('Erro ao buscar os usuários')
  }
}

// Função para buscar um usuário
export const getUserById = async (id: string) => {
  try {
    return await getUserByIdGeneric(id)
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
    // Se a senha for modificada, criptografa a nova senha
    const updatedData = password
      ? { username, email, password: await hashPassword(password) }
      : { username, email }

    return await updateUserGeneric(id, updatedData)
  } catch (error) {
    console.log('Erro ao atualizar o usuário', error)
    throw new Error('Erro ao atualizar o usuário')
  }
}

// Função para deletar um usuário
export const deleteUser = async (id: string) => {
  try {
    return await deleteUserGeneric(id)
  } catch (error) {
    console.log('Erro ao deletar o usuário', error)
    throw new Error('Erro ao deletar o usuário')
  }
}
