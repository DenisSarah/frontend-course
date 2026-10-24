import { useState } from 'react';
import { positions } from '../data.js';
import { useRenderLog } from '../useRenderLog.js';

function RosterName({ value, onChange }) {
  return (
    <label className="field">
      Название состава
      <input value={value} maxLength="50" onChange={(event) => onChange(event.target.value)} placeholder="Название" />
    </label>
  );
}

function LocalRosterName() {
  const [name, setName] = useState('Состав на вечер');
  useRenderLog('RosterName');
  return <RosterName value={name} onChange={setName} />;
}

export function DraftPage({ name, onNameChange, localName = false, search, onSearchChange, position, onPositionChange, sort, onSortChange, selectedPlayers, onClear, count, children }) {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Состав на матч</h1>
        <button className="reset-button" type="button" onClick={onClear} disabled={selectedPlayers.length === 0}>Очистить состав</button>
      </header>

      <section className="roster-panel" aria-labelledby="roster-heading">
        <h2 id="roster-heading">Мой состав</h2>
        {localName ? <LocalRosterName /> : <RosterName value={name} onChange={onNameChange} />}
        <ul className="roster-slots" aria-label="Состав">
          {positions.map((role) => {
            const player = selectedPlayers.find((item) => item.position === role.value);
            return (
              <li className={player ? 'slot filled' : 'slot'} key={role.value}>
                <span className="position-number">{role.value}</span>
                <strong>{player ? player.nickname : 'Свободно'}</strong>
                <span>{role.label}</span>
              </li>
            );
          })}
        </ul>
        <p className="roster-summary">Выбрано: {selectedPlayers.length} из 5</p>
      </section>

      <section aria-labelledby="players-heading">
        <div className="filters">
          <label className="field">
            Поиск игрока
            <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Никнейм" />
          </label>
          <label className="field">
            Позиция
            <select value={position} onChange={(event) => onPositionChange(event.target.value)}>
              <option value="">Все позиции</option>
              {positions.map((role) => <option value={role.value} key={role.value}>{role.value} · {role.label}</option>)}
            </select>
          </label>
          <label className="field">
            Сортировка
            <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
              <option value="name">По никнейму</option>
              <option value="winRate">По доле побед</option>
              <option value="gpm">По GPM</option>
            </select>
          </label>
        </div>
        <div className="players-heading">
          <h2 id="players-heading">Игроки Dota 2</h2>
          <p role="status">Найдено: {count}</p>
        </div>
        {count === 0 && <p className="empty-state">Игроков не нашли. Попробуй другой никнейм или позицию.</p>}
        <ul className="player-grid" aria-label="Игроки">{children}</ul>
      </section>
    </main>
  );
}
