import { Movement } from '../components/movement';
import { Player } from '../components/player';
import { Positional } from '../components/positional';

const MOVE_KEYS = {
  h: [-1, 0],
  j: [0, 1],
  k: [0, -1],
  l: [1, 0],
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function handleInput(event, entities) {
  let delta;
  if (event instanceof TouchEvent) {
    delta = handleTouches(event, entities);
  } else if (event instanceof KeyboardEvent) {
    delta = MOVE_KEYS[event.key];
  }

  if (delta) {
    const player = entities.find((e) => !!e.components.get(Player));
    const movement = new Movement(delta[0], delta[1]);
    player.addComponent(Movement, movement);
  }
}

function handleTouches(event, entities) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = event.changedTouches[0].clientX - cx;
  const dy = event.changedTouches[0].clientY - cy;

  if (Math.abs(dx) > Math.abs(dy)) {
    return [Math.sign(dx), 0];
  } else {
    return [0, Math.sign(dy)];
  }
}
