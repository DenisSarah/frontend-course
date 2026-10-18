import { items } from './data.js';

export { items };

export const filterOptions = [
  { value: 'all', label: 'Все позиции', aliases: [] },
  { value: '1', label: '1 · Керри', aliases: ['carry'] },
  { value: '2', label: '2 · Мидер', aliases: ['мид', 'mid'] },
  { value: '3', label: '3 · Офлейнер', aliases: ['офлейн', 'offlane'] },
  { value: '4', label: '4 · Поддержка', aliases: ['саппорт', 'support', 'софт саппорт'] },
  {
    value: '5',
    label: '5 · Полная поддержка',
    aliases: ['фуллсаппорт', 'фулл саппорт', 'хард саппорт', 'hard support'],
  },
];

export function matchesQuery(item, query) {
  const words = normalize(query).trim().split(/[\s-]+/);
  const searchableWords = normalize(
    [
      item.name,
      ...item.aliases,
      item.attribute,
      item.attackType,
      ...item.positions.map(getPositionSearchText),
    ].join(' '),
  ).split(/[\s-]+/);

  return words.every((word) => searchableWords.some((candidate) => candidate.startsWith(word)));
}

export function matchesOption(item, selectedValue) {
  return selectedValue === 'all' || item.positions.includes(Number(selectedValue));
}

function getPositionLabel(position) {
  return filterOptions.find((option) => option.value === String(position)).label;
}

function getPositionSearchText(position) {
  const option = filterOptions.find((candidate) => candidate.value === String(position));
  return [option.label, ...option.aliases].join(' ');
}

function normalize(value) {
  return value.toLowerCase().replaceAll('ё', 'е');
}

export function getKey(item) {
  return item.id;
}

export function renderItem(item) {
  return <HeroCard item={item} />;
}

function HeroCard({ item }) {
  return (
    <article className="hero-card" data-attribute={item.attribute}>
      <div className="hero-card__portrait">
        <img src={item.image} alt="" width="256" height="144" loading="lazy" />
        <span className="hero-card__attribute">{item.attribute}</span>
      </div>
      <div className="hero-card__body">
        <h3 className="hero-card__name">{item.name}</h3>
        <ul className="hero-card__positions" aria-label="Позиции героя">
          {item.positions.map((position, index) => (
            <li
              key={position}
              title={index === 0 ? 'Самая частая позиция в выборке' : undefined}
            >
              {getPositionLabel(position)}
            </li>
          ))}
        </ul>
        <p className="hero-card__description">{item.description}</p>
        <div className="hero-card__details">
          <span>{item.attackType}</span>
          <span className="hero-card__alias">{item.aliases[0]}</span>
        </div>
      </div>
    </article>
  );
}
