import { db } from '../db'
import { eq } from 'drizzle-orm'
import { products } from '../db/schema'

// Atualiza o estoque após uma venda
export const updateStockAfterSale = async (
  product_id: string,
  quantity_sold: number
) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, product_id))

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const currentStock = Number(product.stock)
    if (isNaN(currentStock)) {
      throw new Error('Estoque atual inválido')
    }

    const newStock = currentStock - quantity_sold
    if (newStock < 0) {
      throw new Error('Estoque insuficiente para a venda')
    }

    const [updateProduct] = await db
      .update(products)
      .set({ stock: newStock.toString() })
      .where(eq(products.id, product_id))
      .returning()

    return updateProduct
  } catch (error) {
    console.error('Erro ao atualizar o estoque:', error)
    throw new Error('Erro ao atualizar o estoque')
  }
}

// Notifica se o estoque estiver baixo
export const notifyLowStock = async (product_id: string) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, product_id))
      .limit(1)
      .execute()

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const stock = Number(product.stock)
    if (isNaN(stock)) {
      throw new Error('Estoque inválido')
    }

    if (stock < 5) {
      // Aqui futuramente pode integrar com e-mail, Discord, etc.
      console.warn(`⚠️ Produto "${product.name}" com estoque baixo (${stock})`)
    }
  } catch (error) {
    console.error('Erro ao notificar estoque baixo:', error)
    throw new Error('Erro ao notificar estoque baixo')
  }
}
