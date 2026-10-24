import type { Build } from '../types';
import { antimageBuilds, axeBuilds } from './builds/antimage-axe';
import { emberBuilds, medusaBuilds } from './builds/ember-medusa';
import { pudgeBuilds, warlockBuilds } from './builds/pudge-warlock';

export const seedBuilds: Build[] = [
  ...antimageBuilds,
  ...axeBuilds,
  ...emberBuilds,
  ...medusaBuilds,
  ...pudgeBuilds,
  ...warlockBuilds,
];

const originalIds = new Set([
  'am-farm', 'am-magic', 'axe-initiation', 'ember-vessel',
  'ember-magic', 'medusa-defense', 'pudge-frontline', 'warlock-teamfight',
]);

export const addedSeedBuilds = seedBuilds.filter((build) => !originalIds.has(build.id));
