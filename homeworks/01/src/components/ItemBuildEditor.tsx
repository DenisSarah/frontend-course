import { useId, useState } from 'react';
import { items } from '../data/items';
import { itemStages } from '../data/options';
import type { BuildDraft, ItemStage } from '../types';

interface ItemBuildEditorProps {
  value: BuildDraft['itemBuild'];
  onChange: (value: BuildDraft['itemBuild']) => void;
}

export function ItemBuildEditor({ value, onChange }: ItemBuildEditorProps) {
  const [activeStage, setActiveStage] = useState<ItemStage>('start');
  const [search, setSearch] = useState('');
  const id = useId();
  const stage = itemStages.find((entry) => entry.value === activeStage)!;
  const selectedItems = value[activeStage];
  const query = search.trim().toLowerCase().replaceAll('ё', 'е');
  const visibleItems = items.filter((item) => item.name.toLowerCase().replaceAll('ё', 'е').includes(query));
  const full = selectedItems.length >= 8;

  function addItem(itemId: string) {
    if (!itemId || full) return;
    onChange({ ...value, [activeStage]: [...selectedItems, itemId] });
  }

  function removeItem(index: number) {
    onChange({ ...value, [activeStage]: selectedItems.filter((_, itemIndex) => itemIndex !== index) });
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedItems.length) return;
    const nextItems = [...selectedItems];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    onChange({ ...value, [activeStage]: nextItems });
  }

  return (
    <div className="item-shop">
      <div className="item-shop-stages" role="group" aria-label="Этап закупки">
        {itemStages.map((entry) => (
          <button
            className={activeStage === entry.value ? 'item-shop-stage active' : 'item-shop-stage'}
            type="button"
            key={entry.value}
            aria-pressed={activeStage === entry.value}
            aria-controls={`${id}-stage`}
            onClick={() => setActiveStage(entry.value)}
          >
            <span>{entry.label}</span>
            <strong>{value[entry.value].length}/8</strong>
          </button>
        ))}
      </div>

      <div className="item-shop-main">
        <section className="item-shop-build" id={`${id}-stage`} aria-labelledby={`${id}-stage-heading`}>
          <div className="item-shop-heading">
            <h3 id={`${id}-stage-heading`}>{stage.label}</h3>
            <span role="status">{selectedItems.length} из 8 предметов</span>
          </div>

          {selectedItems.length === 0 ? (
            <p className="item-shop-empty">Выбери предметы в магазине ниже.</p>
          ) : (
            <ol className="item-shop-slots" aria-label={`Порядок покупки: ${stage.label}`}>
              {selectedItems.map((itemId, index) => {
                const item = items.find((option) => option.id === itemId);
                const name = item?.name || itemId;

                return (
                  <li className="item-shop-slot" key={`${itemId}-${index}`}>
                    {item && <img src={item.image} alt="" width="64" height="48" loading="lazy" />}
                    <span className="item-shop-slot-name">{name}</span>
                    <div className="item-shop-actions">
                      <button
                        type="button"
                        disabled={index === 0}
                        aria-label={`Переместить ${name} раньше`}
                        title="Купить раньше"
                        onClick={() => moveItem(index, -1)}
                      >←</button>
                      <button
                        type="button"
                        disabled={index === selectedItems.length - 1}
                        aria-label={`Переместить ${name} позже`}
                        title="Купить позже"
                        onClick={() => moveItem(index, 1)}
                      >→</button>
                      <button type="button" aria-label={`Удалить ${name}`} title="Удалить предмет" onClick={() => removeItem(index)}>
                        ×
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="item-shop-catalog" aria-labelledby={`${id}-catalog-heading`}>
          <div className="item-shop-heading">
            <h3 id={`${id}-catalog-heading`}>Магазин предметов</h3>
            <span>Найдено: {visibleItems.length}</span>
          </div>
          <label className="field item-shop-search">
            Поиск предмета
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Например, Blink Dagger"
            />
          </label>
          <p className="item-shop-hint" id={`${id}-hint`}>
            {full
              ? `Этап «${stage.label}» заполнен. Удали предмет или выбери другой этап.`
              : `Предметы добавляются в этап «${stage.label}». Один предмет можно добавить несколько раз.`}
          </p>

          {visibleItems.length === 0 ? (
            <p className="item-shop-empty">Предметов с таким названием нет. Измени поисковый запрос.</p>
          ) : (
            <ul className="item-shop-grid" aria-label="Каталог предметов">
              {visibleItems.map((item) => (
                <li key={item.id}>
                  <button
                    className="item-shop-item"
                    type="button"
                    disabled={full}
                    aria-label={`Добавить ${item.name}`}
                    aria-describedby={`${id}-hint`}
                    title={`${item.name} · ${stage.label}`}
                    onClick={() => addItem(item.id)}
                  >
                    <img src={item.image} alt="" width="64" height="48" loading="lazy" />
                    <span>{item.name}</span>
                    <span className="item-shop-add" aria-hidden="true">+</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
