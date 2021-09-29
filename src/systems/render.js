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
  return (
    entity.components.some((c) => c instanceof Sprite) &&
    entity.components.some((c) => c instanceof Positional)
  );
}

function getRenderComponents(entity) {
  const positional = entity.components.find((c) => c instanceof Positional);
  const sprite = entity.components.find((c) => c instanceof Sprite);
  if (positional && sprite) {
    return { positional, sprite };
  }

  return null;
}
