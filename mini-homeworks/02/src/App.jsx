import { useEffect, useState } from 'react';
import { getTeams } from './api.js';
import { regions, positions } from '../shared/options.js';
import { TeamCard } from './components/TeamCard.jsx';
import { TeamDetails } from './components/TeamDetails.jsx';
import { TeamForm } from './components/TeamForm.jsx';

export function App() {
  const [filters, setFilters] = useState({ search: '', region: '', positions: [], recruiting: false });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [detailsId, setDetailsId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getTeams(filters, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setTeams(data);
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError' && !controller.signal.aborted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters, reload]);

  function changeFilters(value) {
    setFilters(value);
    setLoading(true);
    setError('');
  }

  function togglePosition(value) {
    changeFilters((current) => ({
      ...current,
      positions: current.positions.includes(value)
        ? current.positions.filter((position) => position !== value)
        : [...current.positions, value],
    }));
  }

  function refreshTeams() {
    setLoading(true);
    setError('');
    setReload((current) => current + 1);
  }

  function openCreate() {
    setEditingTeam(null);
    setFormOpen(true);
  }

  function openEdit(team) {
    setDetailsId(null);
    setEditingTeam(team);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    if (editingTeam) setDetailsId(editingTeam.id);
    setEditingTeam(null);
  }

  function teamSaved(team) {
    setFormOpen(false);
    setEditingTeam(null);
    refreshTeams();
    setDetailsId(team.id);
  }

  function teamDeleted() {
    setDetailsId(null);
    refreshTeams();
  }

  const hasFilters = filters.search !== '' || filters.region !== '' || filters.positions.length > 0 || filters.recruiting;

  return (
    <main className="page">
      <header className="page-header">
        <h1 id="page-heading">Команды Dota 2</h1>
        <button className="primary-button" type="button" onClick={openCreate}>Создать команду</button>
      </header>

      <section id="teams" className="collection" aria-labelledby="teams-heading">
        <div className="filters">
          <div className="filter-row">
            <label className="field search-field">
              Поиск команды
              <input
                type="search"
                value={filters.search}
                placeholder="Название или никнейм"
                onChange={(event) => changeFilters((current) => ({ ...current, search: event.target.value }))}
              />
            </label>
            <label className="field region-field">
              Регион
              <select value={filters.region} onChange={(event) => changeFilters((current) => ({ ...current, region: event.target.value }))}>
                <option value="">Все регионы</option>
                {regions.map((region) => <option key={region.value} value={region.value}>{region.label}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="position-filters">
            <legend>Свободные позиции</legend>
            <div className="position-chips">
              {positions.map((position) => (
                <button
                  className="position-chip"
                  type="button"
                  key={position.value}
                  aria-pressed={filters.positions.includes(position.value)}
                  onClick={() => togglePosition(position.value)}
                >
                  <span>{position.value}</span> {position.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="filter-bottom">
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={filters.recruiting}
                onChange={(event) => changeFilters((current) => ({ ...current, recruiting: event.target.checked }))}
              />
              Только с открытым набором
            </label>
            <button
              className="text-button"
              type="button"
              disabled={!hasFilters}
              onClick={() => changeFilters({ search: '', region: '', positions: [], recruiting: false })}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        <div className="collection-heading">
          <h2 id="teams-heading">Команды</h2>
          <p role="status" aria-live="polite">{loading ? 'Ищем команды…' : error ? 'Не удалось загрузить команды' : `Команд: ${teams.length}`}</p>
        </div>

        {loading ? (
          <div className="empty-state"><p>Загружаем команды…</p></div>
        ) : error ? (
          <div className="empty-state">
            <p className="error-message" role="alert">{error}</p>
            <button className="secondary-button" type="button" onClick={refreshTeams}>Попробовать ещё раз</button>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state">
            <h3>Пока никого не нашли</h3>
            <p>Измени фильтры или создай свою команду.</p>
            <button className="primary-button" type="button" onClick={openCreate}>Создать команду</button>
          </div>
        ) : (
          <ul className="team-grid" aria-label="Команды">
            {teams.map((team) => (
              <li key={team.id}><TeamCard team={team} onOpen={setDetailsId} /></li>
            ))}
          </ul>
        )}
      </section>

      {detailsId !== null && (
        <TeamDetails key={detailsId} id={detailsId} onClose={() => setDetailsId(null)} onEdit={openEdit} onChanged={refreshTeams} onDeleted={teamDeleted} />
      )}
      {formOpen && <TeamForm team={editingTeam} onClose={closeForm} onSaved={teamSaved} />}
    </main>
  );
}
