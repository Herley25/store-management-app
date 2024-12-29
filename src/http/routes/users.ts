import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import '@fastify/jwt'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../../functions/users'

// Rota para criar um usuário
export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          username: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { username, email, password } = request.body

        const user = await createUser({ username, email, password })

        // Gerar o token JWT
        const token = app.jwt.sign({ id: user.id, email: user.email })

        reply.send({ user, token })
      } catch (error) {
        console.error('Erro ao criar o usuário:', error)

        reply.status(500).send({
          message: 'Erro interno ao criar o usuário',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}

// Rota para buscar todos os usuários
export const getAllUsersRoute: FastifyPluginAsyncZod = async app => {
  app.get('/users', async (request, reply) => {
    try {
      const users = await getAllUsers()

      console.log('USUÁRIOS ENCONTRADOS:', users)

      reply.send({ users })
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error)

      reply.status(500).send({
        message: 'Erro interno ao buscar os usuários',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  })
}

// Rota para buscar um usuário
export const getUserByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const user = await getUserById(id)

        reply.send({ user })
      } catch (error) {
        console.error('Erro ao buscar o usuário:', error)

        reply.status(500).send({
          message: 'Erro interno ao buscar o usuário',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}

// Rota para atualizar um usuário
export const updateUserRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/users/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          username: z.string(),
          email: z.string(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { username, email, password } = request.body

        const user = await updateUser(id, username, email, password)

        reply.send({ user })
      } catch (error) {
        console.error('Erro ao atualizar o usuário:', error)

        reply.status(500).send({
          message: 'Erro interno ao atualizar o usuário',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}

// Rota para deletar um usuário
export const deleteUserRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/users/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const user = await deleteUser(id)

        reply.send({ message: 'Usuário deletado com sucesso', user })
      } catch (error) {
        console.error('Erro ao deletar o usuário:', error)

        reply.status(500).send({
          message: 'Erro interno ao deletar o usuário',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}
