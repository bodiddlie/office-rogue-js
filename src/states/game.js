import { Player } from '../components/player';
import { Positional } from '../components/positional';
import { Sprite } from '../components/sprite';
import { Entity } from '../entity';
import { handleInput } from '../systems/input';
import { moveEntities } from '../systems/movement';
import { render } from '../systems/render';

export class Game {
  constructor(engine) {
    this.engine = engine;
    const player = new Entity();
    player.addComponent(Positional, new Positional(10, 10));
    player.addComponent(Sprite, new Sprite('@', '#f00'));
    player.addComponent(Player, new Player());
    console.log(player);
    this.entities = [player];
  }

  update(event) {
    this.engine.mapDisplay.clear();

    if (event) {
      handleInput(event, this.entities);
    }
    moveEntities(this.entities);

    render(this.engine.mapDisplay, this.entities);

    return this;
  }
}
