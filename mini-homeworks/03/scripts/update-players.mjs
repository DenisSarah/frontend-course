import { writeFile, rename } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

const roster = [
  ['Yatoro', 321580662, 1],
  ['m1CKe', 152962063, 1],
  ['Ame', 898754153, 1],
  ['Pure', 331855530, 1],
  ['Satanic', 1044002267, 1],
  ['watson', 171262902, 1],
  ['Nisha', 201358612, 2],
  ['No[o]ne-', 106573901, 2],
  ['gpk', 480412663, 2],
  ['Malr1ne', 898455820, 2],
  ['bzm', 93618577, 2],
  ['Xm', 137129583, 2],
  ['33', 86698277, 3],
  ['Collapse', 302214028, 3],
  ['ATF', 183719386, 3],
  ['Ace', 97590558, 3],
  ['DM', 56351509, 3],
  ['Xxs', 129958758, 3],
  ['Saksa', 103735745, 4],
  ['Cr1t-', 25907144, 4],
  ['Mira', 256156323, 4],
  ['Boxi', 77490514, 4],
  ['9Class', 164199202, 4],
  ['Save-', 317880638, 4],
  ['Sneyking', 10366616, 5],
  ['Miposhka', 113331514, 5],
  ['Dukalis', 73401082, 5],
  ['Fishman', 127565532, 5],
  ['skem', 100594231, 5],
  ['tOfu', 16497807, 5],
];

function normalizeMatch(match) {
  const slot = match.player_slot;
  const validSlot = Number.isInteger(slot) && ((slot >= 0 && slot <= 4) || (slot >= 128 && slot <= 132));
  const validNumbers = ['match_id', 'start_time', 'hero_id', 'kills', 'deaths', 'assists']
    .every((key) => Number.isSafeInteger(match[key]) && match[key] >= 0);
  if (!validSlot || !validNumbers || typeof match.radiant_win !== 'boolean') {
    throw new Error(`Неполные данные матча ${match.match_id ?? 'без номера'}`);
  }
  return {
    matchId: match.match_id,
    startTime: match.start_time,
    heroId: match.hero_id,
    lobbyType: match.lobby_type,
    win: (slot < 128) === match.radiant_win,
    kills: match.kills,
    deaths: match.deaths,
    assists: match.assists,
    goldPerMin: Number.isFinite(match.gold_per_min) && match.gold_per_min >= 0 ? match.gold_per_min : null,
  };
}

async function requestMatches(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok) {
      const matches = await response.json();
      if (!Array.isArray(matches) || matches.length === 0) throw new Error(`Нет доступных матчей: ${url}`);
      return matches;
    }
    if (![429, 502, 503, 504].includes(response.status) || attempt === 2) {
      throw new Error(`OpenDota: HTTP ${response.status}, ${url}`);
    }
    await setTimeout(15000);
  }
}

const players = [];
for (const [nickname, accountId, position] of roster) {
  const apiUrl = `https://api.opendota.com/api/players/${accountId}/recentMatches`;
  const recent = await requestMatches(apiUrl);
  const matches = recent.slice(0, 20).map(normalizeMatch);
  if (new Set(matches.map((match) => match.matchId)).size !== matches.length) {
    throw new Error(`Повторяющиеся матчи: ${nickname}`);
  }
  players.push({
    id: `player-${accountId}`,
    nickname,
    position,
    accountId,
    sourceUrl: `https://www.opendota.com/players/${accountId}/matches`,
    identityUrl: `https://dota2protracker.com/player/${accountId}`,
    apiUrl,
    matches,
  });
  console.log(`${nickname}: ${matches.length} матчей`);
  await setTimeout(1200);
}

const snapshot = {
  info: {
    sourceName: 'OpenDota',
    sourceUrl: 'https://www.opendota.com/',
    retrievedAt: new Date().toISOString(),
    sampleSize: 20,
  },
  players,
};
const output = new URL('../src/players.json', import.meta.url);
const temporary = new URL('../src/players.json.tmp', import.meta.url);
await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
await rename(temporary, output);
console.log(`Сохранено: ${players.length} игроков, ${players.reduce((sum, player) => sum + player.matches.length, 0)} матчей`);
