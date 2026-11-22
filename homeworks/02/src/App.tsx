import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import type { Match } from '../shared/options';
import { matchUrl } from './api';
import Resource from './components/Resource';
import MatchDetails from './pages/MatchDetails';
import MatchForm from './pages/MatchForm';
import MatchList from './pages/MatchList';

function MatchPage({ edit = false }: { edit?: boolean }) {
  const { id = '' } = useParams();
  return <Resource<Match> key={`${id}/${edit}`} url={matchUrl(id)}>{match => edit ? <MatchForm match={match} /> : <MatchDetails match={match} />}</Resource>;
}

export default function App() {
  return (
    <>
      <header className="topbar"><div className="topbar-inner">
        <Link className="brand" to="/matches" aria-label="Dota 2 — журнал матчей"><img src="/dota-logo.png" alt="Dota 2" /></Link>
        <Link className="nav-current" to="/matches">Журнал матчей</Link>
      </div></header>
      <main className="shell">
        <Routes>
          <Route path="/" element={<Navigate to="/matches" replace />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/matches/new" element={<MatchForm />} />
          <Route path="/matches/:id" element={<MatchPage />} />
          <Route path="/matches/:id/edit" element={<MatchPage edit />} />
          <Route path="*" element={<div className="state"><h1>Страница не найдена</h1><Link to="/matches">К журналу</Link></div>} />
        </Routes>
      </main>
    </>
  );
}
