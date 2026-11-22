import { Link, useSearchParams } from 'react-router-dom';
import { heroes, results } from '../../shared/options';
import type { Match, Result } from '../../shared/options';
import { matchesUrl } from '../api';
import Resource from '../components/Resource';

const filters: { value: Result | ''; label: string }[] = [
  { value: '', label: 'Все матчи' }, { value: 'win', label: 'Победы' }, { value: 'loss', label: 'Поражения' },
];

export default function MatchList() {
  const [params, setParams] = useSearchParams();
  const result = params.get('result') || '';
  const url = result ? `${matchesUrl}?${new URLSearchParams({ result })}` : matchesUrl;
  return (
    <>
      <div className="page-heading journal-heading"><h1>Журнал матчей</h1><Link className="button primary" to="/matches/new">Добавить матч</Link></div>
      <nav className="filters" aria-label="Результат матча">
        {filters.map(f => <button key={f.value} className="filter" aria-pressed={result === f.value}
          onClick={() => setParams(f.value ? { result: f.value } : {})}>{f.label}</button>)}
      </nav>
      <Resource<Match[]> key={url} url={url}>{matches => matches.length ? (
        <section className="match-panel" aria-label="Список матчей">
          <div className="list-head" aria-hidden="true"><span>Герой</span><span>Результат</span><span>K / D / A</span><span /></div>
          <ul className="match-list">{matches.map(match => (
            <li key={match.id}><Link className="match-row" to={`/matches/${match.id}`}>
              <span className="hero-cell"><img className="hero-thumb" src={`/heroes/${match.hero}.png`} alt="" /><strong className="hero-name">{heroes[match.hero]}</strong></span>
              <span className={`result ${match.result}`}>{results[match.result]}</span>
              <span className="kda">{match.kills} / {match.deaths} / {match.assists}</span>
              <span className="row-arrow" aria-hidden="true">›</span>
            </Link></li>
          ))}</ul>
        </section>
      ) : <p className="state">{result ? 'Матчей с таким результатом нет.' : 'Матчей пока нет.'}</p>}</Resource>
    </>
  );
}
