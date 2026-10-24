import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBuilds } from './hooks/useBuilds';
import { createEmptyDraft, filterBuilds } from './lib/builds';
import { emptyFilters } from './data/options';
import { heroes } from './data/heroes';
import { BuildCard } from './components/BuildCard';
import { BuildDetails } from './components/BuildDetails';
import { BuildFilters } from './components/BuildFilters';
import { BuildForm } from './components/BuildForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import type { BuildDraft, Filters, HeroId } from './types';

type View = { type: 'list' } | { type: 'details'; id: string } | { type: 'form'; id?: string };

export function App() {
  const { builds, saveBuild, deleteBuild, storageError, retrySave, storageBlocked, restoreDefaults } = useBuilds();
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters });
  const [view, setView] = useState<View>({ type: 'list' });
  const [confirm, setConfirm] = useState<'delete' | 'restore' | null>(null);
  const [actionError, setActionError] = useState('');
  const visibleBuilds = useMemo(() => filterBuilds(builds, filters), [builds, filters]);
  const activeBuild = 'id' in view ? builds.find((build) => build.id === view.id) : undefined;
  const collectionTitle = filters.heroId ? heroes.find((hero) => hero.id === filters.heroId)?.name : 'Все сборки';
  const deleting = confirm === 'delete';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const openBuild = useCallback((id: string) => setView({ type: 'details', id }), []);

  function showList() {
    setView({ type: 'list' });
  }

  function createBuild() {
    setView({ type: 'form' });
  }

  function toggleHeroFilter(heroId: HeroId | '') {
    setFilters((current) => ({
      ...current,
      heroId: current.heroId === heroId ? '' : heroId,
    }));
  }

  function handleStorageAction() {
    if (storageBlocked) setConfirm('restore');
    else retrySave();
  }

  function cancelForm() {
    if (view.type === 'form' && view.id) openBuild(view.id);
    else showList();
  }

  function handleSave(draft: BuildDraft) {
    const saved = saveBuild(draft, view.type === 'form' ? view.id : undefined);
    openBuild(saved.id);
  }

  function confirmAction() {
    try {
      if (confirm === 'delete' && activeBuild) deleteBuild(activeBuild.id);
      if (confirm === 'restore') restoreDefaults();
      showList();
      setConfirm(null);
      setActionError('');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Не удалось выполнить действие.');
      setConfirm(null);
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <button className="site-brand" type="button" onClick={showList} aria-label="Сборки Dota 2 — к коллекции">
          <img src="/assets/scenes/dota2-logo.png" alt="Dota 2" width="154" height="30" />
        </button>
        <nav className="main-nav" aria-label="Главное меню">
          <button className={view.type === 'list' ? 'nav-link active' : 'nav-link'} type="button" onClick={showList}>Мои сборки</button>
          {view.type !== 'list' && <span className="nav-current">{view.type === 'details' ? 'Просмотр сборки' : 'Редактор'}</span>}
        </nav>
        <button className="primary-button create-button" type="button" onClick={createBuild} disabled={storageBlocked}>+ Создать сборку</button>
      </header>

      {view.type !== 'list' && <button className="back-button" type="button" onClick={showList}>← К сборкам</button>}

      {storageError && (
        <div className="storage-notice" role="alert">
          <p>{storageError}</p>
          <button type="button" className="secondary-button" onClick={handleStorageAction}>
            {storageBlocked ? 'Восстановить начальные сборки' : 'Повторить сохранение'}
          </button>
        </div>
      )}
      {actionError && <p className="error-message" role="alert">{actionError}</p>}

      {view.type === 'list' && (
        <>
          <section className="collection-intro">
            <div>
              <p className="eyebrow">Личная коллекция</p>
              <h1>Сборки героев</h1>
              <p className="intro-text">Предметы и прокачка под составы и ситуацию в игре.</p>
            </div>
            <span className="collection-total"><strong>{builds.length.toString().padStart(2, '0')}</strong>сборок в коллекции</span>
          </section>
          <div className="hero-roster" aria-label="Быстрый выбор героя">
            <button type="button" className={!filters.heroId ? 'roster-all selected' : 'roster-all'} aria-pressed={!filters.heroId} onClick={() => toggleHeroFilter('')}>
              <span aria-hidden="true">▦</span>Все герои
            </button>
            {heroes.map((hero) => (
              <button type="button" key={hero.id} className={filters.heroId === hero.id ? 'roster-hero selected' : 'roster-hero'} aria-pressed={filters.heroId === hero.id} onClick={() => toggleHeroFilter(hero.id)}>
                <img src={hero.image} alt="" width="128" height="72" />
                <span>{hero.name}</span>
              </button>
            ))}
          </div>
          <div className="collection-layout">
            <BuildFilters value={filters} onChange={setFilters} />
            <section className="collection" aria-labelledby="collection-heading">
              <div className="collection-heading">
                <h2 id="collection-heading">{collectionTitle}</h2>
                <p role="status">Найдено: {visibleBuilds.length}</p>
              </div>
              {builds.length === 0 ? (
                <div className="empty-state">
                  <h3>Сборок пока нет</h3>
                  <p>Создай первую сборку: выбери героя, предметы и прокачку способностей.</p>
                  <button type="button" className="primary-button" onClick={createBuild} disabled={storageBlocked}>Создать сборку</button>
                </div>
              ) : visibleBuilds.length === 0 ? (
                <div className="empty-state">
                  <h3>Подходящих сборок нет</h3>
                  <p>Попробуй другие условия игры или сбрось фильтры.</p>
                  <button type="button" className="secondary-button" onClick={() => setFilters({ ...emptyFilters })}>Сбросить фильтры</button>
                </div>
              ) : (
                <ul className="build-grid" aria-label="Сборки">
                  {visibleBuilds.map((build) => <li key={build.id}><BuildCard build={build} onOpen={openBuild} /></li>)}
                </ul>
              )}
            </section>
          </div>
        </>
      )}

      {view.type === 'form' && (
        <div className="editor">
          <h1>{view.id ? 'Редактировать сборку' : 'Новая сборка'}</h1>
          <BuildForm
            key={view.id || 'new'}
            initial={activeBuild ? structuredClone(activeBuild) : createEmptyDraft()}
            editing={Boolean(view.id)}
            onSave={handleSave}
            onCancel={cancelForm}
          />
        </div>
      )}
      {view.type === 'details' && activeBuild && (
        <BuildDetails
          build={activeBuild}
          disabled={storageBlocked}
          onEdit={() => setView({ type: 'form', id: activeBuild.id })}
          onDelete={() => setConfirm('delete')}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={deleting ? 'Удалить сборку?' : 'Восстановить начальные сборки?'}
          message={deleting ? `«${activeBuild?.title}» будет удалена из коллекции.` : 'Сначала сохраним копию старых данных в браузере, затем восстановим начальную коллекцию.'}
          confirmLabel={deleting ? 'Удалить сборку' : 'Восстановить'}
          onConfirm={confirmAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </main>
  );
}
