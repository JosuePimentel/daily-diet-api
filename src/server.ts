import { app } from './app';
import 'dotenv/config';

app.listen({
  port: Number(process.env.PORT)
}).then(() => {
  console.log(`HTTP Server Runnin in port: ${process.env.PORT}`);
});