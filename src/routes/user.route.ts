import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { env } from '../env';

export async function UserRoute(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    });

    const { name, email, password } = bodySchema.parse(req.body);

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