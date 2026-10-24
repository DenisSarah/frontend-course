import type { ItemStage, Position, SituationId } from '../types';

export const positions: { value: Position; label: string }[] = [
  { value: 1, label: 'Керри' },
  { value: 2, label: 'Мидер' },
  { value: 3, label: 'Офлейнер' },
  { value: 4, label: 'Поддержка' },
  { value: 5, label: 'Полная поддержка' },
];

export const itemStages: { value: ItemStage; label: string }[] = [
  { value: 'start', label: 'Начальная закупка' },
  { value: 'early', label: 'Ранняя игра' },
  { value: 'core', label: 'Основные предметы' },
  { value: 'late', label: 'Поздняя игра' },
  { value: 'situational', label: 'По ситуации' },
];

export const situations: { value: SituationId; label: string }[] = [
  { value: 'balanced', label: 'Равная игра' },
  { value: 'ahead', label: 'Преимущество' },
  { value: 'behind', label: 'Отставание' },
  { value: 'magic', label: 'Много магического урона' },
  { value: 'physical', label: 'Много физического урона' },
  { value: 'push', label: 'Давление на линии' },
  { value: 'defense', label: 'Защита базы' },
];

export const emptyFilters = { search: '', heroId: '', position: '', allyId: '', enemyId: '', situationId: '' } as const;
