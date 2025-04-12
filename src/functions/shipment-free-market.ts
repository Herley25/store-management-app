import { updateShipmentStatus } from '../services/shipment-status-free-market'

// Função genérica para atualizar o status do envio
const updateStatus = async (
  shipment_id: string,
  status: 'shipped' | 'delivered' | 'not_delivered',
  message: string,
  access_token: string
) => {
  try {
    const [result] = await updateShipmentStatus(
      shipment_id,
      status,
      'null', // Ou outro valor padrão caso necessário
      message,
      access_token
    )
    return result
  } catch (error) {
    console.log(`Erro ao atualizar o status para ${status}`, error)
    throw new Error(`Erro ao atualizar o status para ${status}`)
  }
}

// Marca um pedido como enviado
export const markAsShipped = async (shipment_id: string, access_token: string) => {
  return updateStatus(shipment_id, 'shipped', 'Pedido enviado', access_token)
}

// Marca um pedido como entregue
export const markAsDelivered = async (shipment_id: string, access_token: string) => {
  return updateStatus(shipment_id, 'delivered', 'Pedido entregue', access_token)
}

// Marca um pedido como não entregue
export const markAsNotDelivered = async (shipment_id: string, access_token: string) => {
  return updateStatus(shipment_id, 'not_delivered', 'Pedido não entregue - Devolvido ao remetente', access_token)
}
