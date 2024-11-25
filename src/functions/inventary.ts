import { db } from '../db'
import { eq } from 'drizzle-orm'
import { products } from '../db/schema'

// Função para atualizar o estoque após uma venda
export const updateStockAfterSale = async (
  product_id: string,
  quantity_sold: number
) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, product_id))

    const stock = Number(product.stock) - quantity_sold

    const [updateProduct] = await db
      .update(products)
      .set({ stock: stock.toString() })
      .where(eq(products.id, product_id))
      .returning()

    return updateProduct
  } catch (error) {
    console.log('Erro ao atualizar o estoque', error)
    throw new Error('Erro ao atualizar o estoque')
  }
}

// Função para notificar estoque baixo
export const notifyLowStock = async (product_id: string) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, product_id))
      .limit(1)
      .execute()

    if (product && Number(product.stock) < 5) {
      console.log(`Produto ${product.name} com estoque baixo`)
    }
  } catch (error) {
    console.log('Erro ao notificar estoque baixo', error)
    throw new Error('Erro ao notificar estoque baixo')
  }
}
