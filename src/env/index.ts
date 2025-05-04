import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'stagging']).default('development')
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  new Error('Invalid enviroment variable!');
}

export const env = _env.data;