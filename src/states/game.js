import { Player } from '../components/player';
import { Positional } from '../components/positional';
import { Sprite } from '../components/sprite';
import { MAP_HEIGHT, MAP_WIDTH } from '../constants';
import { Entity } from '../entity';
import { handleInput } from '../systems/input';
import { moveEntities } from '../systems/movement';
import { render } from '../systems/render';
import { Level } from '../world/level';

export class Game {
  constructor(engine) {
    this.engine = engine;
    const player = new Entity();
    player.addComponent(Positional, new Positional(10, 10));
    player.addComponent(Sprite, new Sprite('@', '#f00'));
    player.addComponent(Player, new Player());
    console.log(player);
    this.entities = [player];
    this.level = new Level(MAP_WIDTH, MAP_HEIGHT, this.engine.mapDisplay);
  }

  update(event) {
    this.engine.mapDisplay.clear();

    this.level.render();

    if (event) {
      handleInput(event, this.entities);
    }
    moveEntities(this.entities, this.level);

    render(this.engine.mapDisplay, this.entities);

    return this;
  }
}
