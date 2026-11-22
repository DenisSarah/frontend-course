import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { heroes, results } from '../shared/options.ts';
import { matches } from './seed.ts';

export const matchesRouter = Router();

function readDraft(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Передайте данные в формате JSON.' });
  }
  const { hero, result, kills, deaths, assists, note = '' } = req.body ?? {};
  if (typeof hero !== 'string' || !Object.hasOwn(heroes, hero)) {
    return res.status(400).json({ error: 'Выберите героя из списка.' });
  }
  if (typeof result !== 'string' || !Object.hasOwn(results, result)) {
    return res.status(400).json({ error: 'Укажите результат матча.' });
  }
  if (![kills, deaths, assists].every(n => Number.isInteger(n) && n >= 0 && n <= 999)) {
    return res.status(400).json({ error: 'Убийства, смерти и помощи должны быть целыми числами от 0 до 999.' });
  }
  if (typeof note !== 'string' || note.length > 500) {
    return res.status(400).json({ error: 'Заметка должна содержать не больше 500 символов.' });
  }
  res.locals.draft = { hero, result, kills, deaths, assists, note: note.trim() };
  next();
}

matchesRouter.param('id', (req, res, next, id) => {
  const match = matches.find(item => item.id === id);
  if (!match) return res.status(404).json({ error: 'Матч не найден.' });
  res.locals.match = match;
  next();
});

matchesRouter.get('/', (req, res) => {
  const { result } = req.query;
  if (result === undefined || result === '') return res.json(matches);
  if (typeof result !== 'string' || !Object.hasOwn(results, result)) {
    return res.status(400).json({ error: 'Неизвестный результат матча.' });
  }
  res.json(matches.filter(match => match.result === result));
});

matchesRouter.get('/:id', (req, res) => res.json(res.locals.match));

matchesRouter.post('/', readDraft, (req, res) => {
  const match = { id: randomUUID(), ...res.locals.draft };
  matches.unshift(match);
  res.location(`${req.baseUrl}/${match.id}`).status(201).json(match);
});

matchesRouter.put('/:id', readDraft, (req, res) => {
  Object.assign(res.locals.match, res.locals.draft);
  res.json(res.locals.match);
});

matchesRouter.delete('/:id', (req, res) => {
  matches.splice(matches.indexOf(res.locals.match), 1);
  res.status(204).end();
});
