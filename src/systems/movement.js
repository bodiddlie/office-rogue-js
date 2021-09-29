import { Movement } from '../components/movement';
import { Positional } from '../components/positional';

export function moveEntities(entities) {
  const movers = entities.filter((e) =>
    e.components.some((c) => c instanceof Movement)
  );
  movers.forEach((m) => {
    const pos = m.components.find((c) => c instanceof Positional);
    const move = m.components.find((c) => c instanceof Movement);
    pos.x += move.dx;
    pos.y += move.dy;
    const index = m.components.indexOf(move);
    m.components.splice(index, 1);
  });
}
