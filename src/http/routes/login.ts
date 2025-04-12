import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { loginUser } from '../../functions/loginUser'

// Rota para fazer login
export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body

        const login = await loginUser({ email, password })

        // Gerar o token JWT
        const token = app.jwt.sign(
          { id: login.id, email: login.email },
          { expiresIn: '1h' }
        )

        // Retornar o token JWT e os dados do usuário
        reply.send({ token, user: login })
      } catch (error) {
        console.log('Erro ao fazer login', error)
        reply.status(401).send({
          message: 'Erro ao fazer login',
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }
  )
}

//! refresh token opcional
// CREATE TABLE refresh_tokens (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER NOT NULL REFERENCES users(id),
//   token TEXT NOT NULL,
//   expires_at TIMESTAMP NOT NULL
// );

// const refreshTokenDuration = '7d';

// app.post('/login', async (request, reply) => {
//   const { email, password } = request.body;

//   try {
//     // ... validação do usuário

//     // Gera o access token
//     const accessToken = app.jwt.sign({ id: user.id }, { expiresIn: '1h' });

//     // Gera o refresh token
//     const refreshToken = app.jwt.sign({ id: user.id }, { expiresIn: refreshTokenDuration });

//     // Salva o refresh token no banco
//     await db.insert(refresh_tokens).values({
//       user_id: user.id,
//       token: refreshToken,
//       expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
//     });

//     reply.send({ accessToken, refreshToken });
//   } catch (error) {
//     reply.status(500).send({ message: 'Erro interno' });
//   }
// });

// app.post('/refresh', async (request, reply) => {
//     const { refreshToken } = request.body;

//     try {
//       const decoded = app.jwt.verify(refreshToken);

//       Verifica o refresh token no banco
//       const tokenExists = await db
//         .select()
//         .from(refresh_tokens)
//         .where(eq(refresh_tokens.token, refreshToken))
//         .first();

//       if (!tokenExists) {
//         return reply.status(401).send({ message: 'Token inválido ou expirado' });
//       }

//       Gera um novo access token
//       const newAccessToken = app.jwt.sign({ id: decoded.id }, { expiresIn: '1h' });

//       reply.send({ accessToken: newAccessToken });
//     } catch (error) {
//       reply.status(401).send({ message: 'Token inválido ou expirado' });
//     }
