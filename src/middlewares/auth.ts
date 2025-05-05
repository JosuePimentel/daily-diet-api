import { FastifyReply, FastifyRequest } from 'fastify';

// TODO: SEPARAR EM UM OUTRO ARQUIVO A VERIFICAÇÃO DO ID E PENSAR EM VERIFICAR O USER_ID COM O ID DO JWT DECODED, POIS EU IREI RECEBER O ID DO MEAL NO QUERY PARAM
// TODO: ARRUMAR OS TYPES

export async function Auth (req: FastifyRequest, res: FastifyReply) {
  try {
    const { token } = req.cookies;
  
    if (!token) {
      res.status(401).send({ error: 'usuario nao autenticado' });
    }

    req.server.jwt.verify(token!);

  } catch {
    res.status(401).send({ error: 'token inválido ou expirado.' });
  }
}
