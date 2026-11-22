import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { heroes, results, stats } from '../../shared/options';
import type { Hero, Match, MatchDraft, Result } from '../../shared/options';
import { saveMatch } from '../api';
import useMatchAction from '../useMatchAction';

export default function MatchForm({ match }: { match?: Match }) {
  const { run, error, pending } = useMatchAction();
  const back = match ? `/matches/${match.id}` : '/matches';

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const draft: MatchDraft = {
      hero: fields.get('hero') as Hero,
      result: fields.get('result') as Result,
      kills: Number(fields.get('kills')),
      deaths: Number(fields.get('deaths')),
      assists: Number(fields.get('assists')),
      note: String(fields.get('note') || '').trim(),
    };
    void run(async signal => {
      const saved = await saveMatch(draft, match?.id, signal);
      return `/matches/${saved.id}`;
    });
  }

  return (
    <>
      <Link className="back-link" to={back}>{match ? '← К матчу' : '← К журналу'}</Link>
      <div className="page-heading"><h1>{match ? 'Редактировать матч' : 'Новый матч'}</h1></div>
      <form className="edit-panel" onSubmit={submit}>
        <fieldset disabled={pending}>
          <div className="form-grid">
            <label className="field">Герой
              <select name="hero" defaultValue={match?.hero || 'antimage'}>
                {Object.entries(heroes).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
              </select>
            </label>
            <label className="field">Результат
              <select name="result" defaultValue={match?.result || 'win'}>
                {Object.entries(results).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
              </select>
            </label>
          </div>
          <div className="kda-fields">
            {stats.map(([key, label]) => <label className="field" key={key}>{label}
              <input type="number" name={key} min="0" max="999" step="1" required defaultValue={match?.[key] ?? 0} />
            </label>)}
          </div>
          <label className="field">Заметка
            <textarea name="note" rows={4} maxLength={500} defaultValue={match?.note} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions">
            <button className="button primary" type="submit">{pending ? 'Сохранение…' : 'Сохранить'}</button>
            <Link className="button secondary" to={back}>Отмена</Link>
          </div>
        </fieldset>
      </form>
    </>
  );
}
