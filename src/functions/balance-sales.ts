import { db } from '../db'
import { eq, sql, desc, sum } from 'drizzle-orm'
import { products, sales } from '../db/schema'

// Função para obter o saldo de vendas
export const balanceSales = async () => {
  try {
    const [balanceSales] = await db
      .select({
        product_id: sales.product_id,
        total_sales: sum(
          sql`${sales.quantity}::NUMERIC * ${sales.price_total}::NUMERIC`
        ),
      })
      .from(sales)
      .groupBy(sales.product_id)

    return balanceSales
  } catch (error) {
    console.log('Erro ao buscar o saldo de vendas', error)
    throw new Error('Erro ao buscar o saldo de vendas')
  }
}

// Função para exibir lucros, comissões e custos por vendas
export const getSalesSummary = async () => {
  try {
    const [summary] = await db
      .select({
        product_id: sales.product_id,
        product_name: products.name,
        price_sale: products.price_sale,
        price_cost: products.price_cost,
        profit: sql`${products.price_sale}::NUMERIC - ${products.price_cost}::NUMERIC`,
      })
      .from(sales)
      .innerJoin(products, eq(sales.product_id, products.id))

    return summary
  } catch (error) {
    console.log('Erro ao buscar as vendas', error)
    throw new Error('Erro ao buscar as vendas')
  }
}

// Função para obter o histórico de transações e pagamentos
export const getTransactionHistory = async () => {
  try {
    const [history] = await db
      .select()
      .from(sales)
      .orderBy(desc(sales.date_sale))

    return history
  } catch (error) {
    console.log('Erro ao buscar o histórico de transações', error)
    throw new Error('Erro ao buscar o histórico de transações')
  }
}

// Função para relatório mensal de vendas
export const getMonthlySalesReport = async (month: number, year: number) => {
  try {
    const [monthlySales] = await db
      .select({
        product_name: products.name,
        total_sales: sum(sql`${sales.quantity}::NUMERIC`),
      })
      .from(sales)
      .innerJoin(products, eq(sales.product_id, products.id))
      .where(
        sql`EXTRACT(MONTH FROM ${sales.date_sale}) = ${month} AND EXTRACT(YEAR FROM ${sales.date_sale}) = ${year}`
      )
      .groupBy(products.name)

    return monthlySales
  } catch (error) {
    console.log('Erro ao buscar o relatório mensal de vendas', error)
    throw new Error('Erro ao buscar o relatório mensal de vendas')
  }
}

// Função para obter histórico de pagamentos e saldos pendentes
export const getPaymentHistory = async () => {
  try {
    const [paymentHistory] = await db
      .select({
        product_name: products.name,
        total_sales: sum(sql`${sales.quantity}::NUMERIC`),
        total_payment: sum(sql`${sales.price_total}::NUMERIC`),
        pending_payment: sum(
          sql`${sales.price_total}::NUMERIC - ${sales.quantity}::NUMERIC`
        ),
      })
      .from(sales)
      .innerJoin(products, eq(sales.product_id, products.id))
      .groupBy(products.name)

    return paymentHistory
  } catch (error) {
    console.log('Erro ao buscar o histórico de pagamentos', error)
    throw new Error('Erro ao buscar o histórico de pagamentos')
  }
}

// Função para obter histórico de pagamentos e saldos por plataforma
export const getPlatformPaymentHistory = async () => {
  try {
    const [platformPaymentHistory] = await db
      .select({
        platform: sales.platform,
        total_sales: sum(sql`${sales.quantity}::NUMERIC`),
        total_payment: sum(sql`${sales.price_total}::NUMERIC`),
        pending_payment: sum(
          sql`${sales.price_total}::NUMERIC - ${sales.quantity}::NUMERIC`
        ),
      })
      .from(sales)
      .groupBy(sales.platform)

    return platformPaymentHistory
  } catch (error) {
    console.log(
      'Erro ao buscar o histórico de pagamentos por plataforma',
      error
    )
    throw new Error('Erro ao buscar o histórico de pagamentos por plataforma')
  }
}
