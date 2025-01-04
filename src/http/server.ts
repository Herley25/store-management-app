import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import {
  createProductRoute,
  deleteProductRoute,
  productsAllRoute,
  productsIdRoute,
  updateProductRoute,
} from './routes/products'
import {
  createOrderRoute,
  deleteOrderRoute,
  getAllOrdersRoute,
  getOrderByIdRoute,
  updateOrderRoute,
} from './routes/orders'
import {
  createSaleRoute,
  deleteSaleRoute,
  getAllSalesRoute,
  getSaleByIdRoute,
  updateSaleRoute,
} from './routes/sales'
import { shipmentsFreeMarketRoute } from './routes/shipment-free-market'
import {
  createUserRoute,
  deleteUserRoute,
  getAllUsersRoute,
  getUserByIdRoute,
  updateUserRoute,
} from './routes/users'
import {
  balanceSalesRoute,
  getMonthlySalesReportRoute,
  getPaymentHistoryRoute,
  getSalesSummaryRoute,
  getTransactionHistoryRoute,
} from './routes/balance-sales'
import fastifyJwt from '@fastify/jwt'
import { env } from '../env'
import { loginRoute } from './routes/login'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET || '',
})

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    console.log('Token recebido: ', request.headers.authorization)
    await request.jwtVerify()
  } catch (err) {
    console.error('Erro ao verificar o token', err)
    reply.code(401).send({ message: 'Token inválido ou ausente' })
  }
}

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(async publicRoutes => {
  //* Rota de login
  publicRoutes.register(loginRoute)

  //* Rotas de Usuários
  publicRoutes.register(createUserRoute)

  //* Rota para atualizar o status de envio de um pedido
  publicRoutes.register(shipmentsFreeMarketRoute)
})

app.register(async protectedRoutes => {
  protectedRoutes.addHook('preHandler', authenticate)

  //* Rotas de Usuários
  protectedRoutes.register(getAllUsersRoute)
  protectedRoutes.register(getUserByIdRoute)
  protectedRoutes.register(updateUserRoute)
  protectedRoutes.register(deleteUserRoute)

  //* Rotas de produtos
  protectedRoutes.register(createProductRoute)
  protectedRoutes.register(productsAllRoute)
  protectedRoutes.register(productsIdRoute)
  protectedRoutes.register(updateProductRoute)
  protectedRoutes.register(deleteProductRoute)

  //* Rotas de pedidos
  protectedRoutes.register(createOrderRoute)
  protectedRoutes.register(getAllOrdersRoute)
  protectedRoutes.register(getOrderByIdRoute)
  protectedRoutes.register(updateOrderRoute)
  protectedRoutes.register(deleteOrderRoute)

  //* Rotas de vendas
  protectedRoutes.register(createSaleRoute)
  protectedRoutes.register(getAllSalesRoute)
  protectedRoutes.register(getSaleByIdRoute)
  protectedRoutes.register(updateSaleRoute)
  protectedRoutes.register(deleteSaleRoute)

  //* Rota para relatórios e saldo de vendas
  protectedRoutes.register(balanceSalesRoute)
  protectedRoutes.register(getSalesSummaryRoute)
  protectedRoutes.register(getTransactionHistoryRoute)
  protectedRoutes.register(getMonthlySalesReportRoute)
  protectedRoutes.register(getPaymentHistoryRoute)
})

app.listen({ port: 3004 }).then(() => {
  console.log('HTTP server running')
})
