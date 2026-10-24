import { heroes } from '../data/heroes';
import { emptyFilters, positions, situations } from '../data/options';
import type { Filters } from '../types';

interface Props {
  value: Filters;
  onChange: (filters: Filters) => void;
}

export function BuildFilters({ value, onChange }: Props) {
  function change(changes: Partial<Filters>) {
    onChange({ ...value, ...changes });
  }

  const active = Object.values(value).some((field) => field !== '');

  return (
    <aside className="filters-panel" aria-label="Фильтры сборок">
      <div className="filters-heading"><h2>Подобрать сборку</h2></div>
      <label className="field">
        Поиск
        <input type="search" value={value.search} onChange={(event) => change({ search: event.target.value })} placeholder="Название или описание" />
      </label>
      <label className="field">
        Герой
        <select value={value.heroId} onChange={(event) => change({ heroId: event.target.value as Filters['heroId'] })}>
          <option value="">Все герои</option>
          {heroes.map((hero) => <option key={hero.id} value={hero.id}>{hero.name}</option>)}
        </select>
      </label>
      <label className="field">
        Позиция
        <select value={value.position} onChange={(event) => change({ position: event.target.value === '' ? '' : Number(event.target.value) as Filters['position'] })}>
          <option value="">Все позиции</option>
          {positions.map((position) => <option key={position.value} value={position.value}>{position.value} · {position.label}</option>)}
        </select>
      </label>
      <div className="filter-divider" />
      <label className="field">
        Союзник
        <select value={value.allyId} onChange={(event) => change({ allyId: event.target.value as Filters['allyId'] })}>
          <option value="">Любой союзник</option>
          {heroes.map((hero) => <option key={hero.id} value={hero.id}>{hero.name}</option>)}
        </select>
      </label>
      <label className="field">
        Противник
        <select value={value.enemyId} onChange={(event) => change({ enemyId: event.target.value as Filters['enemyId'] })}>
          <option value="">Любой противник</option>
          {heroes.map((hero) => <option key={hero.id} value={hero.id}>{hero.name}</option>)}
        </select>
      </label>
      <label className="field">
        Ситуация
        <select value={value.situationId} onChange={(event) => change({ situationId: event.target.value as Filters['situationId'] })}>
          <option value="">Все ситуации</option>
          {situations.map((situation) => <option key={situation.value} value={situation.value}>{situation.label}</option>)}
        </select>
      </label>
      <button className="text-button" type="button" disabled={!active} onClick={() => onChange({ ...emptyFilters })}>Сбросить фильтры</button>
    </aside>
  );
}
