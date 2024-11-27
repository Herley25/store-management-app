import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getShipmentStatus } from '../../services/shipment-status-free-market'
import {
  markAsDelivered,
  markAsNotDelivered,
  markAsShipped,
} from '../../functions/shipment-free-market'

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
          status: z.string(),
          tracking_code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const access_token = 'access_token'

      try {
        const { id } = request.params
        const { status, tracking_code } = request.body

        const shipment_info = await getShipmentStatus(id, access_token)
        const shipment_id = shipment_info.id

        if (status === 'shipped') {
          await markAsShipped(shipment_id, access_token)
        } else if (status === 'delivered') {
          await markAsDelivered(shipment_id, access_token)
        } else if (status === 'not_delivered') {
          await markAsNotDelivered(shipment_id, access_token)
        }

        reply.send({ message: 'Status do envio atualizado com sucesso' })
      } catch (error) {
        reply.status(500).send(error)
      }
    }
  )
}
