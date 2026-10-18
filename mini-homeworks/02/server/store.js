import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedTeams } from './seed.js';

const defaultFile = fileURLToPath(new URL('./teams.local.json', import.meta.url));

export function createStore(dataFile = defaultFile) {
  let teams;

  function saveTeams(nextTeams) {
    mkdirSync(dirname(dataFile), { recursive: true });
    const temporaryFile = `${dataFile}.tmp`;
    writeFileSync(temporaryFile, JSON.stringify(nextTeams, null, 2), 'utf8');
    renameSync(temporaryFile, dataFile);
    teams = nextTeams;
  }

  if (existsSync(dataFile)) {
    teams = JSON.parse(readFileSync(dataFile, 'utf8'));
    if (!Array.isArray(teams)) throw new Error('Файл команд должен содержать массив');
  } else {
    saveTeams(structuredClone(seedTeams));
  }

  return {
    getTeams() {
      return teams;
    },
    saveTeams,
  };
}
