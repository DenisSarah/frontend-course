import { Link } from 'react-router-dom';
import { heroes, results, stats } from '../../shared/options';
import type { Match } from '../../shared/options';
import { deleteMatch } from '../api';
import useMatchAction from '../useMatchAction';

export default function MatchDetails({ match }: { match: Match }) {
  const { run, error, pending } = useMatchAction();
  function remove() {
    if (window.confirm(`Удалить матч за ${heroes[match.hero]}?`)) {
      void run(async signal => {
        await deleteMatch(match.id, signal);
        return '/matches';
      });
    }
  }
  return (
    <>
      <Link className="back-link" to="/matches">← К журналу</Link>
      <section className="detail-panel">
        <div className="detail-heading">
          <img className="hero-portrait" src={`/heroes/${match.hero}.png`} alt="" />
          <div><h1>{heroes[match.hero]}</h1><span className={`result ${match.result}`}>{results[match.result]}</span></div>
        </div>
        <dl className="stats">
          {stats.map(([key, label]) => (
            <div className="stat" key={key}><dt>{label}</dt><dd>{match[key]}</dd></div>
          ))}
        </dl>
        {match.note && <section className="note"><h2>Заметка</h2><p>{match.note}</p></section>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="actions">
          <Link className="button primary" to={`/matches/${match.id}/edit`}>Редактировать</Link>
          <button className="button danger" disabled={pending} onClick={remove}>{pending ? 'Удаление…' : 'Удалить'}</button>
        </div>
      </section>
    </>
  );
}
