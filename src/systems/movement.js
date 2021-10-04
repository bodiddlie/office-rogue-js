import { Movement } from '../components/movement';
import { Positional } from '../components/positional';

export function moveEntities(entities, level) {
  const movers = entities.filter((e) => !!e.components.get(Movement));
  movers.forEach((m) => {
    const pos = m.components.get(Positional);
    const move = m.components.get(Movement);
    const newX = pos.x + move.dx;
    const newY = pos.y + move.dy;

    if (level.isWalkable(newX, newY)) {
      pos.x = newX;
      pos.y = newY;
    }
    m.removeComponent(Movement);
  });
}
