import type { Match, MatchDraft } from '../shared/options';

export const matchesUrl = '/api/matches';

export function matchUrl(id: string) {
  return `${matchesUrl}/${encodeURIComponent(id)}`;
}

async function request(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Ошибка сервера (${response.status})`);
  }
  return response;
}

export async function load<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await request(url, { signal });
  return response.json();
}

export async function saveMatch(draft: MatchDraft, id: string | undefined, signal: AbortSignal): Promise<Match> {
  const response = await request(id ? matchUrl(id) : matchesUrl, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
    signal,
  });
  return response.json();
}

export async function deleteMatch(id: string, signal: AbortSignal) {
  await request(matchUrl(id), { method: 'DELETE', signal });
}

export function errorMessage(error: unknown) {
  if (error instanceof TypeError) return 'Не удалось связаться с сервером.';
  return error instanceof Error ? error.message : 'Не удалось выполнить запрос.';
}
