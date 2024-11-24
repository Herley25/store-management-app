import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from '../../functions/orders'
import z from 'zod'

// Rota para criar um pedido
export const createOrderRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/orders',
    {
      schema: {
        body: z.object({
          user_id: z.string(),
          product_id: z.string(),
          quantity: z.string(),
          price_total: z.string(),
          delivery_address: z.string(),
          status: z.string(),
          platform: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          user_id,
          product_id,
          quantity,
          price_total,
          delivery_address,
          status,
          platform,
        } = request.body

        const order = await createOrder({
          user_id,
          product_id,
          quantity,
          price_total,
          delivery_address,
          status,
          platform,
        })

        reply.send({ order })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao criar pedido' })
      }
    }
  )
}

// Rota para buscar todos os pedidos
export const getAllOrdersRoute: FastifyPluginAsyncZod = async app => {
  app.get('/orders', async (request, reply) => {
    try {
      const orders = await getAllOrders()

      reply.send({ orders })
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao buscar pedidos' })
    }
  })
}

// Rota para buscar um pedido
export const getOrderByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/orders/:id',
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
        const order = await getOrderById(id)

        reply.send({ order })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao buscar pedido' })
      }
    }
  )
}

// Rota para atualizar um pedido
export const updateOrderRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/orders/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          user_id: z.string(),
          product_id: z.string(),
          quantity: z.string(),
          price_total: z.string(),
          delivery_address: z.string(),
          status: z.string(),
          platform: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const {
          user_id,
          product_id,
          quantity,
          price_total,
          delivery_address,
          status,
          platform,
        } = request.body

        const order = await updateOrder(
          id,
          user_id,
          product_id,
          quantity,
          price_total,
          delivery_address,
          status,
          platform
        )

        reply.send({ order })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao atualizar pedido' })
      }
    }
  )
}

// Rota para deletar um pedido
export const deleteOrderRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/orders/:id',
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
        const order = await deleteOrder(id)

        reply.send({ order })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao deletar pedido' })
      }
    }
  )
}
