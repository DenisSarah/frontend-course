import { useState } from 'react';
import { createTeam, updateTeam } from '../api.js';
import { positions, regions } from '../../shared/options.js';
import { Modal } from './Modal.jsx';

export function TeamForm({ team, onClose, onSaved }) {
  const [name, setName] = useState(team?.name || '');
  const [region, setRegion] = useState(team?.region || regions[0].value);
  const [description, setDescription] = useState(team?.description || '');
  const [recruiting, setRecruiting] = useState(team ? team.recruiting : true);
  const [players, setPlayers] = useState(() => positions.map((position) => {
    const player = team?.players.find((item) => item.position === position.value);
    return { position: position.value, nickname: player?.nickname || '' };
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updatePlayer(position, nickname) {
    setPlayers((current) => current.map((player) => (
      player.position === position ? { ...player, nickname } : player
    )));
  }

  async function saveTeam(event) {
    event.preventDefault();
    if (saving) return;

    const payload = {
      name: name.trim(),
      region,
      description: description.trim(),
      recruiting,
      players: players
        .filter((player) => player.nickname.trim() !== '')
        .map((player) => ({ position: player.position, nickname: player.nickname.trim() })),
    };

    setSaving(true);
    setError('');

    try {
      const savedTeam = team ? await updateTeam(team.id, payload) : await createTeam(payload);
      onSaved(savedTeam);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={team ? 'Редактировать команду' : 'Новая команда'} onClose={onClose} busy={saving}>
      <form onSubmit={saveTeam}>
        <fieldset className="team-fields" disabled={saving}>
          <div className="field-row">
            <label className="field name-field">
              Название команды
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, Ночной патруль" minLength="2" maxLength="50" required />
            </label>
            <label className="field">
              Регион
              <select value={region} onChange={(event) => setRegion(event.target.value)} required>
                {regions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>

          <label className="field">
            О команде
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Когда играете и кого ищете?" maxLength="300" rows="3" />
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={recruiting} onChange={(event) => setRecruiting(event.target.checked)} />
            Открыт набор игроков
          </label>

          <div>
            <h3 className="roster-heading">Состав команды</h3>
            <p className="form-hint">Пустой ник — свободное место</p>
          </div>

          <div className="players-editor">
            {players.map((player) => (
              <div className="player-row" key={player.position}>
                <div className="position-name">
                  <span className="position-number">{player.position}</span>
                  <span>{positions.find((position) => position.value === player.position).label}</span>
                </div>
                <label className="field">
                  Никнейм
                  <input value={player.nickname} onChange={(event) => updatePlayer(player.position, event.target.value)} placeholder="Свободно" maxLength="24" />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {error && <p className="error-message form-error" role="alert">{error}</p>}

        <div className="modal-actions">
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Сохраняем…' : team ? 'Сохранить изменения' : 'Создать команду'}
          </button>
          <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>Отмена</button>
        </div>
      </form>
    </Modal>
  );
}
