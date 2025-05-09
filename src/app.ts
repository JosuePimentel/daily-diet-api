import cookie from '@fastify/cookie';
import fastify from 'fastify';
import { UserRoute } from './routes/user.route';
import { MealRoute } from './routes/meal.route';
import { AuthRoute } from './routes/auth.route';
import fastifyJwt from '@fastify/jwt';
import { env } from './env';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cookie);

app.register(fastifyJwt, {
  secret: env!.JWT_SECRET
});

app.register(UserRoute, {
  prefix: 'user'
});

app.register(MealRoute, {
  prefix: 'meal'
});

app.register(AuthRoute, {
  prefix: 'auth'
});