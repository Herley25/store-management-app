import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  createSale,
  deleteSale,
  getAllSales,
  getSaleById,
  updateSale,
} from '../../functions/sales'

// Rota para criar uma venda
export const createSaleRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/sales',
    {
      schema: {
        body: z.object({
          product_id: z.string(),
          quantity: z.string(),
          price_total: z.string(),
          platform: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { product_id, quantity, price_total, platform } = request.body
        const sale = await createSale({
          product_id,
          quantity,
          price_total,
          platform,
        })

        reply.send({ sale })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao criar venda' })
      }
    }
  )
}

// Rota para buscar todas as vendas
export const getAllSalesRoute: FastifyPluginAsyncZod = async app => {
  app.get('/sales', async (request, reply) => {
    try {
      const sales = await getAllSales()

      reply.send({ sales })
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao buscar vendas' })
    }
  })
}

// Rota para buscar uma venda
export const getSaleByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/sales/:id',
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
        const sale = await getSaleById(id)

        reply.send({ sale })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao buscar venda' })
      }
    }
  )
}

// Rota para atualizar uma venda
export const updateSaleRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/sales/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          product_id: z.string(),
          quantity: z.string(),
          price_total: z.string(),
          platform: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { product_id, quantity, price_total, platform } = request.body

        const sale = await updateSale(
          id,
          product_id,
          quantity,
          price_total,
          platform
        )

        reply.send({ sale })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao atualizar venda' })
      }
    }
  )
}

// Rota para deletar uma venda
export const deleteSaleRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/sales/:id',
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
        const sale = await deleteSale(id)

        reply.send({ sale })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao deletar venda' })
      }
    }
  )
}
