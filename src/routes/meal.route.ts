import { FastifyInstance } from 'fastify';
import { Auth } from '../middlewares/auth';
import { CheckMatchingId } from '../middlewares/checkMatchingId';
import { database } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function MealRoute(app: FastifyInstance) {
  app.addHook('preHandler', Auth);

  app.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {
      body: z.object({
        name: z.string(),
        desc: z.string().optional(),
        inDiet: z.number(),
        date_meal: z.string()
      })
    },
  }, async (req, res) => {
    const { authId } = req;
    const { name, desc, inDiet, date_meal } = req.body;

    await database('meals')
      .insert({
        id: randomUUID(),
        name,
        desc: desc,
        inDiet, 
        user_id: authId,
        date_meal
      });
    
    res.send(201);
  });

  app.withTypeProvider<ZodTypeProvider>().get('/:id', {
    preHandler: CheckMatchingId,
    schema: {
      params: z.object({
        id: z.string().uuid()
      })
    }
  }, async (req, res) => {
    const { authId } = req;
    const { id } = req.params;

    const response = await database('meals')
      .select()
      .where('user_id', authId)
      .andWhere('id', id)
      .first();

    res.status(200).send(response);
  });
  
  app.get('/', { preHandler: CheckMatchingId }, async (req, res) => {
    const { authId } = req;

    const response = await database('meals')
      .select()
      .where('user_id', authId);
    
    res.status(200).send(response);
  });

  app.withTypeProvider<ZodTypeProvider>().delete('/:id', {
    preHandler: CheckMatchingId,
    schema: {
      params: z.object({
        id: z.string().uuid()
      })
    }
  }, async (req, res) => {
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

  app.withTypeProvider<ZodTypeProvider>().patch('/:id', {
    preHandler: CheckMatchingId,
    schema: {
      params: z.object({
        id: z.string().uuid()
      }),
      body: z.object({
        name: z.string().optional(),
        desc: z.string().optional(),
        inDiet: z.number().optional(),
        date_meal: z.string().optional()
      })
    }
  }, async (req, res) => {
    const { id } = req.params;
    const { authId } = req;

    const { name, desc, inDiet, date_meal } = req.body;

    const mealFound = await database('meals')
      .select()
      .where('id', id)
      .andWhere('user_id', authId)
      .first();

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

    res.send(204);
  });
}