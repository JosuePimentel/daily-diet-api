import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
import { compareSync } from 'bcrypt';
import { env } from '../env';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function AuthRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string()
      })
    }
  }, async (req, res) => {
    const { email, password } = req.body;

    const userFound = await database('users')
      .select('id', 'email', 'password')
      .where('email', email)
      .first();
    
    if (!userFound) {
      res.status(404).send({ error: `usuario com email '${email}' não encontrado` });
    }

    if (!compareSync(password, userFound!.password)) {
      res.status(401).send({ error: 'senha incorreta' });
    }

    const token = app.jwt.sign({ sub: userFound!.id, email: userFound!.email  });

    res.cookie('token', token, {
      path: '/',
      maxAge: env!.JWT_EXPIRATION_TIME
    });

    res.send(200);
  });

  app.get('/logout', (_req, res) => {
    res.clearCookie('token', { path: '/' }).send(200);
  });

}