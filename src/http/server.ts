import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
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

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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

app.listen({ port: 3004 }).then(() => {
  console.log('HTTP server running')
})
