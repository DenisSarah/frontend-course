import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { heroes } from '../data/heroes';
import { positions, situations } from '../data/options';
import { validateDraft } from '../lib/builds';
import type { BuildDraft, HeroId, Position, SituationId, SkillPick } from '../types';
import { HeroPicker } from './HeroPicker';
import { ItemBuildEditor } from './ItemBuildEditor';
import { SkillPlanner } from './SkillPlanner';

interface BuildFormProps {
  initial: BuildDraft;
  editing: boolean;
  onSave: (draft: BuildDraft) => void;
  onCancel: () => void;
}

export function BuildForm({ initial, editing, onSave, onCancel }: BuildFormProps) {
  const [draft, setDraft] = useState<BuildDraft>(initial);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const hero = heroes.find((option) => option.id === draft.heroId) || heroes[0];

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function updateDraft(changes: Partial<BuildDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function changeHero(heroId: HeroId) {
    setDraft((current) => ({
      ...current,
      heroId,
      allyIds: current.allyIds.filter((id) => id !== heroId),
      enemyIds: current.enemyIds.filter((id) => id !== heroId),
      skillBuild: Array<SkillPick>(18).fill(''),
    }));
    setError('');
  }

  function toggleSituation(id: SituationId) {
    setDraft((current) => ({
      ...current,
      situationIds: current.situationIds.includes(id)
        ? current.situationIds.filter((value) => value !== id)
        : [...current.situationIds, id],
    }));
  }

  function saveBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateDraft(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    try {
      onSave(draft);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить сборку. Попробуй ещё раз.');
    }
  }

  return (
    <form className="form-page" onSubmit={saveBuild}>
      <section className="form-section">
        <h2>Основное</h2>
        <label className="field">
          Название сборки
          <input ref={titleRef} value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} minLength={2} maxLength={80} required />
        </label>

        <div className="field-row">
          <label className="field">
            Герой сборки
            <select value={draft.heroId} onChange={(event) => changeHero(event.target.value as HeroId)}>
              {heroes.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
          </label>
          <label className="field">
            Позиция
            <select value={draft.position} onChange={(event) => updateDraft({ position: Number(event.target.value) as Position })}>
              {positions.map((position) => <option key={position.value} value={position.value}>{position.value} · {position.label}</option>)}
            </select>
          </label>
        </div>

        <label className="field">
          Когда использовать
          <textarea value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} maxLength={2000} rows={5} />
        </label>
      </section>

      <section className="form-section">
        <h2>Составы</h2>
        <p className="form-hint">Герой сборки не входит в эти списки. Один герой может быть только в одном составе.</p>
        <div className="context-grid">
          <HeroPicker label="Союзники" value={draft.allyIds} unavailableIds={[draft.heroId, ...draft.enemyIds]} max={4} onChange={(allyIds) => updateDraft({ allyIds })} />
          <HeroPicker label="Противники" value={draft.enemyIds} unavailableIds={[draft.heroId, ...draft.allyIds]} max={5} onChange={(enemyIds) => updateDraft({ enemyIds })} />
        </div>
      </section>

      <section className="form-section">
        <h2>Ситуации</h2>
        <div className="situation-options">
          {situations.map((situation) => (
            <label className="checkbox-field" key={situation.value}>
              <input type="checkbox" checked={draft.situationIds.includes(situation.value)} onChange={() => toggleSituation(situation.value)} />
              {situation.label}
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>Предметы</h2>
        <p className="form-hint">До восьми предметов на этап. Повторные покупки можно добавлять отдельно.</p>
        <ItemBuildEditor value={draft.itemBuild} onChange={(itemBuild) => updateDraft({ itemBuild })} />
      </section>

      <section className="form-section">
        <h2>Навыки</h2>
        <p className="form-hint">Выбери навык для каждого уровня. Ненужные уровни можно оставить пустыми.</p>
        <SkillPlanner hero={hero} value={draft.skillBuild} onChange={(skillBuild) => updateDraft({ skillBuild })} />
      </section>

      <section className="form-section">
        <h2>Таланты и пояснения</h2>
        <label className="field">
          Выбор талантов и альтернативы
          <textarea value={draft.talentNotes} onChange={(event) => updateDraft({ talentNotes: event.target.value })} maxLength={1000} rows={4} />
        </label>
      </section>

      {error && <p className="error-message" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="primary-button" type="submit">{editing ? 'Сохранить изменения' : 'Создать сборку'}</button>
        <button className="secondary-button" type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
}
