import { Positional } from '../components/positional';
import { Sprite } from '../components/sprite';

export function render(display, entities, level) {
  const renderableEntities = entities.filter(isRenderable);
  renderableEntities
    .filter((e) => level.isEntityVisible(e))
    .forEach((e) => {
      const { positional, sprite } = getRenderComponents(e);
      const { startX, startY } = level.getScreenBounds();
      display.draw(
        positional.x - startX,
        positional.y - startY,
        sprite.char,
        sprite.fg,
        sprite.bg,
      );
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
