import { players } from './data.js';
import { getPlayerStats } from './stats.js';

const statsByPlayer = new Map(players.map((player) => [player.id, getPlayerStats(player.matches)]));

export function getMatchingIds(search, position) {
  const query = search.trim().toLowerCase().replaceAll('ё', 'е');
  return new Set(players
    .filter((player) => player.nickname.toLowerCase().replaceAll('ё', 'е').includes(query)
      && (position === '' || player.position === Number(position)))
    .map((player) => player.id));
}

export function getOrderedPlayers(sort) {
  return [...players].sort((first, second) => {
    const byName = first.nickname.localeCompare(second.nickname);
    if (sort !== 'winRate' && sort !== 'gpm') return byName;
    const firstValue = statsByPlayer.get(first.id)?.[sort] ?? null;
    const secondValue = statsByPlayer.get(second.id)?.[sort] ?? null;
    if (firstValue === null) return secondValue === null ? byName : 1;
    if (secondValue === null) return -1;
    return secondValue - firstValue || byName;
  });
}

export function togglePlayer(current, id) {
  if (current.includes(id)) return current.filter((item) => item !== id);
  const player = players.find((item) => item.id === id);
  return [...current.filter((item) => players.find((entry) => entry.id === item).position !== player.position), id];
}
