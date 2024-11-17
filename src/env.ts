import z from 'zod'

// É feita uma validação do tipo de cada variável de ambiente que será utilizada
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)