import { updateShipmentStatus } from '../services/shipment-status-free-market'

// Marca um pedido como enviado
export const markAsShipped = async (
  shipment_id: string,
  access_token: string
) => {
  try {
    const [markAsShipped] = await updateShipmentStatus(
      shipment_id,
      'shipped',
      'null',
      'Pedido enviado',
      access_token
    )

    return markAsShipped
  } catch (error) {
    console.log('Erro ao marcar como enviado', error)
    throw new Error('Erro ao marcar como enviado')
  }
}

// Marca um pedido como entregue
export const markAsDelivered = async (
  shipment_id: string,
  access_token: string
) => {
  try {
    const [markAsDelivered] = await updateShipmentStatus(
      shipment_id,
      'delivered',
      'null',
      'Pedido entregue',
      access_token
    )

    return markAsDelivered
  } catch (error) {
    console.log('Erro ao marcar como entregue', error)
    throw new Error('Erro ao marcar como entregue')
  }
}

// Marca um pedido como não entregue
export const markAsNotDelivered = async (
  shipment_id: string,
  access_token: string
) => {
  try {
    const [markAsNotDelivered] = await updateShipmentStatus(
      shipment_id,
      'not_delivered',
      'null',
      'Pedido não entregue - Devolvido ao remetente',
      access_token
    )

    return markAsNotDelivered
  } catch (error) {
    console.log('Erro ao marcar como não entregue', error)
    throw new Error('Erro ao marcar como não entregue')
  }
}
