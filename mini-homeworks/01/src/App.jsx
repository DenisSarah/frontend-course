import { useState } from 'react';
import { Filter } from './components/Filter.jsx';
import { List } from './components/List.jsx';
import {
  items, matchesQuery, matchesOption, filterOptions, getKey, renderItem,
} from './catalog.jsx';

export function App() {
  const [query, setQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState(filterOptions[0].value);
  const visibleItems = items.filter(
    (item) => matchesQuery(item, query) && matchesOption(item, selectedValue),
  );

  return (
    <main className="page">
      <header className="page-header">
        <a className="brand" href="#collection" aria-label="Перейти к коллекции">
          <span className="brand__mark" aria-hidden="true">D2</span>
          <span>Hero pool</span>
        </a>
        <span className="page-header__note">Dota 2 / Коллекция героев</span>
      </header>

      <section className="hero" aria-labelledby="page-heading">
        <div>
          <p className="eyebrow">Dota 2 · Каталог героев</p>
          <h1 id="page-heading">Герои для твоего пула</h1>
          <p className="hero__description">
            Выбери позицию и найди героя по имени или прозвищу.
            У героя может быть несколько позиций.
          </p>
        </div>
        <div className="collection-size" aria-label={`В коллекции: ${items.length}`}>
          <span className="collection-size__number" aria-hidden="true">
            {items.length}
          </span>
          <span aria-hidden="true">героев в подборке</span>
        </div>
      </section>

      <section id="collection" className="collection" aria-label="Коллекция">
        <Filter
          value={query}
          onChange={setQuery}
          options={filterOptions}
          selectedValue={selectedValue}
          onSelect={setSelectedValue}
          optionsLabel="Позиция"
        />

        <div className="collection__heading">
          <h2>Герои</h2>
          <p className="result-count" role="status" aria-live="polite" aria-atomic="true">
            Показано <strong>{visibleItems.length}</strong> из {items.length}
          </p>
        </div>

        <List
          items={visibleItems}
          getKey={getKey}
          renderItem={renderItem}
        />
      </section>

      <footer className="page-footer">
        <span>Позиции: Dota2ProTracker. Изображения: Valve.</span>
        <a href="#page-heading">Наверх ↑</a>
      </footer>
    </main>
  );
}
