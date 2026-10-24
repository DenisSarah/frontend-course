export type HeroId = 'antimage' | 'axe' | 'ember_spirit' | 'medusa' | 'pudge' | 'warlock';
export type Position = 1 | 2 | 3 | 4 | 5;
export type AbilityKey = 'q' | 'w' | 'e' | 'r';
export type SkillPick = AbilityKey | 'stats' | '';
export type ItemStage = 'start' | 'early' | 'core' | 'late' | 'situational';
export type SituationId = 'balanced' | 'ahead' | 'behind' | 'magic' | 'physical' | 'push' | 'defense';

export interface Ability {
  key: AbilityKey;
  name: string;
  image: string;
}

export interface Hero {
  id: HeroId;
  name: string;
  image: string;
  positions: Position[];
  abilities: Ability[];
}

export interface Item {
  id: string;
  name: string;
  image: string;
}

export interface BuildDraft {
  title: string;
  heroId: HeroId;
  position: Position;
  allyIds: HeroId[];
  enemyIds: HeroId[];
  situationIds: SituationId[];
  description: string;
  itemBuild: Record<ItemStage, string[]>;
  skillBuild: SkillPick[];
  talentNotes: string;
}

export interface Build extends BuildDraft {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  search: string;
  heroId: HeroId | '';
  position: Position | '';
  allyId: HeroId | '';
  enemyId: HeroId | '';
  situationId: SituationId | '';
}
