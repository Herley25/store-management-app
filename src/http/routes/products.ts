import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../../functions/products'
import z from 'zod'

export const productsAllRoute: FastifyPluginAsyncZod = async app => {
  // Rota para retornar todos os produtos
  app.get('/products', async () => {
    return await getAllProducts()
  })
}

// Rota para retornar um produto pelo ID
export const productsIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/products/:id',
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
        const product = await getProductById(id)

        // retorna o produto encontrado
        reply.send(product)
      } catch (error) {
        reply.status(500).send({ error: 'Produto não encontrado' })
      }
    }
  )
}

// Rota para criar um produto
export const createProductRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/products',
    {
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string(),
          category: z.string(),
          price_sale: z.string(),
          price_cost: z.string(),
          stock: z.string(),
          sku: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          name,
          description,
          category,
          price_sale,
          price_cost,
          stock,
          sku,
        } = request.body
        const product = await createProduct({
          name,
          description,
          category,
          price_sale,
          price_cost,
          stock,
          sku,
        })

        reply.send({ product })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao criar produto' })
      }
    }
  )
}

// Rota para atualizar um produto
export const updateProductRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/products/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
          category: z.string(),
          price_sale: z.string(),
          price_cost: z.string(),
          stock: z.string(),
          sku: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const {
          name,
          description,
          category,
          price_sale,
          price_cost,
          stock,
          sku,
        } = request.body

        // chamada para atualizar o produto
        const product = await updateProduct(
          id,
          name,
          description,
          category,
          price_sale,
          price_cost,
          stock,
          sku
        )

        reply.send({ message: 'Produto atualizado com sucesso', product })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao atualizar produto' })
      }
    }
  )
}

export const deleteProductRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/products/:id',
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

        const product = await deleteProduct(id)

        reply.send({ message: 'Produto deletado com sucesso ', product })
      } catch (error) {
        reply.status(500).send({ error: 'Erro ao deletar produto' })
      }
    }
  )
}
