import { useEffect, useRef, useState } from 'react';
import { addedSeedBuilds, seedBuilds } from '../data/seeds';
import { isStoredBuilds, validateDraft } from '../lib/builds';
import type { Build, BuildDraft } from '../types';

const storageKey = 'frontend-course-builds-v1';
const seedUpdateKey = 'frontend-course-builds-seeds-v2';

function loadBuilds() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) return { builds: structuredClone(seedBuilds), blocked: false, error: '' };
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredBuilds(parsed)) throw new Error('Неверный формат сборок');
    const savedIds = new Set(parsed.map((build) => build.id));
    const additions = parsed.length > 0 && localStorage.getItem(seedUpdateKey) !== '1'
      ? addedSeedBuilds.filter((build) => !savedIds.has(build.id)) : [];
    return { builds: [...parsed, ...structuredClone(additions)], blocked: false, error: '' };
  } catch {
    return {
      builds: [] as Build[],
      blocked: true,
      error: 'Не удалось прочитать сохранённые сборки. Данные оставлены без изменений. Для восстановления примеров сначала будет создана резервная копия.',
    };
  }
}

function copyDraft(draft: BuildDraft): BuildDraft {
  return {
    title: draft.title.trim(),
    heroId: draft.heroId,
    position: draft.position,
    allyIds: [...draft.allyIds],
    enemyIds: [...draft.enemyIds],
    situationIds: [...draft.situationIds],
    description: draft.description.trim(),
    itemBuild: structuredClone(draft.itemBuild),
    skillBuild: [...draft.skillBuild],
    talentNotes: draft.talentNotes.trim(),
  };
}

export function useBuilds() {
  const [initial] = useState(loadBuilds);
  const [builds, setBuilds] = useState<Build[]>(initial.builds);
  const [storageError, setStorageError] = useState(initial.error);
  const [storageBlocked, setStorageBlocked] = useState(initial.blocked);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const buildsRef = useRef(builds);
  const blockedRef = useRef(storageBlocked);

  useEffect(() => {
    if (storageBlocked) return;
    let active = true;
    let error = '';
    try {
      localStorage.setItem(storageKey, JSON.stringify(builds));
      localStorage.setItem(seedUpdateKey, '1');
    } catch {
      error = 'Не удалось сохранить сборки в браузере. Изменения остаются в памяти этой вкладки. Повторите сохранение, прежде чем закрывать её.';
    }
    queueMicrotask(() => {
      if (active) setStorageError(error);
    });
    return () => { active = false; };
  }, [builds, storageBlocked, saveAttempt]);

  function requireStorageReady() {
    if (blockedRef.current) throw new Error('Сначала восстановите данные с резервной копией повреждённого сохранения.');
  }

  function saveBuild(draft: BuildDraft, id?: string): Build {
    requireStorageReady();
    const error = validateDraft(draft);
    if (error) throw new Error(error);
    const previous = id === undefined ? undefined : buildsRef.current.find((build) => build.id === id);
    if (id !== undefined && !previous) throw new Error('Сборка не найдена.');
    const now = new Date().toISOString();
    const build: Build = {
      ...copyDraft(draft),
      id: previous?.id ?? crypto.randomUUID(),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    };
    const next = [build, ...buildsRef.current.filter((entry) => entry.id !== build.id)];
    buildsRef.current = next;
    setBuilds(next);
    return build;
  }

  function deleteBuild(id: string) {
    requireStorageReady();
    const next = buildsRef.current.filter((build) => build.id !== id);
    buildsRef.current = next;
    setBuilds(next);
  }

  function retrySave() {
    if (!blockedRef.current) setSaveAttempt((current) => current + 1);
  }

  function restoreDefaults() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) localStorage.setItem(`${storageKey}-backup-${crypto.randomUUID()}`, raw);
      const defaults = structuredClone(seedBuilds);
      localStorage.setItem(storageKey, JSON.stringify(defaults));
      buildsRef.current = defaults;
      blockedRef.current = false;
      setBuilds(defaults);
      setStorageBlocked(false);
      setStorageError('');
    } catch {
      setStorageError('Восстановление не выполнено: не удалось создать резервную копию или сохранить примеры. Исходные данные не перезаписаны.');
    }
  }

  return { builds, saveBuild, deleteBuild, storageError, retrySave, storageBlocked, restoreDefaults };
}
