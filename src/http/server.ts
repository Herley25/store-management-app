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
// import { loginRoute, logoutRoute } from './routes/login'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET || '',
})

// app.decorate(
//   'authenticate',
//   async (request: FastifyRequest, reply: FastifyReply) => {
//     try {
//       await request.jwtVerify()
//     } catch (err) {
//       reply.status(401).send({ message: 'Não autorizado' })
//     }
//   }
// )

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//* Rota de login
// app.register(loginRoute)
// app.register(logoutRoute)

//* Rotas de Usuários
app.register(createUserRoute)
app.register(getAllUsersRoute)
app.register(getUserByIdRoute)
app.register(updateUserRoute)
app.register(deleteUserRoute)

//* Rotas de produtos
app.register(createProductRoute)
app.register(productsAllRoute)
app.register(productsIdRoute)
app.register(updateProductRoute)
app.register(deleteProductRoute)

//* Rotas de pedidos
app.register(createOrderRoute)
app.register(getAllOrdersRoute)
app.register(getOrderByIdRoute)
app.register(updateOrderRoute)
app.register(deleteOrderRoute)

//* Rotas de vendas
app.register(createSaleRoute)
app.register(getAllSalesRoute)
app.register(getSaleByIdRoute)
app.register(updateSaleRoute)
app.register(deleteSaleRoute)

//* Rota para atualizar o status de envio de um pedido
app.register(shipmentsFreeMarketRoute)

//* Rota para relatórios e saldo de vendas
app.register(balanceSalesRoute)
app.register(getSalesSummaryRoute)
app.register(getTransactionHistoryRoute)
app.register(getMonthlySalesReportRoute)
app.register(getPaymentHistoryRoute)

app.listen({ port: 3004 }).then(() => {
  console.log('HTTP server running')
})
