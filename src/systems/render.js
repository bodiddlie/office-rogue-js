import { Positional } from '../components/positional';
import { Sprite } from '../components/sprite';

export function render(display, entities) {
  const renderableEntities = entities.filter(isRenderable);
  renderableEntities.forEach((e) => {
    const { positional, sprite } = getRenderComponents(e);
    display.draw(positional.x, positional.y, sprite.char, sprite.fg, sprite.bg);
  });
}

function isRenderable(entity) {
  return !!entity.components.get(Sprite) && !!entity.components.get(Positional);
}

function getRenderComponents(entity) {
  const positional = entity.components.get(Positional);
  const sprite = entity.components.get(Sprite);
  if (positional && sprite) {
    return { positional, sprite };
  }

  return null;
}
