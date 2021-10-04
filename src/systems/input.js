import { Movement } from '../components/movement';
import { Player } from '../components/player';

const MOVE_KEYS = {
  h: [-1, 0],
  j: [0, 1],
  k: [0, -1],
  l: [1, 0],
};

export function handleInput(event, entities) {
  const player = entities.find((e) => !!e.components.get(Player));

  const delta = MOVE_KEYS[event.key];
  if (delta) {
    const movement = new Movement(delta[0], delta[1]);
    player.addComponent(Movement, movement);
  }
}
