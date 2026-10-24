import type { Hero, SkillPick } from '../types';

type SkillKey = Exclude<SkillPick, ''>;

interface SkillRow {
  key: SkillKey;
  name: string;
  image: string;
}

interface SkillPlannerProps {
  hero: Hero;
  value: SkillPick[];
  onChange?: (value: SkillPick[]) => void;
}

const levels = Array.from({ length: 18 }, (_, index) => index + 1);

export function SkillPlanner({ hero, value, onChange }: SkillPlannerProps) {
  const rows: SkillRow[] = [...hero.abilities, { key: 'stats', name: 'Характеристики', image: '' }];
  const sequence = value.slice(0, 18)
    .map((pick, index) => ({ level: index + 1, pick, name: rows.find((row) => row.key === pick)?.name || '' }))
    .filter((entry) => entry.pick !== '');

  function selectSkill(index: number, pick: SkillKey) {
    if (!onChange || (index === 0 && pick === 'stats')) return;
    const next = levels.map((_, levelIndex) => value[levelIndex] || '');
    next[index] = value[index] === pick ? '' : pick;
    onChange(next);
  }

  return (
    <div className={`skill-planner ${onChange ? 'skill-editable' : 'skill-readonly'}`}>
      <div className="skill-scroll" tabIndex={0} role="region" aria-label={`Прокачка способностей: ${hero.name}`}>
        <table className="skill-grid" aria-label={`Способности ${hero.name} по уровням`}>
          <thead>
            <tr>
              <th className="skill-label" scope="col">Способность</th>
              {levels.map((level) => (
                <th className={`skill-level${level % 6 === 0 ? ' skill-ultimate-level' : ''}`} scope="col" key={level}>
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={`skill-row skill-row-${row.key}`} key={row.key}>
                <th scope="row">
                  <div className="skill-ability">
                    {row.image ? (
                      <img className="skill-icon" src={row.image} alt="" width="40" height="40" loading="lazy" />
                    ) : <span className="skill-stats-icon" aria-hidden="true">+2</span>}
                    {row.key !== 'stats' && <kbd className="skill-key">{row.key.toUpperCase()}</kbd>}
                    <span className="skill-name">{row.name}</span>
                  </div>
                </th>
                {levels.map((level) => {
                  const index = level - 1;
                  const selected = value[index] === row.key;
                  const rank = value.slice(0, level).filter((pick) => pick === row.key).length;
                  const disabled = row.key === 'stats' && level === 1;
                  const label = disabled
                    ? 'Уровень 1: характеристики пока недоступны'
                    : `Уровень ${level}: ${row.name}${selected ? `, ранг ${rank}. Убрать выбор` : '. Выбрать'}`;
                  const choiceClass = `skill-choice ${selected ? 'skill-selected' : 'skill-empty'}${disabled ? ' skill-disabled' : ''}`;
                  const cellContent = selected ? (
                    <>
                      {row.image ? (
                        <img className="skill-pick-icon" src={row.image} alt="" width="34" height="34" loading="lazy" />
                      ) : <span className="skill-pick-stats" aria-hidden="true">+2</span>}
                      <span className="skill-rank">{rank}</span>
                    </>
                  ) : <span className="skill-empty-mark" aria-hidden="true">·</span>;

                  return (
                    <td className={`skill-cell${row.key === 'r' && level % 6 === 0 ? ' skill-ultimate-level' : ''}`} key={level}>
                      {onChange ? (
                        <button
                          className={choiceClass}
                          type="button"
                          aria-label={label}
                          aria-pressed={selected}
                          disabled={disabled}
                          onClick={() => selectSkill(index, row.key)}
                        >
                          {cellContent}
                        </button>
                      ) : (
                        <span className={choiceClass} title={selected ? `Уровень ${level}: ${row.name}, ранг ${rank}` : `Уровень ${level}: не выбрана`}>
                          {cellContent}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sequence.length > 0 && (
        <ol className="skill-sequence" aria-label="Выбранная последовательность навыков">
          {sequence.map((entry) => (
            <li className={`skill-sequence-item skill-sequence-${entry.pick}`} key={entry.level} title={`Уровень ${entry.level}: ${entry.name}`}>
              <span className="skill-sequence-level">{entry.level}</span>
              <strong>{entry.pick === 'stats' ? '+2' : entry.pick.toUpperCase()}</strong>
            </li>
          ))}
        </ol>
      )}

      <p className="skill-hint">
        {onChange
          ? 'Нажми на ячейку, чтобы выбрать навык на этом уровне. Повторный клик снимает выбор. Характеристики доступны со 2 уровня.'
          : 'Золотые ячейки показывают выбранные навыки. Число в ячейке — ранг способности.'}
      </p>
    </div>
  );
}
