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

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createProductRoute)
app.register(productsAllRoute)
app.register(productsIdRoute)
app.register(updateProductRoute)
app.register(deleteProductRoute)

app.listen({ port: 3004 }).then(() => {
  console.log('HTTP server running')
})
