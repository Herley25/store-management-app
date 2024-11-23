import { eq } from 'drizzle-orm'
import { db } from '../db'
import { products } from '../db/schema'

// Função para retornar todos os produtos
export const getAllProducts = async () => {
  return await db.select().from(products)
}

// Função para retornar um produto pelo ID
export const getProductById = async (id: string) => {
  return await db.select().from(products).where(eq(products.id, id))
}

// Função para criar um produto
export const createProduct = async (product: {
  name: string
  description: string
  category: string
  price_sale: string
  price_cost: string
  stock: string
  sku: string
}) => {
  try {
    const [createProduct] = await db
      .insert(products)
      .values(product)
      .returning()

    return createProduct
  } catch (error) {
    console.log('Erro ao criar o produto', error)
    throw new Error('Erro ao criar o produto')
  }
}

// Função para atualizar um produto
export const updateProduct = async (
  id: string,
  name: string,
  description: string,
  category: string,
  price_sale: string,
  price_cost: string,
  stock: string,
  sku: string
) => {
  try {
    const [updateProduct] = await db
      .update(products)
      .set({ name, description, category, price_sale, price_cost, stock, sku })
      .where(eq(products.id, id))
      .returning()

    return updateProduct
  } catch (error) {
    console.log('Erro ao atualizar o produto', error)
    throw new Error('Erro ao atualizar o produto')
  }
}

// Função para deletar um produto
export const deleteProduct = async (id: string) => {
  try {
    const [deleteProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning()

    return deleteProduct
  } catch (error) {
    console.log('Erro ao deletar o produto', error)
    throw new Error('Erro ao deletar o produto')
  }
}
