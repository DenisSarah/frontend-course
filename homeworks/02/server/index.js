import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { matchesRouter } from './routes.js';

const app = express();
const server = createServer(app);
app.use('/api/matches', express.json(), matchesRouter);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Адрес API не найден.' }));

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  const message = status === 413 ? 'Тело запроса слишком большое.' : 'Не удалось прочитать запрос.';
  res.status(status).json({ error: status >= 500 ? 'Ошибка сервера.' : message });
});

if (process.argv.includes('--production')) {
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  app.use(express.static(dist));
  app.get('/{*path}', (_req, res) => res.sendFile('index.html', { root: dist }));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true, hmr: { server } } });
  app.use(vite.middlewares);
}

const port = Number(process.env.PORT || 5182);
server.listen(port, '127.0.0.1', () => console.log(`Журнал матчей: http://127.0.0.1:${port}`));
