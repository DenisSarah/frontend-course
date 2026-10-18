import { positions, regions } from '../../shared/options.js';

export function TeamCard({ team, onOpen }) {
  const region = regions.find((option) => option.value === team.region)?.label || team.region;

  return (
    <article className="team-card">
      <div className="team-card-header">
        <span className="team-mark" aria-hidden="true">{team.name.slice(0, 2).toUpperCase()}</span>
        <div>
          <p className="team-region">{region}</p>
          <h3>{team.name}</h3>
        </div>
      </div>

      <span className={team.recruiting ? 'recruiting-badge open' : 'recruiting-badge'}>
        {team.recruiting ? 'Открыт набор' : 'Набор закрыт'}
      </span>
      <p className="team-description">{team.description || 'Пока без описания.'}</p>

      <ul className="roster-preview" aria-label="Места в команде">
        {positions.map((position) => {
          const player = team.players.find((item) => item.position === position.value);
          return (
            <li
              key={position.value}
              className={player ? 'roster-slot' : 'roster-slot vacant'}
              title={`${position.value} · ${position.label}: ${player ? player.nickname : 'Свободно'}`}
            >
              <span>{position.value}</span>
              <span className="slot-name">{player ? player.nickname : 'Свободно'}</span>
            </li>
          );
        })}
      </ul>

      <div className="team-card-footer">
        <span>{team.players.length} из 5 игроков</span>
        <button className="secondary-button" type="button" onClick={() => onOpen(team.id)}>
          Открыть состав
        </button>
      </div>
    </article>
  );
}
