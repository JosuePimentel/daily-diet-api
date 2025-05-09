import { FastifyInstance } from 'fastify';
import { database } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { env } from '../env';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { Auth } from '../middlewares/auth';

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

  app.get('/statistics', { preHandler: Auth }, async (req, res) => {
    const { authId } = req;
    const meals = (await database('meals').where('user_id', authId))
      .sort((a, b) => {
        const dataA = new Date(a.date_meal);
        const dataB = new Date(b.date_meal);

        if(dataA < dataB) {
          return -1;
        } else if (dataB > dataA) {
          return 1;
        } else {
          return 0;
        }
      });
    const mealsInDiet = meals.filter(meal => meal.inDiet).length;
    let higherSequenceInDiet = 0, acc = 0;
    meals.forEach(meal => {
      if(meal.inDiet) {
        acc++;
      }

      if(higherSequenceInDiet < acc) {
        higherSequenceInDiet = acc;
      }

      if(!meal.inDiet) {
        acc = 0;
      }
    });

    res.send({
      totalMeal: meals.length,
      mealsInDiet,
      mealsOutDiet: meals.length - mealsInDiet,
      higherSequenceInDiet
    });
  });
}