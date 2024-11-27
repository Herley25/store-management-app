import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Define o schema da tabela usuários
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Define o schema da tabela produtos
export const products = pgTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  price_sale: text('price_sale').notNull(),
  price_cost: text('price_cost').notNull(),
  stock: text('stock').notNull(),
  sku: text('sku').notNull().unique(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Define o schema da tabela vendas
export const sales = pgTable('sales', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  product_id: text('product_id')
    .references(() => products.id)
    .notNull(),
  quantity: text('quantity').notNull(),
  price_total: text('price_total').notNull(),
  platform: text('platform').notNull(),
  date_sale: timestamp('date_sale', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Define o schema da tabela pedidos
export const orders = pgTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  user_id: text('user_id')
    .references(() => users.id)
    .notNull(),
  product_id: text('product_id')
    .references(() => products.id)
    .notNull(),
  quantity: text('quantity').notNull(),
  price_total: text('price_total').notNull(),
  delivery_address: text('delivery_address').notNull(),
  platform: text('platform').notNull(),
  platform_order_id: text('platform_order_id').notNull(), // ID do pedido na plataforma externa
  shipment_id: text('shipment_id').notNull(), // ID do envio (obtido via API)
  tracking_code: text('tracking_code').notNull(), // Código de rastreio
  status: text('status').notNull(),
  substatus: text('substatus').notNull(),
  date_order: timestamp('date_order', { withTimezone: true })
    .notNull()
    .defaultNow(),
  date_update: timestamp('date_update', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
