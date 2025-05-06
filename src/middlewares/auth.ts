import { FastifyReply, FastifyRequest } from 'fastify';

export async function Auth (req: FastifyRequest, res: FastifyReply) {
  try {
    const { token } = req.cookies;
  
    if (!token) {
      res.status(401).send({ error: 'usuario nao autenticado' });
    }

    req.server.jwt.verify(token!);

    const tokenDecoded = req.server.jwt.decode<{ sub: string }>(token!);
    req.authId = tokenDecoded!.sub;
  } catch {
    res.status(401).send({ error: 'token inválido ou expirado.' });
  }
}
