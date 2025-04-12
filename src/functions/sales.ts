import { db } from '../db'
import { eq } from 'drizzle-orm'
import { sales } from '../db/schema'

// Tipo para as informações da venda
export interface SaleInput {
  product_id: string
  quantity: string
  price_total: string
  platform: string
}

// Função para criar uma venda
export const createSale = async (sale: SaleInput) => {
  try {
    const [createdSale] = await db
      .insert(sales)
      .values(sale)
      .returning()

    return createdSale
  } catch (error) {
    console.error('Erro ao criar a venda', error)
    throw new Error('Erro ao criar a venda')
  }
}

// Função para buscar todas as vendas
export const getAllSales = async () => {
  try {
    const allSales = await db.select().from(sales)
    return allSales
  } catch (error) {
    console.error('Erro ao buscar todas as vendas', error)
    throw new Error('Erro ao buscar todas as vendas')
  }
}

// Função para buscar uma venda por ID
export const getSaleById = async (id: string) => {
  try {
    const sale = await db
      .select()
      .from(sales)
      .where(eq(sales.id, id))
      .then(results => results[0]) // Garantir que retorne apenas um único item

    return sale
  } catch (error) {
    console.error('Erro ao buscar a venda por ID', error)
    throw new Error('Erro ao buscar a venda por ID')
  }
}

// Função para atualizar uma venda
export const updateSale = async (id: string, sale: SaleInput) => {
  try {
    const [updatedSale] = await db
      .update(sales)
      .set(sale)
      .where(eq(sales.id, id))
      .returning()

    return updatedSale
  } catch (error) {
    console.error('Erro ao atualizar a venda', error)
    throw new Error('Erro ao atualizar a venda')
  }
}

// Função para deletar uma venda
export const deleteSale = async (id: string) => {
  try {
    const [deletedSale] = await db
      .delete(sales)
      .where(eq(sales.id, id))
      .returning()

    return deletedSale
  } catch (error) {
    console.error('Erro ao deletar a venda', error)
    throw new Error('Erro ao deletar a venda')
  }
}
