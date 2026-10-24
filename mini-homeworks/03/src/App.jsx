import { useCallback, useMemo, useState } from 'react';
import { players } from './data.js';
import { getMatchingIds, getOrderedPlayers, togglePlayer } from './draft.js';
import { DraftPage } from './components/DraftPage.jsx';
import { MemoPlayerCard } from './components/PlayerCard.jsx';
import { useRenderLog } from './useRenderLog.js';

export function App({ localName = true }) {
  const [name, setName] = useState('Состав на вечер');
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [sort, setSort] = useState('name');
  const [selected, setSelected] = useState([]);
  useRenderLog('App');

  const matchingIds = useMemo(() => getMatchingIds(search, position), [search, position]);
  const orderedPlayers = useMemo(() => getOrderedPlayers(sort), [sort]);
  const selectedPlayers = players.filter((player) => selected.includes(player.id));

  const onToggle = useCallback((id) => {
    setSelected((current) => togglePlayer(current, id));
  }, []);

  return (
    <DraftPage
      name={name} onNameChange={setName}
      localName={localName}
      search={search} onSearchChange={setSearch}
      position={position} onPositionChange={setPosition}
      sort={sort} onSortChange={setSort}
      selectedPlayers={selectedPlayers}
      onClear={() => setSelected([])}
      count={matchingIds.size}
    >
      {orderedPlayers.map((player) => (
        <li key={player.id} hidden={!matchingIds.has(player.id)}>
          <MemoPlayerCard player={player} selected={selected.includes(player.id)} onToggle={onToggle} />
        </li>
      ))}
    </DraftPage>
  );
}
