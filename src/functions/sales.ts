import { db } from '../db'
import { eq } from 'drizzle-orm'
import { sales } from '../db/schema'

// Função para criar uma venda
export const createSale = async (sale: {
  product_id: string
  quantity: string
  price_total: string
  platform: string
}) => {
  try {
    const [createSale] = await db.insert(sales).values(sale).returning()

    return createSale
  } catch (error) {
    console.log('Erro ao criar a venda', error)
    throw new Error('Erro ao criar a venda')
  }
}

// Função para buscar todas as vendas
export const getAllSales = async () => {
  try {
    const [allSales] = await db.select().from(sales)

    return allSales
  } catch (error) {
    console.log('Erro ao buscar as vendas', error)
    throw new Error('Erro ao buscar as vendas')
  }
}

// Função para buscar uma venda
export const getSaleById = async (id: string) => {
  try {
    const [getProductById] = await db
      .select()
      .from(sales)
      .where(eq(sales.id, id))

    return getProductById
  } catch (error) {
    console.log('Erro ao buscar a venda', error)
    throw new Error('Erro ao buscar a venda')
  }
}

// Função para atualizar uma venda
export const updateSale = async (
  id: string,
  product_id: string,
  quantity: string,
  price_total: string,
  platform: string
) => {
  try {
    const [updateSale] = await db
      .update(sales)
      .set({ product_id, quantity, price_total, platform })
      .where(eq(sales.id, id))
      .returning()

    return updateSale
  } catch (error) {
    console.log('Erro ao atualizar a venda', error)
    throw new Error('Erro ao atualizar a venda')
  }
}

// Função para deletar uma venda
export const deleteSale = async (id: string) => {
  try {
    const [deleteSale] = await db
      .delete(sales)
      .where(eq(sales.id, id))
      .returning()

    return deleteSale
  } catch (error) {
    console.log('Erro ao deletar a venda', error)
    throw new Error('Erro ao deletar a venda')
  }
}
