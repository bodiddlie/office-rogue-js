import { Movement } from '../components/movement';
import { Player } from '../components/player';

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

const SWIPE_THRESHOLD = 25;

export function handleInput(event, entities) {
  let delta;
  if (event instanceof TouchEvent) {
    delta = handleTouches(event);
  } else if (event instanceof KeyboardEvent) {
    delta = MOVE_KEYS[event.key];
  }

  if (delta) {
    const player = entities.find((e) => !!e.components.get(Player));
    const movement = new Movement(delta[0], delta[1]);
    player.addComponent(Movement, movement);
  }
}

function handleTouches(event) {
  const deltaX = event.changedTouches[0].clientX - event._touchStart.clientX;
  const deltaY = event.changedTouches[0].clientY - event._touchStart.clientY;

  if (
    Math.abs(deltaX) > SWIPE_THRESHOLD ||
    Math.abs(deltaY) > SWIPE_THRESHOLD
  ) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      //horizontal swipe
      return [Math.sign(deltaX), 0];
    } else {
      //vertical swipe
      return [0, Math.sign(deltaY)];
    }
  } else {
    const map = document.querySelector('#map');
    const cx = map.offsetWidth / 2;
    const cy = map.offsetHeight / 2;
    const dx = event.changedTouches[0].clientX - cx;
    const dy = event.changedTouches[0].clientY - cy;

    if (Math.abs(dx) > Math.abs(dy)) {
      return [Math.sign(dx), 0];
    } else {
      return [0, Math.sign(dy)];
    }
  }
}
