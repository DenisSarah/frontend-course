import { heroes } from '../data/heroes';
import type { HeroId } from '../types';

interface HeroPickerProps {
  label: string;
  value: HeroId[];
  unavailableIds: HeroId[];
  max: number;
  onChange: (value: HeroId[]) => void;
}

export function HeroPicker({ label, value, unavailableIds, max, onChange }: HeroPickerProps) {
  function toggleHero(id: HeroId) {
    onChange(value.includes(id) ? value.filter((heroId) => heroId !== id) : [...value, id]);
  }

  return (
    <fieldset>
      <legend>{label} · {value.length}/{max}</legend>
      <div className="hero-options">
        {heroes.map((hero) => {
          const checked = value.includes(hero.id);
          const disabled = !checked && (unavailableIds.includes(hero.id) || value.length >= max);

          return (
            <label className={`hero-choice${checked ? ' selected' : ''}${disabled ? ' disabled' : ''}`} key={hero.id}>
              <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleHero(hero.id)} />
              <img src={hero.image} alt="" width="96" height="54" loading="lazy" />
              <span>{hero.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
