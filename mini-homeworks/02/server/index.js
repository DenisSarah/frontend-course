import express from 'express';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const app = createApp();
const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 5175);

app.use(express.static(distDirectory));
app.get('/{*path}', (req, res) => {
  res.sendFile('index.html', { root: distDirectory });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`http://127.0.0.1:${port}`);
});
