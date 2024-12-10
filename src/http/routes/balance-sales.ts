import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  balanceSales,
  getMonthlySalesReport,
  getPaymentHistory,
  getSalesSummary,
  getTransactionHistory,
} from '../../functions/balance-sales'
import z from 'zod'

// Rota para o saldo atualizado de vendas
export const balanceSalesRoute: FastifyPluginAsyncZod = async app => {
  app.get('/balance-sales', async (request, reply) => {
    try {
      const balance = await balanceSales()

      reply.send({ balance })
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao buscar saldo de vendas' })
    }
  })
}

// Rota para o resumo de vendas (lucros, comissões e custos)
export const getSalesSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/sales-summary', async (request, reply) => {
    try {
      const summary = await getSalesSummary()

      reply.send({ summary })
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao buscar resumo de vendas' })
    }
  })
}

// Rota para o histórico de transações e pagamentos
export const getTransactionHistoryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/transaction-history', async (request, reply) => {
    try {
      const history = await getTransactionHistory()

      reply.send({ history })
    } catch (error) {
      reply
        .status(500)
        .send({ error: 'Erro ao buscar histórico de transações' })
    }
  })
}

// Rota para o relatório mensal de vendas
export const getMonthlySalesReportRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/monthly-sales-report',
    {
      schema: {
        querystring: z.object({
          month: z.string().transform(val => Number(val)),
          year: z.string().transform(val => Number(val)),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { month, year } = request.query
        const monthlySales = await getMonthlySalesReport(month, year)

        reply.send({ monthlySales })
      } catch (error) {
        reply
          .status(500)
          .send({ error: 'Erro ao buscar relatório mensal de vendas' })
      }
    }
  )
}

// Rota para o histórico de pagamentos
export const getPaymentHistoryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/payment-history', async (request, reply) => {
    try {
      const history = await getPaymentHistory()

      reply.send({ history })
    } catch (error) {
      reply
        .status(500)
        .send({ error: 'Erro ao buscar histórico de pagamentos' })
    }
  })
}
