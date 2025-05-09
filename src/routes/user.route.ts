import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { env } from '../env';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function UserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    }
  }, async (req, res) => {
    const { name, email, password } = req.body;

    const passwordCrypt = await bcrypt.hash(password, env!.HASH_SALT);

    await database('users').insert({
      id: randomUUID(),
      name,
      email,
      password: passwordCrypt
    });

    res.send(201);
  });

  app.get('/', async () => {
    return await database('users').select();
  });
}