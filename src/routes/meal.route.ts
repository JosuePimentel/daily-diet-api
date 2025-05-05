import { FastifyInstance } from 'fastify';
import { Auth } from '../middlewares/auth';
import { CheckMatchingId } from '../middlewares/checkMatchingId';
import { database } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';

export async function MealRoute(app: FastifyInstance) {
  app.addHook('preHandler', Auth);

  
  app.post('/', async (req, res) => {
    const mealSchema = z.object({
      user_id: z.string().uuid(),
      name: z.string(),
      desc: z.string().nullable(),
      inDiet: z.number(),
      date_meal: z.string()
    });

    const { user_id, name, desc, inDiet, date_meal } = mealSchema.parse(req.body);

    await database('meals')
      .insert({
        id: randomUUID(),
        name,
        desc,
        inDiet, 
        user_id,
        date_meal
      });
  });

  app.get('/:id', { preHandler: CheckMatchingId } async (req, res) => {
    const { token } = req.cookies;
    const tokenDecode = req.server.jwt.decode(token!);
    const { id } = req.params;

    const response = await database('meals')
    .select()
    .where('user_id', tokenDecode!.sub)
    .andWhere('id', id);

    res.status(200).send(response);
  });
  
  app.get('/', { preHandler: CheckMatchingId }, async (req, res) => {
    const { token } = req.cookies;
    const tokenDecode = req.server.jwt.decode(token!);

    const response = await database('meals')
      .select()
      .where('user_id', tokenDecode!.sub);

    res.status(200).send(response);
  });
}