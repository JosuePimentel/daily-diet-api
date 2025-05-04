import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
import { compareSync } from 'bcrypt';
import { env } from '../env';

export async function AuthRoute(app: FastifyInstance) {
  app.post('/login', async (req, res) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string()
    });

    const { email, password } = loginSchema.parse(req.body);

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

}