import { useEffect, useState } from 'react';
import { getTeam, setRecruiting, deleteTeam } from '../api.js';
import { positions, regions } from '../../shared/options.js';
import { Modal } from './Modal.jsx';

export function TeamDetails({ id, onClose, onEdit, onChanged, onDeleted }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getTeam(id, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setTeam(data);
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError' && !controller.signal.aborted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, retry]);

  function loadAgain() {
    setError('');
    setLoading(true);
    setRetry((current) => current + 1);
  }

  async function toggleRecruiting() {
    setAction('recruiting');
    setError('');
    try {
      const updatedTeam = await setRecruiting(team.id, !team.recruiting);
      setTeam(updatedTeam);
      onChanged();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAction('');
    }
  }

  async function removeTeam() {
    if (action !== '' || !confirmingDelete) return;

    setAction('delete');
    setError('');
    try {
      await deleteTeam(team.id);
      onDeleted();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAction('');
    }
  }

  const region = team && (regions.find((option) => option.value === team.region)?.label || team.region);

  return (
    <Modal title={team ? team.name : 'Состав команды'} onClose={onClose} busy={action !== ''}>
      {loading && <p className="loading-message" role="status">Загружаем состав…</p>}
      {error && <p className="error-message" role="alert">{error}</p>}

      {!loading && !team && (
        <button className="secondary-button" type="button" onClick={loadAgain}>Попробовать ещё раз</button>
      )}

      {!loading && team && (
        <>
          <div className="detail-summary">
            <span>{region}</span>
            <span className={team.recruiting ? 'recruiting-badge open' : 'recruiting-badge'}>
              {team.recruiting ? 'Открыт набор' : 'Набор закрыт'}
            </span>
          </div>
          <p className="detail-description">{team.description || 'Команда пока не добавила описание.'}</p>

          <h3 className="roster-heading">Состав команды</h3>
          <ul className="detail-roster">
            {positions.map((position) => {
              const player = team.players.find((item) => item.position === position.value);
              return (
                <li key={position.value} className={player ? '' : 'vacant-row'}>
                  <div className="position-name">
                    <span className="position-number">{position.value}</span>
                    <span>{position.label}</span>
                  </div>
                  {player ? (
                    <div className="player-info">
                      <strong>{player.nickname}</strong>
                    </div>
                  ) : <span className="vacant-label">Свободная позиция</span>}
                </li>
              );
            })}
          </ul>

          {confirmingDelete ? (
            <div className="error-message form-error" role="group" aria-labelledby="delete-confirmation-heading">
              <p id="delete-confirmation-heading">Удалить команду «{team.name}» и её состав?</p>
              <div className="modal-actions">
                <button className="danger-button" type="button" onClick={removeTeam} disabled={action !== ''}>
                  {action === 'delete' ? 'Удаляем…' : 'Да, удалить'}
                </button>
                <button className="secondary-button" type="button" onClick={() => setConfirmingDelete(false)} disabled={action !== ''} autoFocus>
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-actions">
              <button className="primary-button" type="button" onClick={() => onEdit(team)} disabled={action !== ''}>
                Редактировать
              </button>
              <button className="secondary-button" type="button" onClick={toggleRecruiting} disabled={action !== ''}>
                {action === 'recruiting' ? 'Сохраняем…' : team.recruiting ? 'Закрыть набор' : 'Открыть набор'}
              </button>
              <button className="danger-button" type="button" onClick={() => setConfirmingDelete(true)} disabled={action !== ''}>
                Удалить команду
              </button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
