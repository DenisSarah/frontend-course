import { createServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/app.js';

const app = createApp();
const server = createServer(app);
const vite = await createViteServer({
  server: { middlewareMode: true, hmr: { server } },
  appType: 'spa',
});

app.use(vite.middlewares);

const port = Number(process.env.PORT || 5175);
server.listen(port, '127.0.0.1', () => {
  console.log(`Мини-ДЗ 2: http://127.0.0.1:${port}`);
});

server.on('error', (error) => {
  console.error(error.message);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await vite.close();
  server.close();
});
