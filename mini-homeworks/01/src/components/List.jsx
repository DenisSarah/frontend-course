export function List({ items, getKey, renderItem }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__symbol" aria-hidden="true">∅</span>
        <h3>Ничего не найдено</h3>
        <p>Измени запрос или выбранный вариант.</p>
      </div>
    );
  }

  return (
    <ul className="collection-list" role="list">
      {items.map((item) => (
        <li className="collection-list__item" key={getKey(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
