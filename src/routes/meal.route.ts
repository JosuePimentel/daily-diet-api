import { FastifyInstance } from 'fastify';
import { Auth } from '../middlewares/auth';

export async function MealRoute(app: FastifyInstance) {
  app.addHook('preHandler', Auth);
  
  app.get('/', (req, rep) => {
    rep.send('Hello World!');
  });
}