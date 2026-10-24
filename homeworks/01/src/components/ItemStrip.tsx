import { items } from '../data/items';

interface Props {
  ids: string[];
  names?: boolean;
}

export function ItemStrip({ ids, names = false }: Props) {
  return (
    <ol className={names ? 'item-strip with-names' : 'item-strip'}>
      {ids.map((id, index) => {
        const item = items.find((entry) => entry.id === id)!;
        return (
          <li key={`${id}-${index}`} title={`${index + 1}. ${item.name}`}>
            <div className="item-slot">
              <img src={item.image} alt={item.name} width="64" height="46" loading="lazy" />
              <span className="item-order" aria-hidden="true">{index + 1}</span>
            </div>
            {names && <span>{item.name}</span>}
          </li>
        );
      })}
    </ol>
  );
}
