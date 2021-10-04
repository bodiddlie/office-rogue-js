import { Movement } from '../components/movement';
import { Positional } from '../components/positional';

export function moveEntities(entities) {
  const movers = entities.filter((e) => !!e.components.get(Movement));
  movers.forEach((m) => {
    const pos = m.components.get(Positional);
    const move = m.components.get(Movement);
    pos.x += move.dx;
    pos.y += move.dy;
    m.removeComponent(Movement);
  });
}
