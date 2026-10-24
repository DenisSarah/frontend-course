import { heroes } from '../data/heroes';
import { items } from '../data/items';
import { itemStages, positions, situations } from '../data/options';
import type { AbilityKey, Build, BuildDraft, Filters, HeroId, SkillPick } from '../types';

const heroIds = new Set<string>(heroes.map((hero) => hero.id));
const itemIds = new Set(items.map((item) => item.id));
const situationIds = new Set<string>(situations.map((situation) => situation.value));
const positionIds = new Set<number>(positions.map((position) => position.value));

function normalize(value: string) {
  return value.trim().toLowerCase().replaceAll('ё', 'е');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry: unknown) => typeof entry === 'string');
}

function isSkillPick(value: unknown): value is SkillPick {
  return value === '' || value === 'stats' || value === 'q' || value === 'w' || value === 'e' || value === 'r';
}

function hasDraftShape(value: unknown): value is BuildDraft {
  if (!isRecord(value)) return false;
  if (typeof value.title !== 'string' || typeof value.description !== 'string' || typeof value.talentNotes !== 'string') return false;
  if (typeof value.heroId !== 'string' || !heroIds.has(value.heroId)) return false;
  if (typeof value.position !== 'number' || !positionIds.has(value.position)) return false;
  if (!isStringArray(value.allyIds) || value.allyIds.some((id) => !heroIds.has(id))) return false;
  if (!isStringArray(value.enemyIds) || value.enemyIds.some((id) => !heroIds.has(id))) return false;
  if (!isStringArray(value.situationIds) || value.situationIds.some((id) => !situationIds.has(id))) return false;
  if (!Array.isArray(value.skillBuild) || !value.skillBuild.every(isSkillPick)) return false;
  if (!isRecord(value.itemBuild) || Object.keys(value.itemBuild).length !== itemStages.length) return false;
  const stages = value.itemBuild;
  return itemStages.every((stage) => isStringArray(stages[stage.value]));
}

export function createEmptyDraft(heroId: HeroId = 'antimage'): BuildDraft {
  const hero = heroes.find((entry) => entry.id === heroId);
  if (!hero) throw new Error('Герой не найден.');
  return {
    title: '',
    heroId,
    position: hero.positions[0] ?? 1,
    allyIds: [],
    enemyIds: [],
    situationIds: [],
    description: '',
    itemBuild: { start: [], early: [], core: [], late: [], situational: [] },
    skillBuild: Array<SkillPick>(18).fill(''),
    talentNotes: '',
  };
}

export function validateSkillBuild(skills: SkillPick[]): string {
  if (!Array.isArray(skills) || skills.length !== 18 || !skills.every(isSkillPick)) {
    return 'План способностей должен содержать 18 уровней с допустимыми значениями.';
  }
  const ranks: Record<AbilityKey, number> = { q: 0, w: 0, e: 0, r: 0 };
  let stats = 0;
  for (const [index, skill] of skills.entries()) {
    const level = index + 1;
    if (skill === '') continue;
    if (skill === 'stats') {
      stats += 1;
      if (level < 2) return 'Характеристики можно повышать начиная со 2 уровня.';
      if (stats > 7) return 'Характеристики можно повысить не больше семи раз.';
      continue;
    }
    ranks[skill] += 1;
    const rank = ranks[skill];
    if (skill === 'r') {
      if (rank > 3) return 'Ультимейт можно повысить не больше трёх раз.';
      if (level < rank * 6) return `Уровень ${rank} ультимейта доступен начиная с ${rank * 6} уровня героя.`;
    } else {
      if (rank > 4) return `Способность ${skill.toUpperCase()} можно повысить не больше четырёх раз.`;
      if (level < rank * 2 - 1) return `Уровень ${rank} способности ${skill.toUpperCase()} доступен начиная с ${rank * 2 - 1} уровня героя.`;
    }
  }
  return '';
}

export function validateDraft(draft: BuildDraft): string {
  if (!hasDraftShape(draft)) return 'Данные сборки имеют неверный формат или содержат неизвестные значения.';
  if (draft.title.trim().length < 2 || draft.title.trim().length > 80) return 'Название должно содержать от 2 до 80 символов.';
  if (draft.description.length > 2000) return 'Описание должно содержать не больше 2000 символов.';
  if (draft.talentNotes.length > 1000) return 'Заметки о талантах должны содержать не больше 1000 символов.';
  if (draft.allyIds.length > 4) return 'Можно выбрать не больше четырёх союзников.';
  if (draft.enemyIds.length > 5) return 'Можно выбрать не больше пяти противников.';
  if (new Set(draft.allyIds).size !== draft.allyIds.length || new Set(draft.enemyIds).size !== draft.enemyIds.length) {
    return 'Герои в каждом списке не должны повторяться.';
  }
  if (new Set(draft.situationIds).size !== draft.situationIds.length) return 'Игровые ситуации не должны повторяться.';
  if (draft.allyIds.includes(draft.heroId) || draft.enemyIds.includes(draft.heroId)) return 'Герой сборки не может быть союзником или противником самому себе.';
  if (draft.allyIds.some((id) => draft.enemyIds.includes(id))) return 'Один герой не может одновременно быть союзником и противником.';
  for (const stage of itemStages) {
    const stageItems = draft.itemBuild[stage.value];
    if (stageItems.length > 8) return 'На каждом этапе можно выбрать не больше восьми предметов.';
    if (stageItems.some((id) => !itemIds.has(id))) return 'Выберите предметы из каталога.';
  }
  if (itemStages.every((stage) => draft.itemBuild[stage.value].length === 0)) return 'Добавьте хотя бы один предмет.';
  const skillError = validateSkillBuild(draft.skillBuild);
  if (skillError) return skillError;
  if (!draft.skillBuild.some((skill) => skill !== '' && skill !== 'stats')) return 'Выберите хотя бы одну способность.';
  return '';
}

export function isStoredBuilds(value: unknown): value is Build[] {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  return value.every((entry: unknown) => {
    if (!hasDraftShape(entry) || !isRecord(entry) || validateDraft(entry) !== '') return false;
    if (typeof entry.id !== 'string' || entry.id.trim() === '' || ids.has(entry.id)) return false;
    if (typeof entry.createdAt !== 'string' || !Number.isFinite(Date.parse(entry.createdAt))) return false;
    if (typeof entry.updatedAt !== 'string' || !Number.isFinite(Date.parse(entry.updatedAt))) return false;
    ids.add(entry.id);
    return true;
  });
}

export function filterBuilds(builds: Build[], filters: Filters): Build[] {
  const search = normalize(filters.search);
  return builds.filter((build) => {
    const hero = heroes.find((entry) => entry.id === build.heroId);
    const text = normalize(`${build.title} ${hero?.name ?? ''} ${build.description}`);
    return text.includes(search)
      && (filters.heroId === '' || build.heroId === filters.heroId)
      && (filters.position === '' || build.position === filters.position)
      && (filters.allyId === '' || build.allyIds.includes(filters.allyId))
      && (filters.enemyId === '' || build.enemyIds.includes(filters.enemyId))
      && (filters.situationId === '' || build.situationIds.includes(filters.situationId));
  }).sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt));
}
