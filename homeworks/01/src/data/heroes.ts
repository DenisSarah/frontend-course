import type { Hero } from '../types';

export const heroes: Hero[] = [
  {
    id: "antimage",
    name: "Anti-Mage",
    image: "/assets/heroes/antimage.png",
    positions: [1],
    abilities: [
      { key: "q", name: "Mana Break", image: "/assets/abilities/antimage_mana_break.png" },
      { key: "w", name: "Blink", image: "/assets/abilities/antimage_blink.png" },
      { key: "e", name: "Counterspell", image: "/assets/abilities/antimage_counterspell.png" },
      { key: "r", name: "Mana Void", image: "/assets/abilities/antimage_mana_void.png" },
    ],
  },
  {
    id: "axe",
    name: "Axe",
    image: "/assets/heroes/axe.png",
    positions: [3],
    abilities: [
      { key: "q", name: "Berserker's Call", image: "/assets/abilities/axe_berserkers_call.png" },
      { key: "w", name: "Battle Hunger", image: "/assets/abilities/axe_battle_hunger.png" },
      { key: "e", name: "Counter Helix", image: "/assets/abilities/axe_counter_helix.png" },
      { key: "r", name: "Culling Blade", image: "/assets/abilities/axe_culling_blade.png" },
    ],
  },
  {
    id: "ember_spirit",
    name: "Ember Spirit",
    image: "/assets/heroes/ember_spirit.png",
    positions: [2],
    abilities: [
      { key: "q", name: "Searing Chains", image: "/assets/abilities/ember_spirit_searing_chains.png" },
      { key: "w", name: "Sleight of Fist", image: "/assets/abilities/ember_spirit_sleight_of_fist.png" },
      { key: "e", name: "Flame Guard", image: "/assets/abilities/ember_spirit_flame_guard.png" },
      { key: "r", name: "Fire Remnant", image: "/assets/abilities/ember_spirit_fire_remnant.png" },
    ],
  },
  {
    id: "medusa",
    name: "Medusa",
    image: "/assets/heroes/medusa.png",
    positions: [1],
    abilities: [
      { key: "q", name: "Split Shot", image: "/assets/abilities/medusa_split_shot.png" },
      { key: "w", name: "Mystic Snake", image: "/assets/abilities/medusa_mystic_snake.png" },
      { key: "e", name: "Gorgon's Grasp", image: "/assets/abilities/medusa_gorgon_grasp.png" },
      { key: "r", name: "Stone Gaze", image: "/assets/abilities/medusa_stone_gaze.png" },
    ],
  },
  {
    id: "pudge",
    name: "Pudge",
    image: "/assets/heroes/pudge.png",
    positions: [4, 5, 3, 2],
    abilities: [
      { key: "q", name: "Meat Hook", image: "/assets/abilities/pudge_meat_hook.png" },
      { key: "w", name: "Rot", image: "/assets/abilities/pudge_rot.png" },
      { key: "e", name: "Meat Shield", image: "/assets/abilities/pudge_flesh_heap.png" },
      { key: "r", name: "Dismember", image: "/assets/abilities/pudge_dismember.png" },
    ],
  },
  {
    id: "warlock",
    name: "Warlock",
    image: "/assets/heroes/warlock.png",
    positions: [5, 4],
    abilities: [
      { key: "q", name: "Fatal Bonds", image: "/assets/abilities/warlock_fatal_bonds.png" },
      { key: "w", name: "Shadow Word", image: "/assets/abilities/warlock_shadow_word.png" },
      { key: "e", name: "Upheaval", image: "/assets/abilities/warlock_upheaval.png" },
      { key: "r", name: "Chaotic Offering", image: "/assets/abilities/warlock_rain_of_chaos.png" },
    ],
  },
];
