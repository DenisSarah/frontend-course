export const heroes = {
  antimage: 'Anti-Mage',
  axe: 'Axe',
  ember_spirit: 'Ember Spirit',
  medusa: 'Medusa',
  pudge: 'Pudge',
  warlock: 'Warlock',
} as const;

export const results = { win: 'Победа', loss: 'Поражение' } as const;

export const stats = [
  ['kills', 'Убийства'],
  ['deaths', 'Смерти'],
  ['assists', 'Помощь'],
] as const;

export type Hero = keyof typeof heroes;
export type Result = keyof typeof results;

export type MatchDraft = {
  hero: Hero;
  result: Result;
  kills: number;
  deaths: number;
  assists: number;
  note: string;
};

export type Match = MatchDraft & { id: string };
