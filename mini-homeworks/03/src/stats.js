export function getPlayerStats(matches) {
  let wins = 0;
  let kills = 0;
  let deaths = 0;
  let assists = 0;
  let goldPerMin = 0;
  let knownGoldPerMin = 0;

  for (const match of matches) {
    wins += match.win ? 1 : 0;
    kills += match.kills;
    deaths += match.deaths;
    assists += match.assists;
    if (Number.isFinite(match.goldPerMin) && match.goldPerMin >= 0) {
      goldPerMin += match.goldPerMin;
      knownGoldPerMin += 1;
    }
  }

  const games = matches.length;
  return {
    games,
    wins,
    winRate: games === 0 ? null : Math.round(wins / games * 100),
    kda: games === 0 ? null : ((kills + assists) / Math.max(1, deaths)).toFixed(1),
    gpm: knownGoldPerMin === 0 ? null : Math.round(goldPerMin / knownGoldPerMin),
  };
}
