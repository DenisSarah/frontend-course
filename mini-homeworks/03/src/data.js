import snapshot from './players.json' with { type: 'json' };

export const positions = [
  { value: 1, label: 'Керри' },
  { value: 2, label: 'Мидер' },
  { value: 3, label: 'Офлейнер' },
  { value: 4, label: 'Поддержка' },
  { value: 5, label: 'Полная поддержка' },
];

export const players = snapshot.players;
export const snapshotInfo = snapshot.info;
