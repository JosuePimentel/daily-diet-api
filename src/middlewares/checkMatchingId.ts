import { FastifyReply, FastifyRequest } from 'fastify';
import { database } from '../database';

export async function CheckMatchingId(req: FastifyRequest<{ Params: { id?: string } }>, res: FastifyReply) {
  const { id } = req.params;
  
  if (id) {
    const mealFound = await database('meals')
      .select('user_id')
      .where('id', id)
      .first();

    if (!mealFound) {
      res.status(404).send({ error: 'id da refeicao nao encontrada' });
    }
    
    const { authId } = req;
    if (authId != mealFound?.user_id) {
      res.status(403).send({ error: 'usuario tentando alterar informacoes que nao sao dele.' });
    }
  } 
}