import { FastifyInstance } from 'fastify';
import { Auth } from '../middlewares/auth';
import { CheckMatchingId } from '../middlewares/checkMatchingId';
import { database } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';

export async function MealRoute(app: FastifyInstance) {
  app.addHook('preHandler', Auth);

  app.post('/', async (req) => {
    const mealSchema = z.object({
      user_id: z.string().uuid(),
      name: z.string(),
      desc: z.string().optional(),
      inDiet: z.number(),
      date_meal: z.string()
    });

    const { user_id, name, desc, inDiet, date_meal } = mealSchema.parse(req.body);

    await database('meals')
      .insert({
        id: randomUUID(),
        name,
        desc: desc,
        inDiet, 
        user_id,
        date_meal
      });
  });

  app.get('/:id', { preHandler: CheckMatchingId }, async (req, res) => {
    const { authId } = req;
    const { id } = req.params;

    const response = await database('meals')
      .select()
      .where('user_id', authId)
      .andWhere('id', id);

    res.status(200).send(response);
  });
  
  app.get('/', { preHandler: CheckMatchingId }, async (req, res) => {
    const { authId } = req;

    const response = await database('meals')
      .select()
      .where('user_id', authId);

    res.status(200).send(response);
  });

  app.delete('/:id', { preHandler: CheckMatchingId }, async (req, res) => {
    const { authId } = req;
    const { id } = req.params;
    const mealFound = await database('meals')
      .where('id', id)
      .andWhere('user_id', authId)
      .first();

    if(!mealFound) {
      res.status(404).send({ error: 'refeição não encontrada' });
    }

    await database('meals')
      .where('id', id)
      .first()
      .del();

    res.send(204);
  });

  app.patch('/:id', { preHandler: CheckMatchingId }, async (req, res) => {
    const { id } = req.params;
    const { authId } = req;

    const mealSchema = z.object({
      name: z.string().nullable(),
      desc: z.string().nullable(),
      inDiet: z.number().nullable(),
      date_meal: z.string().nullable()
    });

    const { name, desc, inDiet, date_meal } = mealSchema.parse(req.body);

    const mealFound = await database('meals')
      .select()
      .where('id', id)
      .andWhere('user_id', authId);

    if(!mealFound) {
      res.status(404).send({ error: 'refeição não encontrada' });
    }

    await database('meals')
      .where('id', id)
      .update({
        name,
        desc,
        inDiet,
        date_meal
      });
  });
}