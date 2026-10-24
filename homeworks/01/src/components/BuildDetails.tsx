import { heroes } from '../data/heroes';
import { itemStages, positions, situations } from '../data/options';
import { ItemStrip } from './ItemStrip';
import { SkillPlanner } from './SkillPlanner';
import type { Build, HeroId } from '../types';

interface Props {
  build: Build;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}

function HeroTags({ ids }: { ids: HeroId[] }) {
  if (ids.length === 0) return <p className="muted">Не указаны</p>;

  return (
    <ul className="hero-tags">
      {ids.map((id) => {
        const hero = heroes.find((entry) => entry.id === id)!;
        return (
          <li key={id}>
            <img src={hero.image} alt="" width="80" height="45" />
            <span>{hero.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function BuildDetails({ build, onEdit, onDelete, disabled }: Props) {
  const hero = heroes.find((entry) => entry.id === build.heroId)!;
  const role = positions.find((entry) => entry.value === build.position)!;

  return (
    <div className={`build-details hero-${hero.id}`}>
      <section className="detail-hero">
        <div className="hero-scene" aria-hidden="true">
          <div className="hero-halo" />
          <img src={`/assets/portraits/${hero.id}.webp`} alt="" width="640" height="640" />
        </div>
        <div className="detail-title">
          <p className="eyebrow">Позиция {role.value} <span> / </span> {role.label}</p>
          <p className="hero-display-name">{hero.name}</p>
          <h1>{build.title}</h1>
          <div className="tags">
            {build.situationIds.map((id) => (
              <span className="tag" key={id}>{situations.find((entry) => entry.value === id)!.label}</span>
            ))}
          </div>
          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={onEdit} disabled={disabled}>Редактировать сборку</button>
            <button type="button" className="danger-button" onClick={onDelete} disabled={disabled}>Удалить</button>
          </div>
        </div>
        <div className="hero-hud">
          <div className="hud-portrait">
            <img src={hero.image} alt={hero.name} width="128" height="72" />
            <span>{hero.name}</span>
          </div>
          <ul className="hud-abilities" aria-label="Способности героя">
            {hero.abilities.map((ability) => {
              const ranks = build.skillBuild.filter((pick) => pick === ability.key).length;
              return (
                <li key={ability.key} title={ability.name}>
                  <div className="hud-ability">
                    <img src={ability.image} alt={ability.name} width="64" height="64" />
                    <kbd>{ability.key.toUpperCase()}</kbd>
                  </div>
                  <div className="ability-ranks" aria-label={`Ранг ${ranks}`}>
                    {Array.from({ length: ability.key === 'r' ? 3 : 4 }, (_, index) => (
                      <i className={index < ranks ? 'learned' : ''} key={index} />
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="hud-inventory">
            <span className="eyebrow">Основные предметы</span>
            <ItemStrip ids={build.itemBuild.core.slice(0, 6)} />
          </div>
        </div>
      </section>
      <nav className="build-sections" aria-label="Разделы сборки">
        <a href="#build-overview">Обзор сборки</a>
        <a href="#build-items">Предметы</a>
        <a href="#build-skills">Способности</a>
      </nav>
      <div className="guide-layout">
        <aside className="panel matchup-panel" id="build-overview">
          <div className="panel-heading">
            <span className="section-number">01</span>
            <h2>План на игру</h2>
          </div>
          <p className="build-description">{build.description || 'Описание пока не добавлено.'}</p>
          <div className="matchup-group allies">
            <h3><span aria-hidden="true">◆</span> Союзники</h3>
            <HeroTags ids={build.allyIds} />
          </div>
          <div className="matchup-group enemies">
            <h3><span aria-hidden="true">◆</span> Противники</h3>
            <HeroTags ids={build.enemyIds} />
          </div>
        </aside>
        <section className="panel items-panel" id="build-items">
          <div className="panel-heading">
            <span className="section-number">02</span>
            <h2>Сборка предметов</h2>
          </div>
          <div className="item-stages">
            {itemStages.map((stage, index) => {
              const stageItems = build.itemBuild[stage.value];
              return (
                <section className={`item-stage item-stage-${stage.value}`} key={stage.value}>
                  <div className="stage-heading">
                    <span className="stage-index">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{stage.label}</h3>
                  </div>
                  {stageItems.length ? <ItemStrip ids={stageItems} names /> : <p className="muted">Не указаны</p>}
                </section>
              );
            })}
          </div>
        </section>
      </div>
      <section className="panel skills-panel" id="build-skills">
        <div className="panel-heading">
          <span className="section-number">03</span>
          <h2>Прокачка способностей</h2>
          <span className="panel-caption">Уровни 1—18</span>
        </div>
        <SkillPlanner hero={hero} value={build.skillBuild} />
        {build.talentNotes && (
          <div className="talent-notes">
            <span className="talent-symbol" aria-hidden="true">✦</span>
            <div>
              <h3>Таланты и пояснения</h3>
              <p className="build-description">{build.talentNotes}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
