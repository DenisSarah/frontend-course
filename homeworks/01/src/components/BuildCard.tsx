import { memo } from 'react';
import { heroes } from '../data/heroes';
import { itemStages, positions, situations } from '../data/options';
import { ItemStrip } from './ItemStrip';
import type { Build } from '../types';

interface Props {
  build: Build;
  onOpen: (id: string) => void;
}

export const BuildCard = memo(function BuildCard({ build, onOpen }: Props) {
  const hero = heroes.find((entry) => entry.id === build.heroId)!;
  const role = positions.find((entry) => entry.value === build.position)!;
  const coreItems = build.itemBuild.core;
  const preview = coreItems.length > 0 ? coreItems
    : itemStages.flatMap((stage) => build.itemBuild[stage.value]);

  return (
    <article className={`build-card hero-${hero.id}`} aria-label={build.title}>
      <div className="card-hero">
        <img src={`/assets/portraits/${hero.id}.webp`} alt={hero.name} width="256" height="256" loading="lazy" />
        <div className="card-hero-caption">
          <span className="eyebrow">Позиция {role.value} · {role.label}</span>
          <strong>{hero.name}</strong>
        </div>
      </div>
      <div className="card-content">
        <h3>{build.title}</h3>
        <p className="card-description">{build.description || 'Описание пока не добавлено.'}</p>
        <div className="tags">
          {build.situationIds.slice(0, 2).map((id) => <span className="tag" key={id}>{situations.find((entry) => entry.value === id)!.label}</span>)}
        </div>
        <div className="card-items">
          <p>{coreItems.length ? 'Основные предметы' : 'Предметы'}</p>
          <ItemStrip ids={preview.slice(0, 5)} />
        </div>
        <button type="button" className="secondary-button card-open" onClick={() => onOpen(build.id)}>
          Открыть сборку <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  );
});
