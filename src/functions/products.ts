import { eq } from 'drizzle-orm'
import { db } from '../db'
import { products } from '../db/schema'

// Tipo para as informações do produto
export interface ProductInput {
  name: string
  description: string
  category: string
  price_sale: number
  price_cost: number
  stock: number
  sku: string
}

// Função para retornar todos os produtos
export const getAllProducts = async () => {
  try {
    return await db.select().from(products)
  } catch (error) {
    console.error('Erro ao buscar todos os produtos', error)
    throw new Error('Erro ao buscar todos os produtos')
  }
}

// Função para retornar um produto pelo ID
export const getProductById = async (id: string) => {
  try {
    const product = await db.select().from(products).where(eq(products.id, id))
    return product
  } catch (error) {
    console.error('Erro ao buscar produto por ID', error)
    throw new Error('Erro ao buscar produto por ID')
  }
}

// Função para criar um produto
export const createProduct = async (product: ProductInput) => {
  try {
    const [createdProduct] = await db
      .insert(products)
      .values({
        ...product,
        price_sale: product.price_sale.toString(),
        price_cost: product.price_cost.toString(),
        stock: product.stock.toString(),
        sku: product.sku ?? null,
      })
      .returning()

    return createdProduct
  } catch (error) {
    console.error('Erro ao criar o produto', error)
    throw new Error('Erro ao criar o produto')
  }
}

// Função para atualizar um produto
export const updateProduct = async (id: string, product: ProductInput) => {
  try {
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...product,
        price_sale: product.price_sale.toString(),
        price_cost: product.price_cost.toString(),
        stock: product.stock.toString(),
        sku: product.sku ?? null,
      })
      .where(eq(products.id, id))
      .returning()

    return updatedProduct
  } catch (error) {
    console.error('Erro ao atualizar o produto', error)
    throw new Error('Erro ao atualizar o produto')
  }
}

// Função para deletar um produto
export const deleteProduct = async (id: string) => {
  try {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning()

    return deletedProduct
  } catch (error) {
    console.error('Erro ao deletar o produto', error)
    throw new Error('Erro ao deletar o produto')
  }
}
