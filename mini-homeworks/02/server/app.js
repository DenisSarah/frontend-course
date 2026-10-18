import express from 'express';
import { randomUUID } from 'node:crypto';
import qs from 'qs';
import { positions, regions } from '../shared/options.js';
import { createStore } from './store.js';

const bodyLimit = 1024 * 1024;
const regionValues = regions.map((region) => region.value);
const positionValues = positions.map((position) => position.value);

function normalize(value) {
  return value.trim().toLowerCase().replaceAll('ё', 'е');
}

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function requireContentType(req, expected) {
  const actual = req.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (actual !== expected) fail(415, 'Неподдерживаемый Content-Type');
}

function validateTeam(input, isForm = false) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    fail(400, 'Передайте данные команды');
  }

  if (typeof input.name !== 'string' || input.name.trim().length < 2 || input.name.trim().length > 50) {
    fail(400, 'Название должно содержать от 2 до 50 символов');
  }
  if (!regionValues.includes(input.region)) fail(400, 'Выберите регион');

  const description = input.description === undefined ? '' : input.description;
  if (typeof description !== 'string' || description.trim().length > 300) {
    fail(400, 'Описание должно содержать не больше 300 символов');
  }

  let recruiting = input.recruiting;
  if (isForm) {
    if (input.recruiting === 'true') recruiting = true;
    else if (input.recruiting === 'false') recruiting = false;
    else recruiting = undefined;
  }
  if (typeof recruiting !== 'boolean') fail(400, 'Укажите, открыт ли набор');

  const sourcePlayers = isForm && input.players === undefined ? [] : input.players;
  if (!Array.isArray(sourcePlayers) || sourcePlayers.length > 5) {
    fail(400, 'В команде может быть не больше пяти игроков');
  }

  const players = sourcePlayers.map((player) => {
    if (!player || typeof player !== 'object' || Array.isArray(player)) {
      fail(400, 'Некорректные данные игрока');
    }

    if (isForm && typeof player.position !== 'string') fail(400, 'Некорректная позиция игрока');
    const position = isForm ? Number(player.position) : player.position;
    if (!positionValues.includes(position)) fail(400, 'Выберите позицию игрока от 1 до 5');
    if (typeof player.nickname !== 'string' || player.nickname.trim().length < 1 || player.nickname.trim().length > 24) {
      fail(400, 'Никнейм должен содержать от 1 до 24 символов');
    }

    return { position, nickname: player.nickname.trim() };
  });

  if (new Set(players.map((player) => player.position)).size !== players.length) {
    fail(400, 'Позиции игроков не должны повторяться');
  }
  if (new Set(players.map((player) => normalize(player.nickname))).size !== players.length) {
    fail(400, 'Никнеймы игроков не должны повторяться');
  }

  return { name: input.name.trim(), region: input.region, description: description.trim(), recruiting, players };
}

function readFilters(query) {
  const filter = query.filter ?? {};
  if (!filter || typeof filter !== 'object' || Array.isArray(filter)) fail(400, 'Некорректные фильтры');

  const search = filter.search ?? '';
  const region = filter.region ?? '';
  const recruiting = filter.recruiting ?? '';
  if (typeof search !== 'string') fail(400, 'Некорректный поисковый запрос');
  if (typeof region !== 'string' || (region !== '' && !regionValues.includes(region))) fail(400, 'Неизвестный регион');
  if (!['', 'true', 'false'].includes(recruiting)) fail(400, 'Некорректный фильтр набора');

  const selected = query.positions === undefined ? [] : Array.isArray(query.positions) ? query.positions : [query.positions];
  const selectedPositions = selected.map((position) => Number(position));
  if (selectedPositions.some((position) => !positionValues.includes(position))) fail(400, 'Неизвестная позиция');

  return { search: normalize(search), region, recruiting, selectedPositions };
}

export function createApp({ dataFile } = {}) {
  const app = express();
  const store = createStore(dataFile);

  app.set('query parser', (query) => qs.parse(query));
  app.use('/api', (req, res, next) => {
    try {
      decodeURI(req.path);
    } catch {
      return res.status(400).json({ error: 'Некорректный URL' });
    }

    const hasBody = Number(req.headers['content-length']) > 0 || req.headers['transfer-encoding'] !== undefined;
    if (hasBody && !req.is(['application/json', 'application/x-www-form-urlencoded'])) {
      return res.status(415).json({ error: 'Неподдерживаемый Content-Type' });
    }
    next();
  });
  app.use('/api', express.json({ limit: bodyLimit }));
  app.use('/api', express.urlencoded({ extended: true, limit: bodyLimit }));

  function findTeam(id) {
    const team = store.getTeams().find((item) => item.id === id);
    if (!team) fail(404, 'Команда не найдена');
    return team;
  }

  function checkName(name, id) {
    if (store.getTeams().some((team) => team.id !== id && normalize(team.name) === normalize(name))) {
      fail(409, 'Команда с таким названием уже существует');
    }
  }

  app.get('/api/teams', (req, res) => {
    const { search, region, recruiting, selectedPositions } = readFilters(req.query);
    const teams = store.getTeams().filter((team) => {
      const matchesSearch = normalize(team.name).includes(search)
        || team.players.some((player) => normalize(player.nickname).includes(search));
      const matchesRegion = region === '' || team.region === region;
      const matchesRecruiting = recruiting === '' || team.recruiting === (recruiting === 'true');
      const matchesPositions = selectedPositions.length === 0
        || selectedPositions.some((position) => !team.players.some((player) => player.position === position));
      return matchesSearch && matchesRegion && matchesRecruiting && matchesPositions;
    });
    res.json(teams);
  });

  app.get('/api/teams/:teamId', (req, res) => {
    res.json(findTeam(req.params.teamId));
  });

  app.post('/api/teams', (req, res) => {
    requireContentType(req, 'application/x-www-form-urlencoded');
    const values = validateTeam(req.body, true);
    checkName(values.name);
    const team = { id: randomUUID(), ...values };
    store.saveTeams([...store.getTeams(), team]);
    res.status(201).json(team);
  });

  app.put('/api/teams/:teamId', (req, res) => {
    requireContentType(req, 'application/json');
    const previous = findTeam(req.params.teamId);
    const values = validateTeam(req.body);
    if (req.body.id !== undefined && req.body.id !== previous.id) fail(400, 'Идентификатор команды нельзя изменить');
    checkName(values.name, previous.id);
    const team = { id: previous.id, ...values };
    store.saveTeams(store.getTeams().map((item) => item.id === team.id ? team : item));
    res.json(team);
  });

  app.patch('/api/teams/:teamId', (req, res) => {
    requireContentType(req, 'application/json');
    const previous = findTeam(req.params.teamId);
    const input = req.body;
    if (!input || typeof input.recruiting !== 'boolean' || Object.keys(input).length !== 1) {
      fail(400, 'Передайте только recruiting со значением true или false');
    }
    const team = { ...previous, recruiting: input.recruiting };
    store.saveTeams(store.getTeams().map((item) => item.id === team.id ? team : item));
    res.json(team);
  });

  app.delete('/api/teams/:teamId', (req, res) => {
    const team = findTeam(req.params.teamId);
    store.saveTeams(store.getTeams().filter((item) => item.id !== team.id));
    res.status(204).end();
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API-маршрут не найден' });
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Тело запроса превышает 1 МБ' });
    if (error instanceof URIError || error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Некорректный URL или JSON' });
    }
    const status = error.status || 500;
    return res.status(status).json({ error: status === 500 ? 'Не удалось сохранить или прочитать команды' : error.message });
  });

  return app;
}
