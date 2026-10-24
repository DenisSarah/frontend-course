import { useState } from 'react';
import { players } from './data.js';
import { getMatchingIds, getOrderedPlayers, togglePlayer } from './draft.js';
import { DraftPage } from './components/DraftPage.jsx';
import { PlainPlayerCard } from './components/PlayerCard.jsx';
import { useRenderLog } from './useRenderLog.js';

export function Before() {
  const [name, setName] = useState('Состав на вечер');
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [sort, setSort] = useState('name');
  const [selected, setSelected] = useState([]);
  useRenderLog('App');

  const matchingIds = getMatchingIds(search, position);
  const orderedPlayers = getOrderedPlayers(sort);
  const selectedPlayers = players.filter((player) => selected.includes(player.id));

  function onToggle(id) {
    setSelected((current) => togglePlayer(current, id));
  }

  const cards = orderedPlayers.map((player) => (
    <li key={player.id} hidden={!matchingIds.has(player.id)}>
      <PlainPlayerCard player={player} selected={selected.includes(player.id)} onToggle={onToggle} />
    </li>
  ));

  return (
    <DraftPage
      name={name} onNameChange={setName}
      search={search} onSearchChange={setSearch}
      position={position} onPositionChange={setPosition}
      sort={sort} onSortChange={setSort}
      selectedPlayers={selectedPlayers}
      onClear={() => setSelected([])}
      count={matchingIds.size}
    >
      {cards}
    </DraftPage>
  );
}
