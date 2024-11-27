import axios from 'axios'

// Consulta o status do envio de um pedido
export const getShipmentStatus = async (
  order_id: string,
  access_token: string
) => {
  try {
    const response = await axios.get(
      `https://api.mercadolibre.com/orders/${order_id}/shipments`,
      {
        headers: {
          Authorization: access_token,
        },
      }
    )

    return response.data
  } catch (error) {
    console.log('Erro ao consultar o status do envio', error)
    throw new Error('Erro ao consultar status de envio')
  }
}

// Atualiza o status do envio de um pedido
export const updateShipmentStatus = async (
  shipment_id: string,
  status: 'shipped' | 'delivered' | 'not_delivered',
  substatus: 'null' | 'returning_to_sender',
  comment: string,
  access_token: string
) => {
  try {
    const payload = {
      payload: {
        comment,
        date: new Date().toISOString(),
      },
      status,
      substatus,
    }

    const response = await axios.post(
      `https://api.mercadolibre.com/shipments/${shipment_id}/seller_notifications`,
      payload,
      {
        headers: {
          Authorization: access_token,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.log('Erro ao atualizar o status do envio', error)
    throw new Error('Erro ao atualizar status de envio')
  }
}
