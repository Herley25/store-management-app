import { db } from '../db'
import { eq } from 'drizzle-orm'
import { orders } from '../db/schema'

// Função para criar um pedido
export const createOrder = async (order: {
  user_id: string
  product_id: string
  quantity: string
  price_total: string
  delivery_address: string
  status: string
  substatus: string
  platform: string
  platform_order_id: string
  tracking_code: string
  shipment_id: string
}) => {
  try {
    const [createOrder] = await db.insert(orders).values(order).returning()

    return createOrder
  } catch (error) {
    console.log('Erro ao criar pedido', error)
    throw new Error('Erro ao criar pedido')
  }
}

// Função para buscar todos os pedidos
export const getAllOrders = async () => {
  try {
    const [allOrders] = await db.select().from(orders)

    return allOrders
  } catch (error) {
    console.log('Erro ao buscar os pedidos', error)
    throw new Error('Erro ao buscar os pedidos')
  }
}

// Função para buscar um pedido
export const getOrderById = async (id: string) => {
  try {
    const [getOrderById] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))

    return getOrderById
  } catch (error) {
    console.log('Erro ao buscar o pedido', error)
    throw new Error('Erro ao buscar o pedido')
  }
}

// Função para atualizar um pedido
export const updateOrder = async (
  id: string,
  user_id: string,
  product_id: string,
  quantity: string,
  price_total: string,
  delivery_address: string,
  status: string,
  platform: string
) => {
  try {
    const [updateOrder] = await db
      .update(orders)
      .set({
        user_id,
        product_id,
        quantity,
        price_total,
        delivery_address,
        status,
        platform,
      })
      .where(eq(orders.id, id))
      .returning()

    return updateOrder
  } catch (error) {
    console.log('Erro ao atualizar o pedido', error)
    throw new Error('Erro ao atualizar o pedido')
  }
}

// Função para deletar um pedido
export const deleteOrder = async (id: string) => {
  try {
    const [deleteOrder] = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning()

    return deleteOrder
  } catch (error) {
    console.log('Erro ao deletar o pedido', error)
    throw new Error('Erro ao deletar o pedido')
  }
}
