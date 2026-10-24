import { memo, useMemo } from 'react';
import { positions } from '../data.js';
import { getPlayerStats } from '../stats.js';
import { useRenderLog } from '../useRenderLog.js';

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
});

function getSamplePeriod(matches) {
  const times = matches.map((match) => match.startTime).filter((time) => Number.isFinite(time) && time > 0);
  if (times.length === 0) return '—';
  return `${dateFormat.format(Math.min(...times) * 1000)} — ${dateFormat.format(Math.max(...times) * 1000)} UTC`;
}

function CardView({ player, selected, onToggle, stats }) {
  const role = positions.find((position) => position.value === player.position);

  return (
    <article className={selected ? 'player-card selected' : 'player-card'} aria-label={player.nickname}>
      <div className="player-header">
        <span className="avatar" aria-hidden="true">{player.nickname.slice(0, 2).toUpperCase()}</span>
        <div>
          <h3>{player.nickname}</h3>
          <p>{role.value} · {role.label}</p>
        </div>
      </div>
      <dl className="player-stats">
        <div><dt title="Среднее золото в минуту">GPM</dt><dd>{stats.gpm ?? '—'}</dd></div>
        <div><dt>Победы</dt><dd>{stats.winRate == null ? '—' : `${stats.winRate}%`}</dd></div>
        <div><dt title="(Сумма убийств + сумма помощи) / max(1, сумма смертей)">KDA</dt><dd>{stats.kda ?? '—'}</dd></div>
        <div><dt>Матчи</dt><dd>{stats.games}</dd></div>
      </dl>
      <p className="sample-period">Выборка: {getSamplePeriod(player.matches)}</p>
      <button className={selected ? 'select-button selected' : 'select-button'} type="button" aria-pressed={selected} onClick={() => onToggle(player.id)}>
        {selected ? 'Убрать из состава' : 'В состав'}
      </button>
    </article>
  );
}

export function PlainPlayerCard(props) {
  useRenderLog(`PlayerCard ${props.player.id}`);
  const stats = getPlayerStats(props.player.matches);
  return <CardView {...props} stats={stats} />;
}

export const MemoPlayerCard = memo(function PlayerCard(props) {
  useRenderLog(`PlayerCard ${props.player.id}`);
  const stats = useMemo(() => getPlayerStats(props.player.matches), [props.player.matches]);
  return <CardView {...props} stats={stats} />;
});
