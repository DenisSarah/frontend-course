import qs from 'qs';

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Не удалось связаться с сервером. Попробуй ещё раз.', { cause: error });
  }

  if (response.status === 204) return;

  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Не удалось прочитать ответ сервера. Попробуй ещё раз.', { cause: error });
  }

  if (!response.ok) throw new Error(data.error || 'Не удалось выполнить действие.');
  return data;
}

export function getTeams(filters = {}, { signal } = {}) {
  const query = {
    filter: { search: filters.search || '', region: filters.region || '' },
    positions: filters.positions || [],
  };
  if (filters.recruiting) query.filter.recruiting = true;
  return request(`/api/teams${qs.stringify(query, { addQueryPrefix: true, arrayFormat: 'brackets' })}`, { signal });
}

export function getTeam(id, { signal } = {}) {
  return request(`/api/teams/${encodeURIComponent(id)}`, { signal });
}

export function createTeam(team) {
  return request('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify(team),
  });
}

export function updateTeam(id, team) {
  return request(`/api/teams/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
}

export function setRecruiting(id, recruiting) {
  return request(`/api/teams/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recruiting }),
  });
}

export function deleteTeam(id) {
  return request(`/api/teams/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
