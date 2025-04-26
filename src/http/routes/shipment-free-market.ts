import { getShipmentStatus } from '../../services/shipment-status-free-market'
import {
  markAsDelivered,
  markAsNotDelivered,
  markAsShipped,
} from '../../functions/shipment-free-market'
import { env } from '../../env'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

// Rota para atualizar o status de envio de um pedido
export const shipmentsFreeMarketRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/orders/:id/shipment-status',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          status: z.enum(['shipped', 'delivered', 'not_delivered']),
          tracking_code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const access_token = env.ACCESS_TOKEN_MARKET_FREE

      if (!access_token) {
        return reply.status(500).send({
          message: 'Token de acesso do mercado livre não configurado',
        })
      }

      try {
        const { id } = request.params
        const { status, tracking_code } = request.body

        // Consulta o status do envio para obter o ID do envio
        const shipment_info = await getShipmentStatus(id, access_token)
        if (!shipment_info || !shipment_info.id) {
          return reply
            .status(404)
            .send({ message: 'Informações de envio não encontradas' })
        }
        const shipment_id = shipment_info.id

        // Atualiza o status do envio com base no status enviado
        switch (status) {
          case 'shipped':
            await markAsShipped(shipment_id, access_token)
            break
          case 'delivered':
            await markAsDelivered(shipment_id, access_token)
            break
          case 'not_delivered':
            await markAsNotDelivered(shipment_id, access_token)
            break
        }

        return reply.send({
          message: `Status do envio atualizado para '${status}' com sucesso.`,
          shipment_id,
          status,
        })
      } catch (error) {
        console.error('Erro ao atualizar status do envio:', error)

        return reply.status(500).send({
          message: 'Erro interno ao atualizar status do envio',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}
