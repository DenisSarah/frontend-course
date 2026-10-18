# Мини-ДЗ 2

Сайт команд Dota 2: поиск по региону и свободным позициям, создание команды и изменение состава.

```text
src/
  App.jsx             — список команд и действия
  api.js              — запросы через fetch и qs
  components/         — карточки, состав и формы
  main.jsx            — запуск React
  styles.css          — стили
server/
  app.js              — маршруты и проверка данных
  store.js            — сохранение команд
  seed.js             — начальные команды
  index.js            — сервер готовой сборки
shared/options.js     — регионы и позиции
dev.js                — Express и Vite на одном порту
```

Из корня репозитория:

```bash
pnpm install
pnpm dev:02
```

Открыть http://127.0.0.1:5175. Команды сохраняются в `server/teams.local.json`, файл создаётся автоматически и не попадает в Git.

Готовая сборка вместо dev-сервера:

```bash
pnpm --filter @frontend-course/mini-02 build
pnpm --filter @frontend-course/mini-02 start
```

В Chrome: `⌘⌥I` (macOS) или `F12` → Network → Fetch/XHR → выполнить действие на сайте → выбрать запрос → Headers, Payload, Response.

| Действие | Запрос |
|---|---|
| Найти команды | `GET /api/teams` — массив позиций и объект фильтров в query через qs |
| Посмотреть состав | `GET /api/teams/:teamId` |
| Создать команду | `POST /api/teams` — URL-encoded форма через qs |
| Сохранить изменения | `PUT /api/teams/:teamId` — JSON |
| Открыть или закрыть набор | `PATCH /api/teams/:teamId` — JSON |
| Удалить команду | `DELETE /api/teams/:teamId` |

Фреймворки:

- [Express](https://expressjs.com/) — маршруты и middleware с `req`/`res`. Используется здесь.
- [Koa](https://koajs.com/) — объект `ctx` и асинхронная цепочка `await next()`, middleware подключаются отдельно.
- [Fastify](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/) — плагины, проверка запросов и сериализация ответов по схемам.
